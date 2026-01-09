<?php

namespace App\Http\Controllers; // Adjust if your file is directly in Controllers

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // Required for transactions
use App\Notifications\BookingStatusUpdated;
use Illuminate\Support\Facades\Notification;
use App\Models\User;

class BookingController extends Controller
{
    /**
     * Fetch all bookings (Admin View & Client History)
     */
public function index(Request $request)
    {
        // We define the relationships here to use them in both spots.
        // Added 'sweepstar' so you can see who accepted the job.
        $relationships = ['user', 'address', 'services', 'review', 'sweepstar'];

        // 1. Client View: Only show THEIR bookings
        if ($request->user()->role === 'client') {
             return response()->json([
                'bookings' => Booking::where('user_id', $request->user()->id)
                                     ->with($relationships)
                                     ->orderBy('created_at', 'desc')
                                     ->get()
             ]);
        }

        // 2. Admin View: Show EVERYTHING
        // This will now include the Client (user), the Worker (sweepstar), and the Cancellation Reason (part of the main table)
        $bookings = Booking::with($relationships)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'bookings' => $bookings
        ]);
    }

    /**
     * Store a newly created booking
     */
    public function store(Request $request)
    {
        // 1. Validate
        $validated = $request->validate([
            'address_id'   => 'required|exists:addresses,id',
            'scheduled_at' => 'required|date|after:now',
            'notes'        => 'nullable|string',
            'service_ids'  => 'required|array|min:1',
            'service_ids.*'=> 'exists:services,id',
        ]);

        return DB::transaction(function () use ($request, $validated) {
            // 2. Fetch Services to calculate total price securely
            $services = Service::whereIn('id', $validated['service_ids'])->get();
            $totalPrice = $services->sum('base_price');

            // 3. Create the Booking
            $booking = Booking::create([
                'user_id'      => $request->user()->id,
                'address_id'   => $validated['address_id'],
                'scheduled_at' => $validated['scheduled_at'],
                'status'       => 'pending',
                'total_price'  => $totalPrice,
                'notes'        => $validated['notes'] ?? null,
            ]);

            // 4. Attach Services with Pivot Data
            // We save the price at the moment of booking so price changes don't affect old logs
            $pivotData = [];
            foreach ($services as $service) {
                $pivotData[$service->id] = ['price_at_booking' => $service->base_price];
            }
            $booking->services()->attach($pivotData);

            // ====================================================
            // NEW: NOTIFICATION SYSTEM
            // ====================================================

            // A. Find all users who are Sweepstars
            $sweepstars = User::where('role', 'sweepstar')->get();

            // B. Send the notification
            // We use the address city to make it relevant
            // Note: $booking->address works because of the relationship in the Booking model
            Notification::send($sweepstars, new BookingStatusUpdated(
                "New job available in " . $booking->address->city,
                $booking->id
            ));

            // ====================================================

            // 5. Load relationships and Return
            return response()->json([
                'message' => 'Booking created successfully!',
                'booking' => $booking->load(['services', 'address'])
            ], 201);
        });
    }

    /**
     * Display single booking details
     */
    public function show(Request $request, Booking $booking)
    {
        // Security check
        if ($request->user()->role !== 'admin' &&
            $request->user()->role !== 'sweepstar' &&
            $request->user()->id !== $booking->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $booking->load(['user', 'address', 'services']);

        return response()->json($booking);
    }

    /**
     * Update booking (Admin or Client)
     */
public function update(Request $request, Booking $booking)
    {
        // 1. Authorization: Ensure user is Admin OR the Owner of the booking
        if ($request->user()->role !== 'admin' && $request->user()->id !== $booking->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 2. State Check: Prevent editing finalized bookings
        if (in_array($booking->status, ['completed', 'cancelled'])) {
            return response()->json(['message' => 'Cannot edit a finalized booking.'], 400);
        }

        // 3. Validation
        $validated = $request->validate([
            'scheduled_at'  => 'sometimes|date|after:now',
            'notes'         => 'nullable|string',
            'status'        => 'sometimes|string|in:pending,confirmed,cancelled', // Add 'in' rule for safety

            // Validate Address exists AND belongs to the user
            'address_id'    => [
                'sometimes',
                'exists:addresses,id',
                function ($attribute, $value, $fail) use ($booking) {
                    $address = \App\Models\Address::find($value);
                    if ($address && $address->user_id !== $booking->user_id) {
                        $fail('The selected address does not belong to you.');
                    }
                }
            ],

            // Validate Services (Array of IDs)
            'service_ids'   => 'sometimes|array',
            'service_ids.*' => 'exists:services,id',
        ]);

        // 4. Update Basic Fields
        $booking->fill($request->only(['scheduled_at', 'notes', 'address_id', 'status']));

        // 5. Handle Service Changes (CRITICAL: Recalculate Price)
        if ($request->has('service_ids')) {
            // Fetch the actual service models to get their prices
            $services = \App\Models\Service::whereIn('id', $validated['service_ids'])->get();

            // A. Recalculate Total Price
            $newTotal = $services->sum('base_price');
            $booking->total_price = $newTotal;

            // B. Prepare Pivot Data (snapshotting the price)
            $syncData = [];
            foreach ($services as $service) {
                $syncData[$service->id] = ['price_at_booking' => $service->base_price];
            }

            // C. Sync database relationships
            $booking->services()->sync($syncData);
        }

        // 6. Save changes
        $booking->save();

        return response()->json([
            'message' => 'Booking updated successfully',
            'booking' => $booking->load(['user', 'address', 'services'])
        ]);
    }

    /**
     * Delete Booking
     */
    public function destroy(Request $request, Booking $booking)
    {
        if ($request->user()->role !== 'admin' && $request->user()->id !== $booking->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $booking->delete();

        return response()->json(['message' => 'Booking cancelled successfully'], 200);
    }

    // --- SWEEPSTAR FUNCTIONS ---

    /**
     * Get jobs available for Sweepstars (No cleaner assigned yet)
     */
    public function availableJobs(Request $request)
    {
        if ($request->user()->role !== 'sweepstar') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $jobs = Booking::whereNull('sweepstar_id')
            ->where('status', 'pending')
            ->with(['user', 'address', 'services'])
            ->orderBy('scheduled_at', 'asc')
            ->get();

        return response()->json(['jobs' => $jobs]);
    }

    /**
     * Get jobs assigned to the current Sweepstar
     */
    public function mySchedule(Request $request)
    {
        $jobs = Booking::where('sweepstar_id', $request->user()->id)
            ->with(['user', 'address', 'services'])
            ->orderBy('scheduled_at', 'asc')
            ->get();

        return response()->json(['jobs' => $jobs]);
    }

    /**
     * Sweepstar accepts a job
     */
    public function acceptJob(Request $request, $id)
    {
        // Use transaction and lockForUpdate to prevent two people accepting at same time
        return DB::transaction(function () use ($request, $id) {
            $booking = Booking::lockForUpdate()->findOrFail($id);

            if ($booking->sweepstar_id) {
                return response()->json(['message' => 'This job has already been taken.'], 409);
            }

            $booking->update([
                'sweepstar_id' => $request->user()->id,
                'status' => 'confirmed'
            ]);
            $booking->user->notify(new BookingStatusUpdated("Your booking has been accepted by " . $request->user()->name, $booking->id));

            return response()->json(['message' => 'Job accepted! It is now in your schedule.']);
        });
    }
    // Add this method inside the BookingController class
public function completeJob(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        // Security: Only the assigned Sweepstar can complete it
        if ($booking->sweepstar_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($booking->status !== 'confirmed') {
            return response()->json(['message' => 'Job is not in progress.'], 400);
        }

        // 1. Update the status
        $booking->update(['status' => 'completed']);

        // ====================================================
        // NEW: NOTIFY THE CLIENT
        // ====================================================

        // Notify the user who made the booking
        $booking->user->notify(new BookingStatusUpdated(
            "Your cleaning is complete! Please review your Sweepstar.",
            $booking->id
        ));

        // ====================================================

        return response()->json(['message' => 'Job marked as completed!']);
    }

public function cancel(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        if ($request->user()->id !== $booking->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (in_array($booking->status, ['completed', 'cancelled'])) {
            return response()->json(['message' => 'Booking is already finalized.'], 400);
        }

        $validated = $request->validate([
            'reason' => 'required|string|min:5|max:500',
        ]);

        // UPDATE: Save to the dedicated column
        $booking->update([
            'status' => 'cancelled',
            'cancellation_reason' => $validated['reason']
        ]);

        return response()->json(['message' => 'Booking cancelled successfully.']);
    }
}

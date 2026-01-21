<?php

namespace App\Http\Controllers; // Adjust if your file is directly in Controllers

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
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


// ... imports

public function store(Request $request)
{
    // 1. Basic Validation
    $validated = $request->validate([
        'service_ids'   => 'required|array|min:1',
        'service_ids.*' => 'exists:services,id',
        'address_id'    => 'required|exists:addresses,id',
        'scheduled_at'  => 'required|date|after:now',
        'notes'         => 'nullable|string',
        // We now expect the USER to send the final adjusted price
        'final_price'   => 'required|numeric|min:0'
    ]);

    DB::beginTransaction();
    try {
        // 2. Calculate Server-Side Base Price (Security Check)
        $services = Service::whereIn('id', $validated['service_ids'])->get();
        $basePrice = $services->sum('base_price');
        $serviceCount = $services->count();

        // 3. Define Limits based on your rules
        // Rule: If > 1 service, min is -10%. If 1 service, min is base price (0% discount).
        $minMultiplier = ($serviceCount > 1) ? 0.90 : 1.00;

        // Rule: Max increase is always +50% (Tip)
        $maxMultiplier = 1.50;

        $minAllowedPrice = $basePrice * $minMultiplier;
        $maxAllowedPrice = $basePrice * $maxMultiplier;

        // 4. Validate the price sent by frontend is within allowed range
        // We use a small epsilon (0.01) for floating point comparison safety
        if ($validated['final_price'] < ($minAllowedPrice - 0.1) || $validated['final_price'] > ($maxAllowedPrice + 0.1)) {
             return response()->json([
                'message' => 'Invalid price adjustment.',
                'errors' => [
                    'final_price' => ["Price must be between " . number_format($minAllowedPrice, 2) . " and " . number_format($maxAllowedPrice, 2)]
                ]
            ], 422);
        }

        // 5. Create Booking
        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'address_id' => $validated['address_id'],
            'scheduled_at' => $validated['scheduled_at'],
            'status' => 'pending',
            'notes' => $validated['notes'] ?? null,
            'total_price' => $validated['final_price'], // Save the user's adjusted price
            'original_price' => $basePrice, // (Optional) Good to add this column to DB for analytics
            'duration_hours' => 2, // Logic for duration remains yours
        ]);

        // 6. Attach Services & Snapshot Prices
        foreach ($services as $service) {
            $booking->services()->attach($service->id, [
                'price_at_booking' => $service->base_price
            ]);
        }

           $sweepstars = User::where('role', 'sweepstar')->get();
            Notification::send($sweepstars, new BookingStatusUpdated(
                "New job available in " . $booking->address->city,
                $booking, 'new_booking'
            ));

        DB::commit();
        return response()->json(['message' => 'Booking created successfully', 'booking' => $booking], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['message' => 'Booking failed', 'error' => $e->getMessage()], 500);
    }
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
     * Get missions available for Sweepstars (No cleaner assigned yet)
     */
    public function availableMissions(Request $request)
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
     * Get missions assigned to the current Sweepstar
     */
    public function missionsHistory(Request $request)
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
    public function acceptMission(Request $request, $id)
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
            $booking->user->notify(new BookingStatusUpdated("Your booking has been accepted by " . $request->user()->name, $booking, 'booking_accepted'));

            return response()->json(['message' => 'Job accepted! It is now in your schedule.']);
        });
    }
    // Add this method inside the BookingController class
public function completeMission(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        // Security: Only the assigned Sweepstar can complete it
        if ($booking->sweepstar_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($booking->status !== 'confirmed') {
            return response()->json(['message' => 'Mission is not in progress.'], 400);
        }

        // 1. Update the status
        $booking->update(['status' => 'completed']);

        // ====================================================
        // NEW: NOTIFY THE CLIENT
        // ====================================================

        // Notify the user who made the booking
        $booking->user->notify(new BookingStatusUpdated(
            "Your cleaning is complete! Please review your Sweepstar.",
            $booking, 'booking_completed'
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

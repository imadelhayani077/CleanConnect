<?php

namespace App\Http\Controllers; // Adjust if your file is directly in Controllers

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // Required for transactions

class BookingController extends Controller
{
    /**
     * Fetch all bookings (Admin View & Client History)
     */
    public function index(Request $request)
    {
        // 1. Client View: Only show THEIR bookings
        if ($request->user()->role === 'user') {
             return response()->json([
                'bookings' => Booking::where('user_id', $request->user()->id)
                                     ->with(['user', 'address', 'services'])
                                     ->orderBy('created_at', 'desc')
                                     ->get()
             ]);
        }

        // 2. Admin View: Show EVERYTHING
        $bookings = Booking::with(['user', 'address', 'services'])
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
            // We save the price at the moment of booking
            $pivotData = [];
            foreach ($services as $service) {
                $pivotData[$service->id] = ['price_at_booking' => $service->base_price];
            }
            $booking->services()->attach($pivotData);

            // 5. Load relationships for the frontend
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
        if ($request->user()->role !== 'admin' && $request->user()->id !== $booking->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (in_array($booking->status, ['completed', 'cancelled'])) {
            return response()->json(['message' => 'Cannot edit a finalized booking.'], 400);
        }

        $validated = $request->validate([
            'scheduled_at' => 'sometimes|date|after:now',
            'address_id'   => 'sometimes|exists:addresses,id',
            'notes'        => 'nullable|string',
            'status'       => 'sometimes|string'
        ]);

        $booking->update($validated);

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

            return response()->json(['message' => 'Job accepted! It is now in your schedule.']);
        });
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    /**
     * Fetch all bookings (Admin View)
     */
    public function index(Request $request)
    {
        // 1. Optional: Ensure only Admins or Sweepstars can see ALL bookings
        if ($request->user()->role === 'user') {
             // If a normal user tries to access this, only show THEIR bookings
             return response()->json([
                'bookings' => Booking::where('user_id', $request->user()->id)
                                     ->with('user')
                                     ->orderBy('created_at', 'desc')
                                     ->get()
             ]);
        }

        // 2. Admin/Sweepstar sees everything
        $bookings = Booking::with(['user', 'address']) // Eager load relationships
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'bookings' => $bookings
        ]);
    }

    /**
     * Store a newly created booking (Client creates a job)
     */
    public function store(Request $request)
    {
        // 1. Validate the incoming data
        $validated = $request->validate([
            'service_type' => 'required|string',
            'scheduled_at' => 'required|date|after:now', // Must be in the future
            'address_id'   => 'required|exists:addresses,id',
            'total_price'  => 'required|numeric|min:0',
            'notes'        => 'nullable|string',
        ]);

        // 2. Prepare data
        // If the user is an admin, they might be booking for someone else (optional logic)
        // Otherwise, force the current logged-in user's ID
        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'pending'; // Default status for new bookings

        // 3. Create the booking
        $booking = Booking::create($validated);

        return response()->json([
            'message' => 'Booking created successfully!',
            'booking' => $booking
        ], 201);
    }

    /**
     * Display a single booking details
     */
    public function show(Request $request, Booking $booking)
    {
        // Security: Ensure the user owns this booking OR is an admin
        if ($request->user()->role !== 'admin' && $request->user()->id !== $booking->user_id) {
            return response()->json(['message' => 'Unauthorized access to this booking'], 403);
        }

        // Load relationships (like the user who booked it, the address, etc.)
        $booking->load(['user', 'address']);

        return response()->json($booking);
    }

    /**
     * Update the specified resource in storage.
     * Use this for:
     * 1. Admins changing status (pending -> confirmed)
     * 2. Clients rescheduling (changing date)
     */
/**
     * Update the specified booking.
     */
    public function update(Request $request, Booking $booking)
    {
        // 1. Security: Ensure the user owns this booking
        if ($request->user()->id !== $booking->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 2. Logic: Prevent editing if the job is already finished or cancelled
        if (in_array($booking->status, ['completed', 'cancelled', 'in_progress'])) {
            return response()->json([
                'message' => 'You cannot edit a booking that is already ' . $booking->status
            ], 400);
        }

        // 3. Validation
        $validated = $request->validate([
            'service_type' => 'sometimes|string',
            'scheduled_at' => 'sometimes|date|after:now', // Must be in future
            'address_id'   => 'sometimes|exists:addresses,id',
            'notes'        => 'nullable|string',
            'total_price'  => 'sometimes|numeric'
        ]);

        // 4. Update
        $booking->update($validated);

        return response()->json([
            'message' => 'Booking updated successfully',
            'booking' => $booking
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Booking $booking)
    {
        // Security: Ensure owner or admin
        if ($request->user()->role !== 'admin' && $request->user()->id !== $booking->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Option A: Hard Delete (Removes from DB completely)
        $booking->delete();

        // Option B: Soft Delete (Better for history)
        // You would need to add `use SoftDeletes` to your Booking Model for this to work properly
        // $booking->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Booking deleted successfully'
        ], 200);
    }
}

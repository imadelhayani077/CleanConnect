<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
   public function store(Request $request)
{
    $validated = $request->validate([
        'booking_id' => 'required|exists:bookings,id',
        'rating'     => 'required|integer|min:1|max:5',
        'comment'    => 'nullable|string|max:500',
    ]);

    $booking = Booking::findOrFail($validated['booking_id']);

    // Security: Only the client who booked can review
    if ($request->user()->id !== $booking->user_id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    // Ensure job is actually completed
    if ($booking->status !== 'completed') {
        return response()->json(['message' => 'You can only review completed jobs.'], 400);
    }

    // Check if review already exists
    $existingReview = Review::where('booking_id', $booking->id)
                        ->where('reviewer_id', $request->user()->id)
                        ->first();

    if ($existingReview) {
        return response()->json(['message' => 'You have already reviewed this job.'], 409);
    }

    // Create Review
    $review = Review::create([
        'booking_id'  => $booking->id,
        'reviewer_id' => $request->user()->id,
        'target_id'   => $booking->sweepstar_id, // We review the worker
        'rating'      => $validated['rating'],
        'comment'     => $validated['comment'] ?? null,
    ]);

    return response()->json(['message' => 'Review submitted successfully!', 'review' => $review], 201);
}

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        // Security: Ensure the logged-in user owns this review
        if ($request->user()->id !== $review->reviewer_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        $review->update($validated);

        return response()->json(['message' => 'Review updated successfully', 'review' => $review]);
    }

    /**
     * Remove the specified review.
     */
    public function destroy(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        // Security check
        if ($request->user()->id !== $review->reviewer_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->delete(); // Soft delete or force delete

        return response()->json(['message' => 'Review deleted successfully']);
    }
}

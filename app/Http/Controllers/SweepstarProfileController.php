<?php

namespace App\Http\Controllers;

use App\Models\SweepstarProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SweepstarProfileController extends Controller
{
    /**
     * USER: Apply to become a Sweepstar
     */
    public function apply(Request $request)
    {
        // 1. Check if they already applied
        if (SweepstarProfile::where('user_id', $request->user()->id)->exists()) {
            return response()->json(['message' => 'You have already submitted an application.'], 409);
        }

        // 2. Validate Input
        $validated = $request->validate([
            'bio' => 'required|string|min:10',
            'id_number' => 'required|string',
            'hourly_rate' => 'required|numeric|min:10', // Minimum wage check example
        ]);

        // 3. Create the Profile (Unverified by default)
        $profile = SweepstarProfile::create([
            'user_id' => $request->user()->id,
            'bio' => $validated['bio'],
            'id_number' => $validated['id_number'],
            'hourly_rate' => $validated['hourly_rate'],
            'is_verified' => false, // Important: Admin must approve
            'total_jobs_completed' => 0
        ]);

        return response()->json([
            'message' => 'Application submitted successfully! Waiting for Admin approval.',
            'profile' => $profile
        ], 201);
    }

    /**
     * ADMIN: View all pending applications
     */
    public function pendingApplications()
    {
        // Get profiles where is_verified is FALSE, include User details
        $applications = SweepstarProfile::where('is_verified', false)
            ->with('user') // So admin can see name/email
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($applications);
    }

    /**
     * ADMIN: Approve an application
     */
    public function approve($id)
    {
        return DB::transaction(function () use ($id) {
            // 1. Find the profile
            $profile = SweepstarProfile::findOrFail($id);

            // 2. Mark profile as verified
            $profile->update(['is_verified' => true]);

            // 3. Upgrade the User Role to 'sweepstar'
            $user = User::findOrFail($profile->user_id);
            $user->update(['role' => 'sweepstar']);

            return response()->json([
                'message' => 'Application approved. User is now a Sweepstar!',
                'user' => $user
            ]);
        });
    }

    /**
     * ADMIN: Reject/Delete an application
     */
    public function reject($id)
    {
        $profile = SweepstarProfile::findOrFail($id);
        $profile->delete(); // Soft delete or force delete based on preference

        return response()->json(['message' => 'Application rejected.']);
    }

    /**
     * Show single profile details (Public or Private)
     */
    public function show($id)
    {
        return SweepstarProfile::with('user')->findOrFail($id);
    }
    // ... existing code ...

    /**
     * TOGGLE AVAILABILITY
     * Allows the Sweepstar to go Online/Offline
     */
    public function toggleAvailability(Request $request)
    {
        $user = $request->user();

        // Ensure user has a profile
        if (!$user->sweepstarProfile) {
            return response()->json(['message' => 'Profile not found.'], 404);
        }

        // Toggle the status
        $profile = $user->sweepstarProfile;
        $profile->is_available = !$profile->is_available;
        $profile->save();

        return response()->json([
            'message' => $profile->is_available ? 'You are now Online.' : 'You are now Offline.',
            'is_available' => $profile->is_available
        ]);
    }
}

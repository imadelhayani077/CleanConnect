<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     * Accessible only by Admin.
     */
    public function index()
    {
        // 1. Fetch all users from database
        // You might want to hide sensitive fields explicitly,
        // though 'hidden' property in User model usually handles password/token.
        $users = User::all();

        // 2. Return as JSON
        return response()->json($users);
    }

    /**
     * Display the specified resource.
     */
    /**
     * Display the specified resource.
     * NOW WITH DETAILS: Bookings, Reviews, Profile
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);

        // 1. Load data if user is a SWEEPSTAR
        if ($user->role === 'sweepstar') {
            $user->load([
                'sweepstarProfile',                 // Bio, Hourly Rate, ID Number
                'sweepstarBookings.user',           // Jobs they did + Client info
                'sweepstarBookings.address',        // Where they worked
                'reviewsReceived.reviewer'          // Reviews people wrote about them
            ]);
        }

        // 2. Load data if user is a CLIENT
        elseif ($user->role === 'client') {
            $user->load([
                'clientBookings.sweepstar',         // Bookings they made + Worker info
                'clientBookings.services',          // Services requested
                'reviewsWritten.target'             // Reviews they wrote
            ]);
        }

        return response()->json($user);
    }

public function update(Request $request, string $id)
    {
        $targetUser = User::findOrFail($id); // The profile being edited
        $currentUser = $request->user();     // The Admin or User doing the editing

        // 1. AUTHORIZATION
        if ($currentUser->id !== $targetUser->id && $currentUser->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        // 2. SECURITY VERIFICATION (New Logic)
        // REQUIRE the password of the person Logged In (The $currentUser)
        $request->validate([
            'current_password' => 'required|string',
        ]);

        if (!Hash::check($request->current_password, $currentUser->password)) {
            return response()->json([
                'message' => 'Security Check Failed.',
                'errors' => ['current_password' => ['Incorrect password. Action denied.']]
            ], 422);
        }

        // 3. VALIDATION
        $request->validate([
            'name'  => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => ['required', 'email', Rule::unique('users')->ignore($targetUser->id)],
            'password' => 'nullable|string|min:8',
            'role'     => 'nullable|in:client,sweepstar,admin',
        ]);

        // 4. PREPARE DATA
        $data = [
            'name'  => $request->name,
            'phone' => $request->phone,
        ];

        // Only Admin can change email
        if ($currentUser->role === 'admin') {
            $data['email'] = $request->email;
            if ($request->filled('role')) {
                $data['role'] = $request->role;
    }
        }

        // Handle Password Reset (Changing the target user's password)
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $targetUser->update($data);

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $targetUser
        ]);
    }
    // User toggles between 'active' and 'disabled'
public function toggleStatus(Request $request)
{
    $user = $request->user();

    // Prevent suspended users from re-activating themselves
    if ($user->status === 'suspended') {
        return response()->json(['message' => 'Account is suspended.'], 403);
    }

    // Toggle logic
    $user->status = ($user->status === 'active') ? 'disabled' : 'active';
    $user->save();

    return response()->json(['status' => $user->status]);
}

// User deletes their own account
public function destroySelf(Request $request)
{
    $user = $request->user();
    // Optional: Delete related profiles/bookings logic here
    $user->delete();
    return response()->json(['message' => 'Account deleted successfully.']);
}

// Admin changes status (Active/Suspended/Disabled)
public function adminUpdateStatus(Request $request, $id)
{
    $request->validate(['status' => 'required|in:active,suspended,disabled']);

    $user = User::findOrFail($id);
    $user->status = $request->status;
    $user->save();

    return response()->json(['message' => "User status updated to {$user->status}"]);
}

// Admin deletes a user
public function adminDestroyUser($id)
{
    User::findOrFail($id)->delete();
    return response()->json(['message' => 'User deleted by admin.']);
}
}

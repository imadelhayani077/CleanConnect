<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

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
    public function show(string $id)
    {
        // Find user or fail with 404
        $user = User::findOrFail($id);

        return response()->json($user);
    }

    // You can add update() or destroy() methods here later
}

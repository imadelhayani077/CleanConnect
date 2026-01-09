<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // Get all notifications for the logged-in user
    public function index(Request $request)
    {
        return response()->json([
            'notifications' => $request->user()->notifications // Fetches read AND unread
        ]);
    }

    // Mark a specific one as read (removes the "red dot")
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->where('id', $id)->first();
        if ($notification) {
            $notification->markAsRead();
        }
        return response()->json(['message' => 'Marked as read']);
    }
}

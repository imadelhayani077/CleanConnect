<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // Get all notifications
    public function index(Request $request)
    {
        return response()->json([
            'notifications' => $request->user()->notifications
        ]);
    }

    // Mark specific one
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->where('id', $id)->first();
        if ($notification) {
            $notification->markAsRead();
        }
        return response()->json(['message' => 'Marked as read']);
    }

    // --- ADD THIS NEW FUNCTION ---
    public function markAllAsRead(Request $request)
    {
        // Laravel magic method to mark all unread as read
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'All marked as read']);
    }
}

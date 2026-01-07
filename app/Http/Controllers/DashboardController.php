<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * ADMIN DASHBOARD
     */
    public function adminStats()
    {
        $revenue = Booking::where('status', 'completed')->sum('total_price');
        $activeBookings = Booking::whereIn('status', ['pending', 'confirmed'])->count();

        // Get recent activity (last 5 bookings)
        $recentBookings = Booking::with(['user', 'sweepstar'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'total_clients'    => User::where('role', 'client')->count(),
            'total_sweepstars' => User::where('role', 'sweepstar')->count(),
            'active_bookings'  => $activeBookings,
            'revenue'          => $revenue,
            'recent_activity'  => $recentBookings
        ]);
    }

    /**
     * SWEEPSTAR DASHBOARD
     */
    public function sweepstarJobs(Request $request)
    {
        $user = $request->user();

        $upcoming = Booking::where('sweepstar_id', $user->id)
            ->where('status', 'confirmed')
            ->where('scheduled_at', '>=', now())
            ->with(['user', 'address', 'services'])
            ->orderBy('scheduled_at', 'asc')
            ->get();

        $completedCount = Booking::where('sweepstar_id', $user->id)
            ->where('status', 'completed')
            ->count();

        $earnings = Booking::where('sweepstar_id', $user->id)
            ->where('status', 'completed')
            ->sum('total_price');

        return response()->json([
            'upcoming_jobs' => $upcoming,
            'stats' => [
                'completed' => $completedCount,
                'earnings'  => $earnings
            ]
        ]);
    }

    /**
     * [NEW] CLIENT DASHBOARD
     * Useful for showing "Total Spent" or "Membership Level" later
     */
    public function clientStats(Request $request)
    {
        $user = $request->user();

        $totalSpent = Booking::where('user_id', $user->id)
            ->where('status', 'completed')
            ->sum('total_price');

        $totalBookings = Booking::where('user_id', $user->id)->count();

        // Count active bookings to show a badge on the dashboard
        $activeBookings = Booking::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->count();

        return response()->json([
            'total_spent'     => $totalSpent,
            'total_bookings'  => $totalBookings,
            'active_bookings' => $activeBookings,
            'address_count'   => $user->addresses()->count()
        ]);
    }
}

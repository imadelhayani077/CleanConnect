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
        // Total money collected
        $revenue = Booking::where('status', 'completed')->sum('total_price');

        // FINANCIAL ANALYTICS (Using the new original_price vs total_price logic)
        // 1. Total Tips: Sum of (total - original) where total > original
        $totalTips = Booking::where('status', 'completed')
            ->whereColumn('total_price', '>', 'original_price')
            ->select(DB::raw('SUM(total_price - original_price) as total'))
            ->first()->total ?? 0;

        // 2. Total Discounts: Sum of (original - total) where total < original
        $totalDiscounts = Booking::where('status', 'completed')
            ->whereColumn('total_price', '<', 'original_price')
            ->select(DB::raw('SUM(original_price - total_price) as total'))
            ->first()->total ?? 0;

        $activeBookings = Booking::whereIn('status', ['pending', 'confirmed'])->count();

        // Get recent activity (last 5 bookings)
        // Updated relationship to 'bookingServices.service'
        $recentBookings = Booking::with(['user', 'sweepstar', 'bookingServices.service'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'total_clients'    => User::where('role', 'client')->count(),
            'total_sweepstars' => User::where('role', 'sweepstar')->count(),
            'active_bookings'  => $activeBookings,
            'revenue'          => (float) $revenue,
            'total_tips'       => (float) $totalTips,
            'total_discounts'  => (float) $totalDiscounts,
            'recent_activity'  => $recentBookings
        ]);
    }

    /**
     * SWEEPSTAR DASHBOARD
     */
    public function sweepstarJobs(Request $request)
    {
        $user = $request->user();
        $user->load('sweepstarProfile');

        // UPDATED: Use 'bookingServices.service' instead of 'services'
        $upcoming = Booking::where('sweepstar_id', $user->id)
            ->where('status', 'confirmed')
            ->where('scheduled_at', '>=', now())
            ->with(['user', 'address', 'bookingServices.service'])
            ->orderBy('scheduled_at', 'asc')
            ->get();

        $completedCount = Booking::where('sweepstar_id', $user->id)
            ->where('status', 'completed')
            ->count();

        // Earnings is the actual total_price (which includes tips)
        $earnings = Booking::where('sweepstar_id', $user->id)
            ->where('status', 'completed')
            ->sum('total_price');

        return response()->json([
            'is_available' => $user->sweepstarProfile ? $user->sweepstarProfile->is_available : false,
            'upcoming_jobs' => $upcoming,
            'stats' => [
                'completed' => $completedCount,
                'earnings'  => (float) $earnings
            ]
        ]);
    }

    /**
     * CLIENT DASHBOARD
     */
    public function clientStats(Request $request)
    {
        $user = $request->user();

        $totalSpent = Booking::where('user_id', $user->id)
            ->where('status', 'completed')
            ->sum('total_price');

        $totalBookings = Booking::where('user_id', $user->id)->count();

        $activeBookings = Booking::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->count();

        return response()->json([
            'total_spent'     => (float) $totalSpent,
            'total_bookings'  => $totalBookings,
            'active_bookings' => $activeBookings,
            'address_count'   => $user->addresses()->count()
        ]);
    }
}

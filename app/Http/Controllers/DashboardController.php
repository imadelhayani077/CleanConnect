<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
// use App\Models\Booking; // We will uncomment this when we start Step 5

class DashboardController extends Controller
{
    // ADMIN DASHBOARD: Needs data from Users + Bookings
    public function adminStats()
    {
        return response()->json([
            'total_clients' => User::where('role', 'client')->count(),
            'total_sweepstars' => User::where('role', 'sweepstar')->count(),
            // We will add these later:
            'active_bookings' => 0,
            'revenue' => 0,
        ]);
    }

    // SWEEPSTAR DASHBOARD: Needs data specifically for the logged-in worker
    public function sweepstarJobs(Request $request)
    {
        // Placeholder until we build the Booking model
        return response()->json([
            'upcoming_jobs' => [],
            'stats' => [
                'completed' => 0,
                'earnings' => 0
            ]
        ]);
    }
}

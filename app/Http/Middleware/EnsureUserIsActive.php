<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->status === 'suspended') {
            // Force logout if using sessions
            // Auth::guard('web')->logout();
            return response()->json(['message' => 'Your account is suspended.'], 403);
        }

        if ($user && $user->status === 'disabled') {
            // Allow only specific routes for disabled users (Toggle & Logout & Self Delete)
            $allowedRoutes = [
                'api/user/toggle-status',
                'api/logout',
                'api/user/me', // For delete
                'api/user',    // To fetch profile data
            ];

            if (!in_array($request->path(), $allowedRoutes)) {
                return response()->json(['message' => 'Account is disabled. Please reactivate to proceed.'], 403);
            }
        }

        return $next($request);
    }
}

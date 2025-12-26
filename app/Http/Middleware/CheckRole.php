<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $role  The role we want to require (e.g., 'admin')
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // 1. Check if user is logged in (just in case)
        if (! $request->user()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // 2. Check if the user's role matches the required role
        // We use strict comparison (===) to be safe.
        if ($request->user()->role !== $role) {
            return response()->json(['message' => 'Forbidden: Access denied.'], 403);
        }

        // 3. If they match, let them pass to the Controller
        return $next($request);
    }
}

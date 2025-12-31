<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Get list of all services (Public or Auth)
     */
    public function index()
    {
        return response()->json([
            'services' => Service::all()
        ]);
    }

    /**
     * Create a new Service (Admin Only)
     */
    public function store(Request $request)
    {
        // Simple role check (or use Middleware in routes)
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
        ]);

        $service = Service::create($validated);

        return response()->json(['message' => 'Service created', 'service' => $service], 201);
    }

    // You can implement show/update/destroy if needed later
}

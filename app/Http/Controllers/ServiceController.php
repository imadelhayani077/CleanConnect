<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\User;
use App\Notifications\ServiceUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

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

          $users = User::get();
            Notification::send($users, new ServiceUpdated(
                "New service created: " . $service->name,
                $service
            ));

        return response()->json(['message' => 'Service created', 'service' => $service], 201);
    }
    public function update(Request $request, $id)
{
    // Find the service
    $service = Service::find($id);

    if (!$service) {
        return response()->json(['message' => 'Service not found'], 404);
    }

    // Validate
    $validated = $request->validate([
        'name' => 'sometimes|string|max:255',
        'base_price' => 'sometimes|numeric',
    ]);

    // Update
    $service->update($validated);

    return response()->json([
        'message' => 'Service updated successfully',
        'service' => $service
    ], 200);
}
    public function destroy(Request $request, Service $service)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $service->delete();

        return response()->json(['message' => 'Service deleted successfully'], 200);
    }

}

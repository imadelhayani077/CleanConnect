<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\User;
use App\Notifications\ServiceUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;


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
    // 1. Validation (Note: 'image' rule limits types to png, jpg, etc.)
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string|max:1000',
        'base_price' => 'required|numeric|min:0',
        'service_icon' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048', // Max 2MB
    ]);

    // 2. Handle File Upload
    if ($request->hasFile('service_icon')) {
        // Stores in storage/app/public/services
        $path = $request->file('service_icon')->store('services', 'public');
        $validated['service_icon'] = '/storage/' . $path; // Add publicly accessible path
    }

    $service = Service::create($validated);

    return response()->json(['message' => 'Service created', 'service' => $service], 201);
}

public function update(Request $request, $id)
{
    $service = Service::findOrFail($id);

    $validated = $request->validate([
        'name' => 'sometimes|string|max:255',
        'description' => 'nullable|string|max:1000',
        'base_price' => 'sometimes|numeric|min:0',
        'service_icon' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
    ]);

    // 2. Handle File Replacement
    if ($request->hasFile('service_icon')) {
        // Delete old image if it exists
        if ($service->service_icon) {
            // Convert "/storage/services/..." back to "services/..." for deletion
            $oldPath = str_replace('/storage/', '', $service->service_icon);
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('service_icon')->store('services', 'public');
        $validated['service_icon'] = '/storage/' . $path;
    }

    $service->update($validated);

    return response()->json(['message' => 'Service updated', 'service' => $service]);
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

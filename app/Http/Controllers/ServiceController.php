<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;


class ServiceController extends Controller
{
    /**
     * Get list of all services (Public or Auth)
     */
   public function index()
{
    return response()->json([
        // This tells Laravel to include the related options and extras in the JSON
        'services' => Service::with(['options', 'extras'])->get()
    ]);
}

public function update(Request $request, $id)
{
    $service = Service::with(['options', 'extras'])->findOrFail($id);

    // 1. Validation: Only allow icon and the nested arrays for options/extras
    $validated = $request->validate([
        'service_icon' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',

        // Options Validation
        'options' => 'nullable|array',
        'options.*.id' => 'nullable|exists:service_options,id',
        'options.*.name' => 'required|string',
        'options.*.option_price' => 'required|numeric|min:0',
        'options.*.duration_minutes' => 'required|integer',

        // Extras (Tasks) Validation
        'extras' => 'nullable|array',
        'extras.*.id' => 'nullable|exists:service_extras,id',
        'extras.*.name' => 'required|string',
        'extras.*.extra_price' => 'required|numeric|min:0',
        'extras.*.duration_minutes' => 'required|integer',
    ]);

    return DB::transaction(function () use ($request, $validated, $service) {

        // 2. Handle Icon Replacement
        if ($request->hasFile('service_icon')) {
            if ($service->service_icon) {
                $oldPath = str_replace('/storage/', '', $service->service_icon);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('service_icon')->store('services', 'public');
            $service->update(['service_icon' => '/storage/' . $path]);
        }

        // 3. Update Options (Prices & Names)
        if ($request->has('options')) {
            foreach ($validated['options'] as $optData) {
                $service->options()->updateOrCreate(
                    ['id' => $optData['id'] ?? null],
                    [
                        'name' => $optData['name'],
                        'option_price' => $optData['option_price'],
                        'duration_minutes' => $optData['duration_minutes']
                    ]
                );
            }
        }

        // 4. Update Extras/Tasks (Prices & Names)
        if ($request->has('extras')) {
            foreach ($validated['extras'] as $extraData) {
                $service->extras()->updateOrCreate(
                    ['id' => $extraData['id'] ?? null],
                    [
                        'name' => $extraData['name'],
                        'extra_price' => $extraData['extra_price'],
                        'duration_minutes' => $extraData['duration_minutes']
                    ]
                );
            }
        }

        return response()->json([
            'message' => 'Service pricing and icon updated successfully',
            'service' => $service->load(['options', 'extras'])
        ]);
    });
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

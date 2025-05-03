<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Booking;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminCarController extends Controller
{
    /**
     * Display a listing of the cars.
     */
    public function index()
    {
        $cars = Car::latest()->get();
        
        return response()->json([
            'success' => true,
            'data' => $cars
        ]);
    }

    /**
     * Store a newly created car in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|string|max:4',
            'daily_rate' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'category' => ['required', Rule::in(['economy', 'compact', 'midsize', 'suv', 'luxury', 'sports'])],
            'color' => 'nullable|string|max:50',
            'transmission' => 'required|string|max:50',
            'seats' => 'required|integer|min:1|max:12',
            'doors' => 'required|integer|min:2|max:6',
            'air_conditioning' => 'boolean',
            'gps' => 'boolean',
            'bluetooth' => 'boolean',
            'usb' => 'boolean',
            'fuel_type' => 'required|string|max:50',
            'license_plate' => 'nullable|string|max:20',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_available' => 'boolean',
            'location' => 'nullable|string|max:50',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = 'car_' . Str::random(10) . '_' . time() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('public/cars', $imageName);
            $validated['image'] = 'cars/' . $imageName;
        }

        $car = Car::create($validated);
        
        // Log the activity
        ActivityLog::log(
            'car',
            "New car added: {$car->brand} {$car->model}",
            [
                'car_id' => $car->id,
                'brand' => $car->brand,
                'model' => $car->model,
            ],
            false
        );

        return response()->json([
            'success' => true,
            'message' => 'Car created successfully',
            'data' => $car
        ], 201);
    }

    /**
     * Display the specified car.
     */
    public function show(string $id)
    {
        $car = Car::findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $car
        ]);
    }

    /**
     * Update the specified car in storage.
     */
    public function update(Request $request, string $id)
    {
        $car = Car::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'brand' => 'sometimes|required|string|max:255',
            'model' => 'sometimes|required|string|max:255',
            'year' => 'sometimes|required|string|max:4',
            'daily_rate' => 'sometimes|required|numeric|min:0',
            'description' => 'nullable|string',
            'category' => ['sometimes', 'required', Rule::in(['economy', 'compact', 'midsize', 'suv', 'luxury', 'sports'])],
            'color' => 'nullable|string|max:50',
            'transmission' => 'sometimes|required|string|max:50',
            'seats' => 'sometimes|required|integer|min:1|max:12',
            'doors' => 'sometimes|required|integer|min:2|max:6',
            'air_conditioning' => 'boolean',
            'gps' => 'boolean',
            'bluetooth' => 'boolean',
            'usb' => 'boolean',
            'fuel_type' => 'sometimes|required|string|max:50',
            'license_plate' => 'nullable|string|max:20',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_available' => 'boolean',
            'location' => 'nullable|string|max:50',
        ]);
        
        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($car->image && Storage::exists('public/' . $car->image)) {
                Storage::delete('public/' . $car->image);
            }
            
            $image = $request->file('image');
            $imageName = 'car_' . Str::random(10) . '_' . time() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('public/cars', $imageName);
            $validated['image'] = 'cars/' . $imageName;
        }
        
        $car->update($validated);
        
        // Log the activity
        ActivityLog::log(
            'car',
            "Car updated: {$car->brand} {$car->model}",
            [
                'car_id' => $car->id,
                'brand' => $car->brand,
                'model' => $car->model,
                'fields_updated' => array_keys($validated),
            ],
            false
        );
        
        return response()->json([
            'success' => true,
            'message' => 'Car updated successfully',
            'data' => $car
        ]);
    }

    /**
     * Remove the specified car from storage.
     */
    public function destroy(string $id)
    {
        $car = Car::findOrFail($id);
        
        // Check if the car has active bookings
        $activeBookings = Booking::where('car_id', $id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();
            
        if ($activeBookings) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete car with active bookings'
            ], 422);
        }
        
        // Delete car image if exists
        if ($car->image && Storage::exists('public/' . $car->image)) {
            Storage::delete('public/' . $car->image);
        }
        
        $carInfo = [
            'id' => $car->id,
            'brand' => $car->brand,
            'model' => $car->model,
        ];
        
        $car->delete();
        
        // Log the activity
        ActivityLog::log(
            'car',
            "Car deleted: {$carInfo['brand']} {$carInfo['model']}",
            $carInfo,
            false
        );
        
        return response()->json([
            'success' => true,
            'message' => 'Car deleted successfully'
        ]);
    }

    /**
     * Get cars for a specific category.
     */
    public function getByCategory(string $category)
    {
        $cars = Car::where('category', $category)
            ->where('is_available', true)
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $cars
        ]);
    }

    /**
     * Get cars for a specific location.
     */
    public function getByLocation(string $location)
    {
        $cars = Car::where('location', $location)
            ->where('is_available', true)
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $cars
        ]);
    }

    /**
     * Get available cars.
     */
    public function getAvailableCars()
    {
        $cars = Car::where('is_available', true)->get();
            
        return response()->json([
            'success' => true,
            'data' => $cars
        ]);
    }

    /**
     * Toggle car availability.
     */
    public function toggleAvailability(string $id)
    {
        $car = Car::findOrFail($id);
        
        // Toggle the availability
        $car->is_available = !$car->is_available;
        $car->save();
        
        $status = $car->is_available ? 'available' : 'unavailable';
        
        // Log the activity
        ActivityLog::log(
            'car',
            "{$car->brand} {$car->model} marked as {$status}",
            [
                'car_id' => $car->id,
                'brand' => $car->brand,
                'model' => $car->model,
                'is_available' => $car->is_available,
            ],
            false
        );
        
        return response()->json([
            'success' => true,
            'message' => "Car marked as {$status}",
            'data' => $car
        ]);
    }
} 
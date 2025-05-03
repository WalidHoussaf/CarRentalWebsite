<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AdminBookingController;
use App\Http\Controllers\AdminCarController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AdminDashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// These routes will be registered with the prefix "api" automatically
// because they're in the api.php file, but we'll confirm this explicitly
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);

// Public routes for cars
Route::get('/cars/available', [AdminCarController::class, 'getAvailableCars']);
Route::get('/cars/category/{category}', [AdminCarController::class, 'getByCategory']);
Route::get('/cars/location/{location}', [AdminCarController::class, 'getByLocation']);
Route::get('/cars/{id}', [AdminCarController::class, 'show']);

// Protected routes for both users and admins
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout']);
    
    // User profile route
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // User profile update
    Route::put('/user/profile', [UserProfileController::class, 'update']);
    
    // User account deletion
    Route::delete('/user/delete', [UserProfileController::class, 'delete']);
    
    // Booking routes
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::put('/bookings/{id}/cancel', [BookingController::class, 'cancel']);
    
    // Temporary fix: Admin routes without is_admin middleware
    // Just protected by auth:sanctum
    Route::prefix('admin')->group(function () {
        // Dashboard routes
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);
        
        // Activity Feed
        Route::get('/activity-feed', [AdminDashboardController::class, 'activityFeed']);
        
        // Weather Integration
        Route::get('/weather', [AdminDashboardController::class, 'weather']);
        Route::get('/forecast', [AdminDashboardController::class, 'forecast']);
        
        // Map Visualization
        Route::get('/map-data', [AdminDashboardController::class, 'mapData']);
        
        // Analytics Routes
        Route::get('/predictions', [AdminDashboardController::class, 'predictions']);
        Route::get('/vehicle-health', [AdminDashboardController::class, 'vehicleHealth']);
        Route::get('/customer-satisfaction', [AdminDashboardController::class, 'customerSatisfaction']);
        Route::get('/revenue-breakdown', [AdminDashboardController::class, 'revenueBreakdown']);
        Route::get('/performance-scorecard', [AdminDashboardController::class, 'performanceScorecard']);
        
        // Notifications
        Route::get('/notifications', [AdminDashboardController::class, 'notifications']);
        
        // Activity Log Routes
        Route::get('/activities', [ActivityLogController::class, 'recent']);
        Route::post('/activities', [ActivityLogController::class, 'store']);
        
        // Admin User Management Routes - manual role check in controller
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::get('/users/{id}', [AdminUserController::class, 'show']);
        Route::post('/users', [AdminUserController::class, 'store']);
        Route::put('/users/{id}', [AdminUserController::class, 'update']);
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);
        
        // Admin Booking Management Routes
        Route::get('/bookings', [AdminBookingController::class, 'index']);
        Route::get('/bookings/{id}', [AdminBookingController::class, 'show']);
        Route::put('/bookings/{id}/status', [AdminBookingController::class, 'updateStatus']);
        Route::delete('/bookings/{id}', [AdminBookingController::class, 'destroy']);
        
        // Admin Car Management Routes
        Route::get('/cars', [AdminCarController::class, 'index']);
        Route::post('/cars', [AdminCarController::class, 'store']);
        Route::get('/cars/{id}', [AdminCarController::class, 'show']);
        Route::put('/cars/{id}', [AdminCarController::class, 'update']);
        Route::delete('/cars/{id}', [AdminCarController::class, 'destroy']);
        Route::patch('/cars/{id}/toggle-availability', [AdminCarController::class, 'toggleAvailability']);
    });
});

// Comment out the original admin routes that use the problematic middleware
/*
// Admin only routes
Route::middleware(['auth:sanctum', 'is_admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', function () {
        return response()->json([
            'message' => 'Welcome to the admin dashboard',
            'status' => 'success'
        ]);
    });
    
    // Admin User Management Routes
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/users/{id}', [AdminUserController::class, 'show']);
    Route::post('/users', [AdminUserController::class, 'store']);
    Route::put('/users/{id}', [AdminUserController::class, 'update']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);
}); 
*/ 
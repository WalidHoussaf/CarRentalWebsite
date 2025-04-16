<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AdminBookingController;
use App\Http\Controllers\BookingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// These routes will be registered with the prefix "api" automatically
// because they're in the api.php file, but we'll confirm this explicitly
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);

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
        Route::get('/dashboard', function () {
            if (auth()->user()->role !== 'admin') {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.'
                ], 403)->header('Content-Type', 'application/json');
            }
            
            return response()->json([
                'message' => 'Welcome to the admin dashboard',
                'status' => 'success'
            ])->header('Content-Type', 'application/json');
        });
        
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
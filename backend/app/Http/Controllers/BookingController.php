<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Car;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    /**
     * Display a listing of the user's bookings.
     */
    public function index()
    {
        try {
            $user = Auth::user();
            $bookings = $user->bookings()->orderBy('created_at', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'bookings' => $bookings
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching bookings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch bookings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created booking in storage.
     */
    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Prevent admin users from creating bookings
            if ($user->role === 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin users cannot create bookings. Please use a customer account.'
                ], 403);
            }
            
            $validator = Validator::make($request->all(), [
                'car' => 'required|array',
                'car.id' => 'required|integer',
                'car.name' => 'required|string',
                'car.price' => 'required|numeric',
                'startDate' => 'required|date',
                'endDate' => 'required|date|after_or_equal:startDate',
                'totalDays' => 'required|integer|min:1',
                'pickupLocation' => 'required|string',
                'dropoffLocation' => 'required|string',
                'options' => 'nullable|array',
                'totalPrice' => 'required|numeric'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();
            
            // Use database transaction to prevent race conditions 
            // that could create duplicate bookings
            return DB::transaction(function() use ($request, $user) {
                // Lock the rows for this user and car to prevent race conditions
                // Check if there's already a booking with the same car_id and date range
                $existingBooking = Booking::where('user_id', $user->id)
                    ->where('car_id', $request->car['id'])
                    ->where('start_date', $request->startDate)
                    ->where('end_date', $request->endDate)
                    ->where('status', '!=', 'cancelled')
                    ->lockForUpdate()  // Lock the rows for the duration of the transaction
                    ->first();
                    
                if ($existingBooking) {
                    return response()->json([
                        'success' => true,
                        'message' => 'Booking already exists',
                        'booking' => $existingBooking
                    ], 200);
                }
                
                // Create booking with validated data
                $booking = new Booking([
                    'user_id' => $user->id,
                    'car_id' => $request->car['id'],
                    'car_name' => $request->car['name'],
                    'car_price' => $request->car['price'],
                    'car_category' => $request->car['category'] ?? null,
                    'car_image' => $request->car['image'] ?? null,
                    'start_date' => $request->startDate,
                    'end_date' => $request->endDate,
                    'total_days' => $request->totalDays,
                    'pickup_location' => $request->pickupLocation,
                    'dropoff_location' => $request->dropoffLocation,
                    'options' => $request->options ?? [],
                    'options_price' => $request->optionsPrice ?? 0,
                    'total_price' => $request->totalPrice,
                    'status' => 'confirmed'
                ]);
                
                $booking->save();
                
                // Log the activity
                ActivityLog::log(
                    'booking',
                    "New booking for {$booking->car_name}",
                    [
                        'booking_id' => $booking->id,
                        'car_id' => $booking->car_id,
                        'car' => $booking->car_name,
                        'start_date' => $booking->start_date,
                        'end_date' => $booking->end_date,
                    ],
                    true,
                    "/admin/bookings/{$booking->id}"
                );
                
                return response()->json([
                    'success' => true,
                    'message' => 'Booking created successfully',
                    'booking' => $booking
                ], 201);
            });
        } catch (\Exception $e) {
            Log::error('Error creating booking: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create booking'
            ], 500);
        }
    }

    /**
     * Display the specified booking.
     */
    public function show(string $id)
    {
        try {
            $user = Auth::user();
            $booking = Booking::where('id', $id)
                ->where('user_id', $user->id)
                ->first();
                
            if (!$booking) {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking not found'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'booking' => $booking
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching booking: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch booking'
            ], 500);
        }
    }

    /**
     * Update the booking status.
     */
    public function cancel(string $id)
    {
        try {
            $user = Auth::user();
            $booking = Booking::where('id', $id)
                ->where('user_id', $user->id)
                ->first();
                
            if (!$booking) {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking not found'
                ], 404);
            }
            
            $booking->status = 'cancelled';
            $booking->save();
            
            // Log the activity
            ActivityLog::log(
                'booking',
                "Booking #{$booking->id} cancelled",
                [
                    'booking_id' => $booking->id,
                    'reason' => 'Customer requested cancellation',
                ],
                false
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Booking cancelled successfully',
                'booking' => $booking
            ]);
        } catch (\Exception $e) {
            Log::error('Error cancelling booking: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel booking'
            ], 500);
        }
    }
}

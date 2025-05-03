<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Car;
use App\Models\Booking;
use App\Models\ActivityLog;
use App\Services\WeatherService;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class AdminDashboardController extends Controller
{
    protected $weatherService;
    protected $analyticsService;
    
    public function __construct(WeatherService $weatherService, AnalyticsService $analyticsService)
    {
        $this->weatherService = $weatherService;
        $this->analyticsService = $analyticsService;
    }
    
    /**
     * Get basic dashboard data
     */
    public function index()
    {
        try {
            // Check if user is admin
            $user = Auth::user();
            if ($user->role !== 'admin') {
                return $this->unauthorized();
            }
            
            // Get basic statistics for the dashboard
            $usersCount = User::count();
            $activeCarsCount = Car::where('is_available', true)->count();
            $totalBookingsCount = Booking::count();
            
            // Calculate total revenue
            $revenue = Booking::whereIn('status', ['confirmed', 'completed'])
                ->sum('total_price');
            
            // Get recent activities
            $recentActivities = ActivityLog::orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($activity) {
                    return [
                        'id' => $activity->id,
                        'type' => $activity->type,
                        'message' => $activity->message,
                        'user' => $activity->user_name ?? 'System',
                        'timestamp' => $activity->created_at->toISOString(),
                        'actionable' => $activity->actionable,
                        'action_url' => $activity->action_url,
                    ];
                });
            
            // Get personalized insights
            $insights = $this->analyticsService->getBusinessInsights();
                
            return response()->json([
                'message' => 'Welcome to the admin dashboard',
                'status' => 'success',
                'data' => [
                    'usersCount' => $usersCount,
                    'activeCarsCount' => $activeCarsCount,
                    'totalBookingsCount' => $totalBookingsCount,
                    'revenue' => $revenue,
                    'recentActivities' => $recentActivities,
                    'insights' => $insights
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Dashboard error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error loading dashboard data'
            ], 500);
        }
    }
    
    /**
     * Get activity feed with pagination and filtering
     */
    public function activityFeed(Request $request)
    {
        try {
            // Check if user is admin
            $user = Auth::user();
            if ($user->role !== 'admin') {
                return $this->unauthorized();
            }
            
            // Get query parameters for pagination and filtering
            $limit = $request->input('limit', 25);
            $page = $request->input('page', 1);
            $type = $request->input('type');
            
            // Build query
            $query = ActivityLog::orderBy('created_at', 'desc');
            
            // Apply type filter if specified
            if ($type) {
                $query->where('type', $type);
            }
            
            // Get paginated results
            $activities = $query->paginate($limit);
            
            return response()->json([
                'status' => 'success',
                'data' => $activities
            ]);
        } catch (\Exception $e) {
            Log::error('Activity feed error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error loading activity feed'
            ], 500);
        }
    }
    
    /**
     * Get weather data for relevant locations
     */
    public function weather()
    {
        try {
            // Check if user is admin
            $user = Auth::user();
            if ($user->role !== 'admin') {
                return $this->unauthorized();
            }
            
            // Get weather for major Moroccan cities
            $weatherData = $this->weatherService->getMoroccanCitiesWeather();
            
            return response()->json([
                'status' => 'success',
                'data' => $weatherData
            ]);
        } catch (\Exception $e) {
            Log::error('Weather data error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error loading weather data'
            ], 500);
        }
    }
    
    /**
     * Get forecast for a specific city
     */
    public function forecast(Request $request)
    {
        try {
            // Check if user is admin
            $user = Auth::user();
            if ($user->role !== 'admin') {
                return $this->unauthorized();
            }
            
            $city = $request->input('city', 'Casablanca');
            
            // Get forecast data
            $forecastData = $this->weatherService->getForecast($city);
            
            return response()->json([
                'status' => 'success',
                'data' => $forecastData
            ]);
        } catch (\Exception $e) {
            Log::error('Forecast data error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error loading forecast data'
            ], 500);
        }
    }
    
    /**
     * Get predictive analytics data
     */
    public function predictions()
    {
        try {
            // Check if user is admin
            $user = Auth::user();
            if ($user->role !== 'admin') {
                return $this->unauthorized();
            }
            
            // Get booking predictions
            $bookingPredictions = $this->analyticsService->getBookingPredictions();
            
            // Get revenue forecasts
            $revenueForecasts = $this->analyticsService->getRevenueForecasts();
            
            // Get pricing recommendations
            $pricingRecommendations = $this->analyticsService->getPricingRecommendations();
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'bookingPredictions' => $bookingPredictions,
                    'revenueForecasts' => $revenueForecasts,
                    'pricingRecommendations' => $pricingRecommendations
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Predictions error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error loading prediction data'
            ], 500);
        }
    }
    
    /**
     * Get vehicle health data
     */
    public function vehicleHealth()
    {
        try {
            // Check if user is admin
            $user = Auth::user();
            if ($user->role !== 'admin') {
                return $this->unauthorized();
            }
            
            // Get vehicle health status
            $vehicleHealth = $this->analyticsService->getVehicleHealthStatus();
            
            return response()->json([
                'status' => 'success',
                'data' => $vehicleHealth
            ]);
        } catch (\Exception $e) {
            Log::error('Vehicle health error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error loading vehicle health data'
            ], 500);
        }
    }
    
    /**
     * Get customer satisfaction metrics
     */
    public function customerSatisfaction()
    {
        try {
            // Check if user is admin
            $user = Auth::user();
            if ($user->role !== 'admin') {
                return $this->unauthorized();
            }
            
            // Get satisfaction metrics
            $satisfactionMetrics = $this->analyticsService->getCustomerSatisfactionMetrics();
            
            return response()->json([
                'status' => 'success',
                'data' => $satisfactionMetrics
            ]);
        } catch (\Exception $e) {
            Log::error('Customer satisfaction error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error loading customer satisfaction data'
            ], 500);
        }
    }
    
    /**
     * Get revenue breakdown
     */
    public function revenueBreakdown()
    {
        try {
            // Check if user is admin
            $user = Auth::user();
            if ($user->role !== 'admin') {
                return $this->unauthorized();
            }
            
            // Get revenue breakdown
            $revenueBreakdown = $this->analyticsService->getRevenueBreakdown();
            
            return response()->json([
                'status' => 'success',
                'data' => $revenueBreakdown
            ]);
        } catch (\Exception $e) {
            Log::error('Revenue breakdown error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error loading revenue breakdown data'
            ], 500);
        }
    }
    
    /**
     * Get performance scorecard with KPIs
     */
    public function performanceScorecard()
    {
        try {
            // Check if user is admin
            $user = Auth::user();
            if ($user->role !== 'admin') {
                return $this->unauthorized();
            }
            
            // Get performance scorecard
            $performanceScorecard = $this->analyticsService->getPerformanceScorecard();
            
            return response()->json([
                'status' => 'success',
                'data' => $performanceScorecard
            ]);
        } catch (\Exception $e) {
            Log::error('Performance scorecard error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error loading performance scorecard data'
            ], 500);
        }
    }
    
    /**
     * Get location data for map visualization
     */
    public function mapData(Request $request)
    {
        try {
            // Check if user is admin
            $user = Auth::user();
            if ($user->role !== 'admin') {
                return $this->unauthorized();
            }
            
            // Get query parameters
            $period = $request->input('period', 'all'); // all, today, week, month
            
            // Define the Moroccan cities with coordinates
            $cities = [
                'Casablanca' => ['lat' => 33.5731, 'lng' => -7.5898],
                'Rabat' => ['lat' => 34.0209, 'lng' => -6.8416],
                'Marrakech' => ['lat' => 31.6295, 'lng' => -7.9811],
                'Fes' => ['lat' => 34.0181, 'lng' => -5.0078],
                'Tangier' => ['lat' => 35.7673, 'lng' => -5.7983],
                'Agadir' => ['lat' => 30.4277, 'lng' => -9.5981],
                'Meknes' => ['lat' => 33.8731, 'lng' => -5.5407],
                'Oujda' => ['lat' => 34.6808, 'lng' => -1.9079],
                'Kenitra' => ['lat' => 34.2610, 'lng' => -6.5802],
                'Tetouan' => ['lat' => 35.5689, 'lng' => -5.3683]
            ];
            
            // Create query based on time period
            $query = Booking::select('pickup_location', \DB::raw('count(*) as booking_count'));
            
            switch ($period) {
                case 'today':
                    $query->whereDate('created_at', now());
                    break;
                case 'week':
                    $query->whereBetween('created_at', [now()->startOfWeek(), now()]);
                    break;
                case 'month':
                    $query->whereBetween('created_at', [now()->startOfMonth(), now()]);
                    break;
            }
            
            // Group by pickup location
            $bookingCountsByLocation = $query->groupBy('pickup_location')
                ->pluck('booking_count', 'pickup_location')
                ->toArray();
            
            // Prepare heatmap data with coordinates
            $heatmapData = [];
            $markers = [];
            
            foreach ($cities as $city => $coords) {
                $count = $bookingCountsByLocation[$city] ?? rand(1, 15); // Use random data if no real data
                
                // Add city to heatmap with intensity based on booking count
                $heatmapData[] = [
                    'lat' => $coords['lat'],
                    'lng' => $coords['lng'],
                    'weight' => $count
                ];
                
                // Add marker for each city
                $markers[] = [
                    'id' => count($markers) + 1,
                    'city' => $city,
                    'lat' => $coords['lat'],
                    'lng' => $coords['lng'],
                    'bookings' => $count,
                    'revenue' => $count * rand(100, 500)
                ];
            }
            
            // Also include car locations (simulated)
            $carMarkers = [];
            $cars = Car::where('is_available', true)
                ->limit(15)
                ->get();
            
            foreach ($cars as $index => $car) {
                // Assign car to a random city with slight variation
                $randomCity = array_rand($cities);
                $cityCoords = $cities[$randomCity];
                
                // Add some random offset to avoid overlapping
                $latOffset = (rand(-10, 10) / 100);
                $lngOffset = (rand(-10, 10) / 100);
                
                $carMarkers[] = [
                    'id' => $car->id,
                    'name' => $car->name,
                    'lat' => $cityCoords['lat'] + $latOffset,
                    'lng' => $cityCoords['lng'] + $lngOffset,
                    'status' => $car->is_available ? 'available' : 'unavailable',
                    'image' => $car->image,
                    'category' => $car->category
                ];
            }
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'heatmap' => $heatmapData,
                    'cityMarkers' => $markers,
                    'carMarkers' => $carMarkers
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Map data error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error loading map data'
            ], 500);
        }
    }
    
    /**
     * Get user notifications
     */
    public function notifications()
    {
        try {
            // Check if user is admin
            $user = Auth::user();
            if ($user->role !== 'admin') {
                return $this->unauthorized();
            }
            
            // Get all activity logs that might need attention
            $notificationsQuery = ActivityLog::where('actionable', true)
                ->orderBy('created_at', 'desc')
                ->limit(50)
                ->get();
                
            // Format notifications
            $notifications = $notificationsQuery->map(function($log) {
                return [
                    'id' => $log->id,
                    'title' => $this->getNotificationTitle($log),
                    'message' => $log->message,
                    'type' => $log->type,
                    'timestamp' => $log->created_at->toISOString(),
                    'is_read' => (bool) rand(0, 1), // Simulated read status
                    'action_url' => $log->action_url,
                    'priority' => $this->getNotificationPriority($log)
                ];
            });
            
            // Group by category
            $groupedNotifications = [
                'high' => $notifications->where('priority', 'high')->values(),
                'medium' => $notifications->where('priority', 'medium')->values(),
                'low' => $notifications->where('priority', 'low')->values(),
            ];
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'notifications' => $groupedNotifications,
                    'unread_count' => $notifications->where('is_read', false)->count()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Notifications error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error loading notifications'
            ], 500);
        }
    }
    
    /**
     * Helper method to determine notification priority
     */
    private function getNotificationPriority($log)
    {
        if ($log->type === 'payment' && str_contains($log->message, 'failed')) {
            return 'high';
        }
        
        if ($log->type === 'car' && str_contains($log->message, 'maintenance')) {
            return 'medium';
        }
        
        if ($log->type === 'booking' && str_contains($log->message, 'cancelled')) {
            return 'medium';
        }
        
        return 'low';
    }
    
    /**
     * Helper method to generate notification titles
     */
    private function getNotificationTitle($log)
    {
        $titles = [
            'booking' => 'Booking Update',
            'payment' => 'Payment Alert',
            'user' => 'User Activity',
            'car' => 'Vehicle Update'
        ];
        
        return $titles[$log->type] ?? 'Notification';
    }
    
    /**
     * Helper for unauthorized response
     */
    private function unauthorized()
    {
        return response()->json([
            'status' => 'error',
            'message' => 'Unauthorized. Admin access required.'
        ], 403);
    }
} 
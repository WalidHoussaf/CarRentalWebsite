<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Car;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsService
{
    /**
     * Get booking predictions for next 30 days
     * 
     * @return array Predictions with confidence intervals
     */
    public function getBookingPredictions()
    {
        // Get historical booking data
        $historicalData = $this->getHistoricalBookingData();
        
        // In a real system, this would use a proper ML model
        // Here we'll simulate predictions based on historical patterns
        $predictions = [];
        $today = Carbon::today();
        
        for ($i = 1; $i <= 30; $i++) {
            $day = $today->copy()->addDays($i);
            $dayOfWeek = $day->dayOfWeek;
            
            // Base prediction on day of week pattern (higher on weekends)
            $basePrediction = in_array($dayOfWeek, [5, 6]) ? 
                rand(8, 15) : // Weekend
                rand(3, 10);  // Weekday
            
            // Add some randomness for variability
            $variance = rand(-2, 2);
            $prediction = max(0, $basePrediction + $variance);
            
            // Calculate confidence interval (simplified)
            $confidenceLow = max(0, $prediction - rand(1, 3));
            $confidenceHigh = $prediction + rand(1, 3);
            
            $predictions[] = [
                'date' => $day->format('Y-m-d'),
                'day_of_week' => $day->format('l'),
                'predicted_bookings' => $prediction,
                'confidence_interval' => [
                    'low' => $confidenceLow,
                    'high' => $confidenceHigh
                ],
                'is_weekend' => in_array($dayOfWeek, [5, 6])
            ];
        }
        
        return $predictions;
    }
    
    /**
     * Get revenue forecasts for next 30 days
     * 
     * @return array Revenue forecasts
     */
    public function getRevenueForecasts()
    {
        $bookingPredictions = $this->getBookingPredictions();
        $avgBookingValue = $this->getAverageBookingValue();
        
        $forecasts = [];
        
        foreach ($bookingPredictions as $prediction) {
            // Apply average booking value to prediction
            $predictedRevenue = $prediction['predicted_bookings'] * $avgBookingValue;
            
            // Calculate confidence interval for revenue
            $revenueLow = $prediction['confidence_interval']['low'] * $avgBookingValue;
            $revenueHigh = $prediction['confidence_interval']['high'] * $avgBookingValue;
            
            $forecasts[] = [
                'date' => $prediction['date'],
                'day_of_week' => $prediction['day_of_week'],
                'predicted_revenue' => round($predictedRevenue, 2),
                'confidence_interval' => [
                    'low' => round($revenueLow, 2),
                    'high' => round($revenueHigh, 2)
                ],
                'is_weekend' => $prediction['is_weekend']
            ];
        }
        
        return $forecasts;
    }
    
    /**
     * Generate pricing recommendations based on demand
     * 
     * @return array Pricing recommendations
     */
    public function getPricingRecommendations()
    {
        $cars = Car::all();
        $predictions = $this->getBookingPredictions();
        
        $recommendations = [];
        
        // Find high-demand days (simplified algorithm)
        $highDemandDays = array_filter($predictions, function($p) {
            return $p['predicted_bookings'] > 10;
        });
        
        // Find low-demand days
        $lowDemandDays = array_filter($predictions, function($p) {
            return $p['predicted_bookings'] < 5;
        });
        
        // Format dates
        $highDemandDates = array_map(function($day) {
            return $day['date'];
        }, $highDemandDays);
        
        $lowDemandDates = array_map(function($day) {
            return $day['date'];
        }, $lowDemandDays);
        
        // Generate recommendations by car category
        $categories = $cars->pluck('category')->unique();
        
        foreach ($categories as $category) {
            $categoryCars = $cars->where('category', $category);
            $avgPrice = $categoryCars->avg('price_per_day');
            
            $recommendations[$category] = [
                'category' => $category,
                'current_avg_price' => round($avgPrice, 2),
                'high_demand_days' => [
                    'dates' => $highDemandDates,
                    'recommendation' => 'Increase prices by 15-20%',
                    'suggested_price' => round($avgPrice * 1.15, 2)
                ],
                'low_demand_days' => [
                    'dates' => $lowDemandDates,
                    'recommendation' => 'Offer 10-15% discount',
                    'suggested_price' => round($avgPrice * 0.9, 2)
                ]
            ];
        }
        
        return $recommendations;
    }
    
    /**
     * Get personalized business insights
     * 
     * @return array Business insights
     */
    public function getBusinessInsights()
    {
        $insights = [];
        
        // Get recent bookings trend
        $recentTrend = $this->getRecentBookingTrend();
        
        if ($recentTrend['percentage_change'] > 10) {
            $insights[] = [
                'type' => 'positive',
                'title' => 'Booking Surge',
                'description' => "Bookings have increased by {$recentTrend['percentage_change']}% compared to previous period.",
                'recommendation' => 'Consider adding more vehicles to the fleet to meet increasing demand.',
                'data' => $recentTrend
            ];
        } elseif ($recentTrend['percentage_change'] < -10) {
            $insights[] = [
                'type' => 'negative',
                'title' => 'Booking Decline',
                'description' => "Bookings have decreased by " . abs($recentTrend['percentage_change']) . "% compared to previous period.",
                'recommendation' => 'Consider promotional offers to boost bookings.',
                'data' => $recentTrend
            ];
        }
        
        // Popular car categories
        $popularCategories = $this->getPopularCategories();
        
        if (!empty($popularCategories)) {
            $insights[] = [
                'type' => 'informative',
                'title' => 'Popular Car Categories',
                'description' => "'{$popularCategories[0]->car_category}' is the most popular category this month.",
                'recommendation' => 'Consider adding more vehicles in this category to the fleet.',
                'data' => $popularCategories
            ];
        }
        
        // Maintenance needed
        $maintenanceCount = rand(0, 5); // Simulated maintenance need count
        
        if ($maintenanceCount > 0) {
            $insights[] = [
                'type' => 'warning',
                'title' => 'Maintenance Required',
                'description' => "{$maintenanceCount} vehicles need maintenance soon.",
                'recommendation' => 'Schedule maintenance to avoid service disruptions.',
                'data' => [
                    'count' => $maintenanceCount,
                    'action_url' => '/admin/maintenance'
                ]
            ];
        }
        
        // Add additional simulated insights
        $insights[] = [
            'type' => 'informative',
            'title' => 'Revenue Opportunity',
            'description' => 'Weekend bookings tend to generate 25% more revenue than weekday bookings.',
            'recommendation' => 'Consider weekend-specific promotions for premium vehicles.',
            'data' => [
                'weekend_premium' => '25%',
                'action_url' => '/admin/pricing'
            ]
        ];
        
        return $insights;
    }
    
    /**
     * Get vehicle health status
     * 
     * @return array Vehicle health data
     */
    public function getVehicleHealthStatus()
    {
        $cars = Car::all();
        $result = [];
        
        foreach ($cars as $car) {
            // Simulate health metrics (in a real app, this would come from IoT devices or maintenance records)
            $totalBookings = Booking::where('car_id', $car->id)->count();
            
            // Simulate maintenance needs
            $lastMaintenance = now()->subDays(rand(10, 90));
            $nextMaintenanceDate = $lastMaintenance->copy()->addDays(90);
            $daysUntilMaintenance = now()->diffInDays($nextMaintenanceDate, false);
            
            // Calculate health status
            $status = 'good';
            if ($daysUntilMaintenance < 0) {
                $status = 'critical';
            } elseif ($daysUntilMaintenance < 14) {
                $status = 'warning';
            }
            
            // Calculate health percentage
            $healthPercentage = min(100, max(0, 
                $daysUntilMaintenance < 0 ? 0 : ($daysUntilMaintenance / 90) * 100
            ));
            
            $result[] = [
                'id' => $car->id,
                'name' => $car->name,
                'status' => $status,
                'health_percentage' => round($healthPercentage),
                'last_maintenance' => $lastMaintenance->format('Y-m-d'),
                'next_maintenance' => $nextMaintenanceDate->format('Y-m-d'),
                'days_until_maintenance' => $daysUntilMaintenance,
                'total_bookings' => $totalBookings,
                'mileage' => rand(500, 50000),
                'maintenance_items' => $this->getMaintenanceItems($status),
                'image' => $car->image
            ];
        }
        
        return $result;
    }
    
    /**
     * Get customer satisfaction metrics
     * 
     * @return array Satisfaction metrics
     */
    public function getCustomerSatisfactionMetrics()
    {
        // Simulate customer reviews and ratings
        $ratings = [
            5 => rand(20, 50),
            4 => rand(15, 40),
            3 => rand(5, 15),
            2 => rand(2, 10),
            1 => rand(1, 5)
        ];
        
        // Calculate average rating
        $totalRatings = array_sum($ratings);
        $weightedSum = 0;
        
        foreach ($ratings as $stars => $count) {
            $weightedSum += $stars * $count;
        }
        
        $averageRating = $totalRatings > 0 ? round($weightedSum / $totalRatings, 1) : 0;
        
        // Mock sentiment analysis of reviews
        $sentiment = [
            'positive' => rand(60, 90),
            'neutral' => rand(5, 20),
            'negative' => rand(1, 15)
        ];
        
        // Mock common phrases in reviews
        $commonPhrases = [
            ['text' => 'great service', 'count' => rand(10, 30), 'sentiment' => 'positive'],
            ['text' => 'clean car', 'count' => rand(8, 25), 'sentiment' => 'positive'],
            ['text' => 'helpful staff', 'count' => rand(7, 20), 'sentiment' => 'positive'],
            ['text' => 'easy booking', 'count' => rand(5, 15), 'sentiment' => 'positive'],
            ['text' => 'good price', 'count' => rand(5, 15), 'sentiment' => 'positive'],
            ['text' => 'comfortable', 'count' => rand(4, 12), 'sentiment' => 'positive'],
            ['text' => 'on time', 'count' => rand(4, 12), 'sentiment' => 'positive'],
            ['text' => 'average', 'count' => rand(3, 10), 'sentiment' => 'neutral'],
            ['text' => 'delayed', 'count' => rand(1, 8), 'sentiment' => 'negative'],
            ['text' => 'dirty', 'count' => rand(1, 5), 'sentiment' => 'negative'],
            ['text' => 'expensive', 'count' => rand(1, 5), 'sentiment' => 'negative']
        ];
        
        // Recent trend (simulated)
        $recentTrend = [
            'last_month' => rand(40, 50) / 10,
            'current_month' => $averageRating,
            'percentage_change' => round(($averageRating - (rand(40, 50) / 10)) / (rand(40, 50) / 10) * 100, 1)
        ];
        
        return [
            'average_rating' => $averageRating,
            'total_reviews' => $totalRatings,
            'ratings_distribution' => $ratings,
            'sentiment_analysis' => $sentiment,
            'common_phrases' => $commonPhrases,
            'trend' => $recentTrend
        ];
    }
    
    /**
     * Get revenue breakdown by different dimensions
     * 
     * @return array Revenue breakdowns
     */
    public function getRevenueBreakdown()
    {
        // Get total revenue
        $totalRevenue = Booking::whereIn('status', ['confirmed', 'completed'])
            ->sum('total_price');
        
        // By car category
        $byCategory = $this->getRevenueByCategoryBreakdown();
        
        // By time period (simulated)
        $byTimePeriod = [
            ['period' => 'This Week', 'amount' => round($totalRevenue * rand(10, 30) / 100, 2)],
            ['period' => 'Last Week', 'amount' => round($totalRevenue * rand(10, 30) / 100, 2)],
            ['period' => 'This Month', 'amount' => round($totalRevenue * rand(50, 80) / 100, 2)],
            ['period' => 'Last Month', 'amount' => round($totalRevenue * rand(50, 80) / 100, 2)]
        ];
        
        // By location (simulated)
        $locations = ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 'Agadir'];
        $byLocation = [];
        
        $remainingPercentage = 100;
        foreach ($locations as $index => $location) {
            // Last location gets the remaining percentage
            $percentage = $index === count($locations) - 1 
                ? $remainingPercentage 
                : rand(5, min(30, $remainingPercentage - 5));
                
            $remainingPercentage -= $percentage;
            
            $byLocation[] = [
                'location' => $location,
                'amount' => round($totalRevenue * $percentage / 100, 2),
                'percentage' => $percentage
            ];
        }
        
        // Sort by amount descending
        usort($byLocation, function($a, $b) {
            return $b['amount'] <=> $a['amount'];
        });
        
        return [
            'total_revenue' => $totalRevenue,
            'by_category' => $byCategory,
            'by_time_period' => $byTimePeriod,
            'by_location' => $byLocation
        ];
    }
    
    /**
     * Get performance scorecards with KPIs
     * 
     * @return array Performance KPIs
     */
    public function getPerformanceScorecard()
    {
        // This week's data
        $currentWeekBookings = Booking::whereDate('created_at', '>=', now()->startOfWeek())
            ->whereDate('created_at', '<=', now())
            ->count();
            
        $currentWeekRevenue = Booking::whereDate('created_at', '>=', now()->startOfWeek())
            ->whereDate('created_at', '<=', now())
            ->whereIn('status', ['confirmed', 'completed'])
            ->sum('total_price');
            
        $currentWeekCancellations = Booking::whereDate('created_at', '>=', now()->startOfWeek())
            ->whereDate('created_at', '<=', now())
            ->where('status', 'cancelled')
            ->count();
            
        // Last week's data for comparison
        $lastWeekBookings = Booking::whereDate('created_at', '>=', now()->subWeek()->startOfWeek())
            ->whereDate('created_at', '<=', now()->subWeek()->endOfWeek())
            ->count();
            
        $lastWeekRevenue = Booking::whereDate('created_at', '>=', now()->subWeek()->startOfWeek())
            ->whereDate('created_at', '<=', now()->subWeek()->endOfWeek())
            ->whereIn('status', ['confirmed', 'completed'])
            ->sum('total_price');
            
        $lastWeekCancellations = Booking::whereDate('created_at', '>=', now()->subWeek()->startOfWeek())
            ->whereDate('created_at', '<=', now()->subWeek()->endOfWeek())
            ->where('status', 'cancelled')
            ->count();
            
        // Calculate percentage changes
        $bookingsChange = $lastWeekBookings > 0 
            ? round((($currentWeekBookings - $lastWeekBookings) / $lastWeekBookings) * 100, 1)
            : 100;
            
        $revenueChange = $lastWeekRevenue > 0
            ? round((($currentWeekRevenue - $lastWeekRevenue) / $lastWeekRevenue) * 100, 1)
            : 100;
            
        $cancellationChange = $lastWeekCancellations > 0
            ? round((($currentWeekCancellations - $lastWeekCancellations) / $lastWeekCancellations) * 100, 1)
            : 0;
            
        return [
            'current_period' => [
                'start_date' => now()->startOfWeek()->format('Y-m-d'),
                'end_date' => now()->format('Y-m-d')
            ],
            'kpis' => [
                [
                    'name' => 'Total Bookings',
                    'current_value' => $currentWeekBookings,
                    'previous_value' => $lastWeekBookings,
                    'change_percentage' => $bookingsChange,
                    'target' => $lastWeekBookings * 1.1, // 10% increase as target
                    'progress_percentage' => $lastWeekBookings > 0 
                        ? min(100, round(($currentWeekBookings / ($lastWeekBookings * 1.1)) * 100))
                        : 0,
                    'status' => $bookingsChange >= 0 ? 'positive' : 'negative'
                ],
                [
                    'name' => 'Revenue',
                    'current_value' => $currentWeekRevenue,
                    'previous_value' => $lastWeekRevenue,
                    'change_percentage' => $revenueChange,
                    'target' => $lastWeekRevenue * 1.15, // 15% increase as target
                    'progress_percentage' => $lastWeekRevenue > 0 
                        ? min(100, round(($currentWeekRevenue / ($lastWeekRevenue * 1.15)) * 100))
                        : 0,
                    'status' => $revenueChange >= 0 ? 'positive' : 'negative',
                    'format' => 'currency'
                ],
                [
                    'name' => 'Cancellation Rate',
                    'current_value' => $currentWeekBookings > 0 
                        ? round(($currentWeekCancellations / $currentWeekBookings) * 100, 1)
                        : 0,
                    'previous_value' => $lastWeekBookings > 0 
                        ? round(($lastWeekCancellations / $lastWeekBookings) * 100, 1)
                        : 0,
                    'change_percentage' => $cancellationChange,
                    'target' => 5, // Target cancellation rate of 5%
                    'progress_percentage' => $currentWeekBookings > 0 
                        ? min(100, max(0, 100 - round(($currentWeekCancellations / $currentWeekBookings) * 100 / 5 * 100)))
                        : 100,
                    'status' => $cancellationChange <= 0 ? 'positive' : 'negative',
                    'format' => 'percentage'
                ]
            ],
            'custom_goals' => [
                [
                    'name' => 'New Customer Acquisitions',
                    'current_value' => rand(5, 20),
                    'target' => 25,
                    'progress_percentage' => min(100, rand(20, 80)),
                    'deadline' => now()->addDays(rand(3, 14))->format('Y-m-d')
                ],
                [
                    'name' => 'Fleet Utilization',
                    'current_value' => rand(50, 85) . '%',
                    'target' => '90%',
                    'progress_percentage' => rand(60, 95),
                    'deadline' => now()->addDays(rand(7, 21))->format('Y-m-d')
                ]
            ]
        ];
    }
    
    /**
     * Get historical booking data
     * 
     * @return array Historical booking counts by day
     */
    private function getHistoricalBookingData()
    {
        $data = [];
        $startDate = Carbon::today()->subDays(30);
        
        for ($i = 0; $i < 30; $i++) {
            $date = $startDate->copy()->addDays($i);
            
            $count = Booking::whereDate('created_at', $date)->count();
            
            $data[] = [
                'date' => $date->format('Y-m-d'),
                'count' => $count,
                'day_of_week' => $date->dayOfWeek
            ];
        }
        
        return $data;
    }
    
    /**
     * Get average booking value
     * 
     * @return float Average booking price
     */
    private function getAverageBookingValue()
    {
        $avg = Booking::whereIn('status', ['confirmed', 'completed'])->avg('total_price');
        return $avg ?: 0;
    }
    
    /**
     * Get recent booking trend
     * 
     * @return array Booking trend data
     */
    private function getRecentBookingTrend()
    {
        // Current period (last 7 days)
        $currentPeriodStart = Carbon::today()->subDays(7);
        $currentPeriodCount = Booking::whereDate('created_at', '>=', $currentPeriodStart)
            ->whereDate('created_at', '<=', Carbon::today())
            ->count();
            
        // Previous period (7 days before that)
        $previousPeriodStart = Carbon::today()->subDays(14);
        $previousPeriodEnd = $currentPeriodStart->copy()->subDay();
        $previousPeriodCount = Booking::whereDate('created_at', '>=', $previousPeriodStart)
            ->whereDate('created_at', '<=', $previousPeriodEnd)
            ->count();
            
        // Calculate change
        $percentageChange = $previousPeriodCount > 0 
            ? round((($currentPeriodCount - $previousPeriodCount) / $previousPeriodCount) * 100, 1)
            : 100;
            
        return [
            'current_period' => [
                'start' => $currentPeriodStart->format('Y-m-d'),
                'end' => Carbon::today()->format('Y-m-d'),
                'count' => $currentPeriodCount
            ],
            'previous_period' => [
                'start' => $previousPeriodStart->format('Y-m-d'),
                'end' => $previousPeriodEnd->format('Y-m-d'),
                'count' => $previousPeriodCount
            ],
            'percentage_change' => $percentageChange
        ];
    }
    
    /**
     * Get popular car categories
     * 
     * @return array Popular categories with booking counts
     */
    private function getPopularCategories()
    {
        $categories = DB::table('bookings')
            ->select('car_category', DB::raw('count(*) as booking_count'))
            ->whereNotNull('car_category')
            ->groupBy('car_category')
            ->orderBy('booking_count', 'desc')
            ->get();
            
        return $categories->toArray();
    }
    
    /**
     * Get maintenance items based on status
     * 
     * @param string $status Vehicle health status
     * @return array Maintenance items
     */
    private function getMaintenanceItems($status)
    {
        $items = [];
        
        if ($status === 'critical') {
            $items = [
                ['name' => 'Oil Change', 'status' => 'overdue', 'due_date' => now()->subDays(rand(1, 15))->format('Y-m-d')],
                ['name' => 'Brake Inspection', 'status' => 'overdue', 'due_date' => now()->subDays(rand(1, 10))->format('Y-m-d')],
                ['name' => 'Tire Rotation', 'status' => 'due', 'due_date' => now()->format('Y-m-d')]
            ];
        } elseif ($status === 'warning') {
            $items = [
                ['name' => 'Oil Change', 'status' => 'due', 'due_date' => now()->addDays(rand(1, 7))->format('Y-m-d')],
                ['name' => 'Brake Inspection', 'status' => 'upcoming', 'due_date' => now()->addDays(rand(8, 14))->format('Y-m-d')]
            ];
        } else {
            $items = [
                ['name' => 'Oil Change', 'status' => 'upcoming', 'due_date' => now()->addDays(rand(15, 30))->format('Y-m-d')],
                ['name' => 'Scheduled Maintenance', 'status' => 'upcoming', 'due_date' => now()->addDays(rand(20, 45))->format('Y-m-d')]
            ];
        }
        
        return $items;
    }
    
    /**
     * Get revenue by category breakdown
     * 
     * @return array Revenue by category
     */
    private function getRevenueByCategoryBreakdown()
    {
        $result = DB::table('bookings')
            ->select('car_category', DB::raw('SUM(total_price) as total_revenue'))
            ->whereIn('status', ['confirmed', 'completed'])
            ->whereNotNull('car_category')
            ->groupBy('car_category')
            ->orderBy('total_revenue', 'desc')
            ->get();
            
        // Calculate percentage of total
        $totalRevenue = $result->sum('total_revenue');
        
        return $result->map(function($item) use ($totalRevenue) {
            $item->percentage = $totalRevenue > 0 ? round(($item->total_revenue / $totalRevenue) * 100, 1) : 0;
            return $item;
        })->toArray();
    }
} 
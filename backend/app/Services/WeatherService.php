<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class WeatherService
{
    protected $apiKey;
    protected $baseUrl = 'https://api.openweathermap.org/data/2.5';
    
    public function __construct()
    {
        $this->apiKey = env('OPENWEATHER_API_KEY', '');
    }
    
    /**
     * Get current weather for a location
     * 
     * @param string $city The city name
     * @param string $country The country code (optional)
     * @return array Weather data or error
     */
    public function getCurrentWeather($city, $country = 'MA')
    {
        $cacheKey = "weather_{$city}_{$country}";
        
        // Check cache first (1 hour TTL)
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }
        
        try {
            $response = Http::get("{$this->baseUrl}/weather", [
                'q' => "{$city},{$country}",
                'appid' => $this->apiKey,
                'units' => 'metric'
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                
                // Format the response
                $weather = [
                    'location' => $city,
                    'country' => $country,
                    'temp' => $data['main']['temp'],
                    'feels_like' => $data['main']['feels_like'],
                    'description' => $data['weather'][0]['description'],
                    'icon' => $data['weather'][0]['icon'],
                    'wind_speed' => $data['wind']['speed'],
                    'humidity' => $data['main']['humidity'],
                    'updated_at' => now()->toISOString(),
                    'driving_conditions' => $this->getDrivingConditions($data)
                ];
                
                // Cache for 1 hour
                Cache::put($cacheKey, $weather, now()->addHour());
                
                return $weather;
            }
            
            Log::error('Weather API error: ' . $response->body());
            return ['error' => 'Unable to fetch weather data'];
            
        } catch (\Exception $e) {
            Log::error('Weather service error: ' . $e->getMessage());
            return ['error' => 'Weather service unavailable'];
        }
    }
    
    /**
     * Get forecast for the next 5 days
     * 
     * @param string $city The city name
     * @param string $country The country code (optional)
     * @return array Forecast data or error
     */
    public function getForecast($city, $country = 'MA')
    {
        $cacheKey = "forecast_{$city}_{$country}";
        
        // Check cache first (3 hours TTL)
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }
        
        try {
            $response = Http::get("{$this->baseUrl}/forecast", [
                'q' => "{$city},{$country}",
                'appid' => $this->apiKey,
                'units' => 'metric'
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                
                // Format the response - get daily forecasts
                $forecasts = [];
                $currentDate = null;
                
                foreach ($data['list'] as $item) {
                    $date = date('Y-m-d', $item['dt']);
                    
                    // Only take one reading per day (first one)
                    if ($date !== $currentDate) {
                        $currentDate = $date;
                        
                        $forecasts[] = [
                            'date' => $date,
                            'temp' => $item['main']['temp'],
                            'description' => $item['weather'][0]['description'],
                            'icon' => $item['weather'][0]['icon'],
                            'wind_speed' => $item['wind']['speed'],
                            'humidity' => $item['main']['humidity'],
                            'driving_conditions' => $this->getDrivingConditions($item)
                        ];
                    }
                }
                
                // Cache for 3 hours
                Cache::put($cacheKey, $forecasts, now()->addHours(3));
                
                return $forecasts;
            }
            
            Log::error('Weather forecast API error: ' . $response->body());
            return ['error' => 'Unable to fetch forecast data'];
            
        } catch (\Exception $e) {
            Log::error('Weather forecast service error: ' . $e->getMessage());
            return ['error' => 'Weather forecast service unavailable'];
        }
    }
    
    /**
     * Generate driving conditions based on weather data
     * 
     * @param array $weatherData Weather data from API
     * @return array Driving conditions assessment
     */
    protected function getDrivingConditions($weatherData)
    {
        $conditions = [
            'status' => 'good',
            'message' => 'Good driving conditions',
            'recommendations' => []
        ];
        
        // Check for rain
        if (isset($weatherData['weather'][0]['main']) && $weatherData['weather'][0]['main'] === 'Rain') {
            $conditions['status'] = 'moderate';
            $conditions['message'] = 'Wet roads, drive with caution';
            $conditions['recommendations'][] = 'Reduce speed on wet roads';
            $conditions['recommendations'][] = 'Maintain longer following distance';
        }
        
        // Check for strong winds
        if (isset($weatherData['wind']['speed']) && $weatherData['wind']['speed'] > 10) {
            $conditions['status'] = 'moderate';
            $conditions['message'] = 'Strong winds, drive with caution';
            $conditions['recommendations'][] = 'Grip steering wheel firmly';
            $conditions['recommendations'][] = 'Be cautious of side winds on open roads';
        }
        
        // Check for extreme temperatures
        if (isset($weatherData['main']['temp'])) {
            if ($weatherData['main']['temp'] > 35) {
                $conditions['status'] = 'moderate';
                $conditions['message'] = 'Very hot weather, check vehicle cooling';
                $conditions['recommendations'][] = 'Ensure air conditioning is working';
                $conditions['recommendations'][] = 'Check coolant levels before long trips';
            } elseif ($weatherData['main']['temp'] < 5) {
                $conditions['status'] = 'moderate';
                $conditions['message'] = 'Cold weather, check vehicle heating';
                $conditions['recommendations'][] = 'Allow engine to warm up properly';
                $conditions['recommendations'][] = 'Check tire pressure in cold weather';
            }
        }
        
        // Check for extreme conditions
        if (isset($weatherData['weather'][0]['main'])) {
            if (in_array($weatherData['weather'][0]['main'], ['Thunderstorm', 'Snow', 'Tornado'])) {
                $conditions['status'] = 'poor';
                $conditions['message'] = 'Dangerous driving conditions';
                $conditions['recommendations'][] = 'Avoid unnecessary travel';
                $conditions['recommendations'][] = 'If driving is essential, proceed with extreme caution';
            }
        }
        
        return $conditions;
    }
    
    /**
     * Get weather for all major cities in Morocco
     * 
     * @return array Weather data for major cities
     */
    public function getMoroccanCitiesWeather()
    {
        $cities = ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 'Agadir'];
        $result = [];
        
        foreach ($cities as $city) {
            $result[$city] = $this->getCurrentWeather($city);
        }
        
        return $result;
    }
} 
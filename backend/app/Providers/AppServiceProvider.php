<?php

namespace App\Providers;

use App\Services\WeatherService;
use App\Services\AnalyticsService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register Weather Service
        $this->app->singleton(WeatherService::class, function ($app) {
            return new WeatherService();
        });
        
        // Register Analytics Service
        $this->app->singleton(AnalyticsService::class, function ($app) {
            return new AnalyticsService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}

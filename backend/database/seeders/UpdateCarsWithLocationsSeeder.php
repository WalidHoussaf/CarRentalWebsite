<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Car;
use Illuminate\Support\Facades\DB;

class UpdateCarsWithLocationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            'casablanca',
            'rabat',
            'marrakesh',
            'mohammedia',
            'kenitra',
            'agadir',
            'tangier'
        ];

        // Get all cars without a location
        $cars = Car::whereNull('location')->get();
        
        foreach ($cars as $car) {
            // Assign a random location
            $randomLocation = $locations[array_rand($locations)];
            
            $car->location = $randomLocation;
            $car->save();
            
            $this->command->info("Updated car {$car->id} with location: {$randomLocation}");
        }
        
        $this->command->info('All cars have been updated with random locations!');
    }
} 
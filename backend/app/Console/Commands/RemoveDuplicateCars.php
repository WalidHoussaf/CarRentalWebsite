<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Car;
use Illuminate\Support\Facades\DB;

class RemoveDuplicateCars extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cars:remove-duplicates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Removes duplicate cars from the database based on name and brand';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for duplicate cars...');
        
        // Get all cars with duplicate name and brand
        $duplicates = Car::select('name', 'brand', DB::raw('COUNT(*) as count'))
            ->groupBy('name', 'brand')
            ->having('count', '>', 1)
            ->get();
        
        if ($duplicates->isEmpty()) {
            $this->info('No duplicate cars found.');
            return 0;
        }
        
        $this->info('Found ' . $duplicates->count() . ' cars with duplicates.');
        
        $totalRemoved = 0;
        
        // Process each duplicate
        foreach ($duplicates as $duplicate) {
            $this->info("Processing duplicate: {$duplicate->name} ({$duplicate->brand})");
            
            // Get all instances of this car, sorted by ID (to keep the oldest one)
            $cars = Car::where('name', $duplicate->name)
                ->where('brand', $duplicate->brand)
                ->orderBy('id')
                ->get();
            
            // Keep the first one, delete the rest
            $keep = $cars->shift();
            $this->info("Keeping car ID: {$keep->id}");
            
            foreach ($cars as $car) {
                $this->info("Removing duplicate car ID: {$car->id}");
                $car->delete();
                $totalRemoved++;
            }
        }
        
        $this->info("Finished removing duplicates. Removed {$totalRemoved} duplicate cars.");
        
        return 0;
    }
} 
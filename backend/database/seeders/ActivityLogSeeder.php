<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ActivityLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get a list of users to attribute activities to
        $users = User::all();
        
        if ($users->isEmpty()) {
            // If no users, create a few
            $this->command->info('No users found. Seeding will use "System" as the user.');
        }
        
        // Create sample booking activities
        $this->createBookingActivities($users);
        
        // Create sample user activities
        $this->createUserActivities($users);
        
        // Create sample car activities
        $this->createCarActivities($users);
        
        // Create sample payment activities
        $this->createPaymentActivities($users);
        
        $this->command->info('ActivityLog seeding completed successfully.');
    }
    
    /**
     * Create sample booking activities.
     */
    private function createBookingActivities($users)
    {
        // Sample car models
        $carModels = ['Range Rover Sport', 'Mercedes S-Class', 'BMW X5', 'Tesla Model 3', 'Audi Q7', 'Porsche 911'];
        
        // Filter out admin users for booking activities
        $regularUsers = $users->filter(function ($user) {
            return $user->role !== 'admin';
        });
        
        // If no regular users, use "System" as fallback
        $hasRegularUsers = $regularUsers->isNotEmpty();
        
        // New bookings (within the last 24 hours)
        for ($i = 0; $i < 5; $i++) {
            $user = $hasRegularUsers ? $regularUsers->random() : null;
            $car = $carModels[array_rand($carModels)];
            $time = Carbon::now()->subMinutes(rand(5, 1440));
            
            ActivityLog::create([
                'type' => 'booking',
                'message' => "New booking for {$car}",
                'user_id' => $user ? $user->id : null,
                'user_name' => $user ? $user->name : 'System',
                'data' => [
                    'car' => $car,
                    'booking_id' => rand(1000, 9999),
                ],
                'actionable' => (bool) rand(0, 1),
                'action_url' => '/admin/bookings/' . rand(1, 100),
                'created_at' => $time,
                'updated_at' => $time,
            ]);
        }
        
        // Completed bookings
        for ($i = 0; $i < 3; $i++) {
            $user = $hasRegularUsers ? $regularUsers->random() : null;
            $bookingId = rand(1000, 9999);
            $time = Carbon::now()->subHours(rand(3, 48));
            
            ActivityLog::create([
                'type' => 'booking',
                'message' => "Booking #{$bookingId} completed",
                'user_id' => $user ? $user->id : null,
                'user_name' => $user ? $user->name : 'System',
                'data' => [
                    'booking_id' => $bookingId,
                ],
                'actionable' => false,
                'created_at' => $time,
                'updated_at' => $time,
            ]);
        }
        
        // Cancelled bookings
        for ($i = 0; $i < 2; $i++) {
            $user = $hasRegularUsers ? $regularUsers->random() : null;
            $bookingId = rand(1000, 9999);
            $time = Carbon::now()->subHours(rand(6, 72));
            
            ActivityLog::create([
                'type' => 'booking',
                'message' => "Booking #{$bookingId} cancelled",
                'user_id' => $user ? $user->id : null,
                'user_name' => $user ? $user->name : 'System',
                'data' => [
                    'booking_id' => $bookingId,
                    'reason' => 'Customer requested cancellation',
                ],
                'actionable' => (bool) rand(0, 1),
                'action_url' => '/admin/bookings/' . rand(1, 100),
                'created_at' => $time,
                'updated_at' => $time,
            ]);
        }
    }
    
    /**
     * Create sample user activities.
     */
    private function createUserActivities($users)
    {
        // New user registrations
        for ($i = 0; $i < 4; $i++) {
            $time = Carbon::now()->subHours(rand(1, 96));
            
            ActivityLog::create([
                'type' => 'user',
                'message' => 'New user registered',
                'user_id' => null,
                'user_name' => 'System',
                'data' => [
                    'email' => 'user' . rand(100, 999) . '@example.com',
                ],
                'actionable' => false,
                'created_at' => $time,
                'updated_at' => $time,
            ]);
        }
        
        // User profile updates
        if ($users->isNotEmpty()) {
            for ($i = 0; $i < 3; $i++) {
                $user = $users->random();
                $time = Carbon::now()->subHours(rand(2, 120));
                
                ActivityLog::create([
                    'type' => 'user',
                    'message' => 'User profile updated',
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'data' => [
                        'fields_updated' => ['profile picture', 'phone number'],
                    ],
                    'actionable' => false,
                    'created_at' => $time,
                    'updated_at' => $time,
                ]);
            }
        }
    }
    
    /**
     * Create sample car activities.
     */
    private function createCarActivities($users)
    {
        // Sample car models
        $carModels = ['Mercedes S-Class', 'BMW X5', 'Range Rover Sport', 'Tesla Model 3', 'Audi Q7', 'Porsche 911'];
        
        // Cars marked as available
        for ($i = 0; $i < 3; $i++) {
            $user = $users->isNotEmpty() ? $users->random() : null;
            $car = $carModels[array_rand($carModels)];
            $time = Carbon::now()->subHours(rand(1, 72));
            
            ActivityLog::create([
                'type' => 'car',
                'message' => "{$car} marked as available",
                'user_id' => $user ? $user->id : null,
                'user_name' => $user ? $user->name : 'System',
                'data' => [
                    'car' => $car,
                    'car_id' => rand(1, 100),
                ],
                'actionable' => false,
                'created_at' => $time,
                'updated_at' => $time,
            ]);
        }
        
        // Maintenance scheduled
        for ($i = 0; $i < 2; $i++) {
            $user = $users->isNotEmpty() ? $users->random() : null;
            $car = $carModels[array_rand($carModels)];
            $time = Carbon::now()->subHours(rand(6, 120));
            
            ActivityLog::create([
                'type' => 'car',
                'message' => "{$car} maintenance scheduled",
                'user_id' => $user ? $user->id : null,
                'user_name' => $user ? $user->name : 'System',
                'data' => [
                    'car' => $car,
                    'car_id' => rand(1, 100),
                    'maintenance_date' => Carbon::now()->addDays(rand(1, 14))->format('Y-m-d'),
                ],
                'actionable' => true,
                'action_url' => '/admin/cars/' . rand(1, 100),
                'created_at' => $time,
                'updated_at' => $time,
            ]);
        }
    }
    
    /**
     * Create sample payment activities.
     */
    private function createPaymentActivities($users)
    {
        // Payments received
        $amounts = [250, 450, 750, 1250, 1800, 2100];
        
        for ($i = 0; $i < 5; $i++) {
            $amount = $amounts[array_rand($amounts)];
            $time = Carbon::now()->subHours(rand(1, 72));
            
            ActivityLog::create([
                'type' => 'payment',
                'message' => "Payment of \${$amount} received",
                'user_id' => null,
                'user_name' => 'System',
                'data' => [
                    'amount' => $amount,
                    'payment_id' => 'PAY-' . rand(1000000, 9999999),
                    'booking_id' => rand(1000, 9999),
                ],
                'actionable' => (bool) rand(0, 1),
                'action_url' => '/admin/bookings/' . rand(1, 100),
                'created_at' => $time,
                'updated_at' => $time,
            ]);
        }
        
        // Failed payments
        for ($i = 0; $i < 2; $i++) {
            $amount = $amounts[array_rand($amounts)];
            $time = Carbon::now()->subHours(rand(12, 96));
            
            ActivityLog::create([
                'type' => 'payment',
                'message' => "Payment failed: \${$amount}",
                'user_id' => null,
                'user_name' => 'System',
                'data' => [
                    'amount' => $amount,
                    'payment_id' => 'PAY-' . rand(1000000, 9999999),
                    'booking_id' => rand(1000, 9999),
                    'error' => 'Payment gateway error: Transaction declined',
                ],
                'actionable' => true,
                'action_url' => '/admin/bookings/' . rand(1, 100),
                'created_at' => $time,
                'updated_at' => $time,
            ]);
        }
    }
} 
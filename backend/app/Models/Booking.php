<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Booking extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'car_id',
        'car_name',
        'car_price',
        'car_category',
        'car_image',
        'start_date',
        'end_date',
        'total_days',
        'pickup_location',
        'dropoff_location',
        'options',
        'options_price',
        'total_price',
        'status',
    ];
    
    protected $casts = [
        'options' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'car_price' => 'float',
        'options_price' => 'float',
        'total_price' => 'float',
    ];
    
    /**
     * Get the user that owns the booking.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Get the car associated with the booking.
     */
    public function car()
    {
        return $this->belongsTo(Car::class);
    }
}

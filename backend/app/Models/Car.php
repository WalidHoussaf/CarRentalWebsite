<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Car extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'brand',
        'model',
        'year',
        'daily_rate',
        'description',
        'category',
        'color',
        'transmission',
        'seats',
        'doors',
        'air_conditioning',
        'gps',
        'bluetooth',
        'usb',
        'fuel_type',
        'license_plate',
        'image',
        'is_available',
        'location',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'daily_rate' => 'decimal:2',
        'air_conditioning' => 'boolean',
        'gps' => 'boolean',
        'bluetooth' => 'boolean',
        'usb' => 'boolean',
        'is_available' => 'boolean',
    ];

    /**
     * Get the bookings for the car.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
} 
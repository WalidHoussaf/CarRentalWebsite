<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'message',
        'user_id',
        'user_name',
        'data',
        'actionable',
        'action_url',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'data' => 'array',
        'actionable' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    
    /**
     * Get the user that performed the activity.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Create a new activity log entry.
     *
     * @param string $type The type of activity (booking, user, car, payment, system)
     * @param string $message A human-readable message describing the activity
     * @param array $data Additional data to store with the activity
     * @param bool $actionable Whether this activity requires action
     * @param string|null $actionUrl URL for taking action if applicable
     * @return ActivityLog
     */
    public static function log(string $type, string $message, array $data = [], bool $actionable = false, string $actionUrl = null): self
    {
        $userId = auth()->id();
        $userName = auth()->user() ? auth()->user()->name : 'System';
        
        return self::create([
            'type' => $type,
            'message' => $message,
            'user_id' => $userId,
            'user_name' => $userName,
            'data' => $data,
            'actionable' => $actionable,
            'action_url' => $actionUrl,
        ]);
    }
} 
<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ActivityLogController extends Controller
{
    /**
     * Get recent activity logs.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function recent(Request $request)
    {
        try {
            // Validate query parameters
            $request->validate([
                'limit' => 'integer|min:1|max:100',
                'type' => 'string|in:booking,user,car,payment,system,all',
            ]);
            
            // Get query parameters
            $limit = $request->query('limit', 10);
            $type = $request->query('type', 'all');
            
            // Start the query
            $query = ActivityLog::query()->orderBy('created_at', 'desc');
            
            // Filter by type if specified and not 'all'
            if ($type !== 'all') {
                $query->where('type', $type);
            }
            
            // Get the paginated results
            $activities = $query->limit($limit)->get();
            
            // Transform the data to match the frontend expected format
            $transformedActivities = $activities->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'type' => $activity->type,
                    'message' => $activity->message,
                    'user' => $activity->user_name ?? 'System',
                    'timestamp' => $activity->created_at->toISOString(),
                    'actionable' => $activity->actionable,
                    'action_url' => $activity->action_url,
                    'data' => $activity->data,
                ];
            });
            
            return response()->json([
                'status' => 'success',
                'message' => 'Recent activities retrieved successfully',
                'data' => $transformedActivities,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching recent activities: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve recent activities',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Store a new activity log.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'type' => 'required|string|in:booking,user,car,payment,system',
                'message' => 'required|string|max:255',
                'data' => 'nullable|array',
                'actionable' => 'boolean',
                'action_url' => 'nullable|string|max:255',
            ]);
            
            // Create the activity log
            $activity = ActivityLog::log(
                $validated['type'],
                $validated['message'],
                $validated['data'] ?? [],
                $validated['actionable'] ?? false,
                $validated['action_url'] ?? null
            );
            
            return response()->json([
                'status' => 'success',
                'message' => 'Activity logged successfully',
                'data' => $activity,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error logging activity: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to log activity',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
} 
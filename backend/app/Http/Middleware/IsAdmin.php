<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Log detailed information about the request and user
        if (!$request->user()) {
            Log::error('Admin middleware: No authenticated user found');
            return response()->json(['message' => 'Unauthenticated'], 401)
                ->header('Content-Type', 'application/json');
        }
        
        Log::info('Admin middleware check', [
            'user_id' => $request->user()->id,
            'user_email' => $request->user()->email,
            'user_role' => $request->user()->role,
            'path' => $request->path(),
            'method' => $request->method(),
            'is_admin' => $request->user()->role === 'admin'
        ]);
        
        if ($request->user()->role !== 'admin') {
            Log::warning('Admin access denied', [
                'user_id' => $request->user()->id,
                'role' => $request->user()->role
            ]);
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403)
                ->header('Content-Type', 'application/json');
        }
        
        return $next($request);
    }
} 
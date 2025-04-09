<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    /**
     * Display a listing of all users.
     */
    public function index()
    {
        try {
            \Log::info('AdminUserController@index: Attempting to fetch all users');
            
            // Debug info for CORS
            \Log::info('HTTP Headers', [
                'Origin' => request()->header('Origin'),
                'Access-Control-Request-Method' => request()->header('Access-Control-Request-Method'),
                'Access-Control-Request-Headers' => request()->header('Access-Control-Request-Headers'),
                'Authorization' => request()->header('Authorization') ? 'Present' : 'Not present'
            ]);
            
            try {
                $connectionName = \DB::connection()->getName();
                $database = \DB::connection()->getDatabaseName();
                \Log::info('DB Connection Info', [
                    'connection' => $connectionName,
                    'database' => $database
                ]);
            } catch (\Exception $e) {
                \Log::error('Error getting DB connection info', [
                    'message' => $e->getMessage()
                ]);
            }
            
            // Debug info
            $route = \Route::current();
            \Log::info('Current route info', [
                'uri' => $route->uri(),
                'middleware' => $route->middleware(),
                'action' => $route->getActionName()
            ]);
            
            // Check authentication
            $user = auth()->user();
            if (!$user) {
                \Log::error('AdminUserController@index: No authenticated user');
                return response()->json([
                    'message' => 'Not authenticated',
                    'error' => 'No authenticated user found'
                ], 401)
                ->header('Content-Type', 'application/json');
            }
            
            // Manual admin role check (since we're not using middleware)
            if ($user->role !== 'admin') {
                \Log::error('AdminUserController@index: User is not admin', [
                    'user_id' => $user->id,
                    'role' => $user->role
                ]);
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                    'error' => 'User does not have admin role'
                ], 403)
                ->header('Content-Type', 'application/json');
            }
            
            \Log::info('AdminUserController@index: Authenticated user', [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role
            ]);
            
            // Try to get all users - with detailed logging
            try {
                $userCount = \App\Models\User::count();
                \Log::info('User count: ' . $userCount);
                
                $users = \App\Models\User::all();
                \Log::info('User query executed successfully');
                
                \Log::info('AdminUserController@index: Users fetched successfully', ['count' => $users->count()]);
                
                // Fix: ensure clean JSON response with no debug output
                return response()->json($users)
                    ->header('Content-Type', 'application/json')
                    ->header('X-Debug-Info', 'AdminUserController:index');
            } catch (\Exception $dbError) {
                \Log::error('Error querying users table', [
                    'message' => $dbError->getMessage(),
                    'line' => $dbError->getLine(),
                    'file' => $dbError->getFile()
                ]);
                throw $dbError; // Re-throw to be caught by the outer try-catch
            }
        } catch (\Exception $e) {
            \Log::error('AdminUserController@index: Exception caught', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'message' => 'Failed to retrieve users',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500)
            ->header('Content-Type', 'application/json');
        }
    }

    /**
     * Get a specific user by ID.
     */
    public function show($id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404)
            ->header('Content-Type', 'application/json');
        }
        
        return response()->json(['user' => $user])
            ->header('Content-Type', 'application/json');
    }

    /**
     * Create a new user.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'string', 'in:user,admin'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'zip_code' => ['nullable', 'string', 'max:20'],
            'country' => ['nullable', 'string', 'max:100'],
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422)
            ->header('Content-Type', 'application/json');
        }
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'city' => $request->city,
            'zip_code' => $request->zip_code,
            'country' => $request->country,
        ]);
        
        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201)
        ->header('Content-Type', 'application/json');
    }

    /**
     * Update a user's details.
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404)
            ->header('Content-Type', 'application/json');
        }
        
        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => [
                'sometimes', 
                'string', 
                'email', 
                'max:255', 
                Rule::unique('users')->ignore($user->id)
            ],
            'role' => ['sometimes', 'string', 'in:user,admin'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'zip_code' => ['nullable', 'string', 'max:20'],
            'country' => ['nullable', 'string', 'max:100'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422)
            ->header('Content-Type', 'application/json');
        }
        
        // Update fields
        if ($request->has('name')) {
            $user->name = $request->name;
        }
        
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        
        if ($request->has('role')) {
            $user->role = $request->role;
        }
        
        if ($request->has('phone_number')) {
            $user->phone_number = $request->phone_number;
        }
        
        if ($request->has('address')) {
            $user->address = $request->address;
        }
        
        if ($request->has('city')) {
            $user->city = $request->city;
        }
        
        if ($request->has('zip_code')) {
            $user->zip_code = $request->zip_code;
        }
        
        if ($request->has('country')) {
            $user->country = $request->country;
        }
        
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        
        $user->save();
        
        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ])
        ->header('Content-Type', 'application/json');
    }

    /**
     * Delete a user.
     */
    public function destroy($id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404)
            ->header('Content-Type', 'application/json');
        }
        
        // Prevent admins from deleting themselves
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot delete your own admin account'
            ], 403)
            ->header('Content-Type', 'application/json');
        }
        
        // Delete the user and their tokens
        $user->tokens()->delete();
        $user->delete();
        
        return response()->json([
            'message' => 'User deleted successfully'
        ])
        ->header('Content-Type', 'application/json');
    }
}

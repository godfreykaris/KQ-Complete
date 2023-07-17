<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

use App\Models\User;

class UsersController extends Controller
{
    public function register(Request $request)
    {
        try 
            {
                // Validate the registration form data
                $validatedData = $request->validate([
                    'name' => 'required|string|max:255',
                    'email' => 'required|email|unique:users',
                    //'password' => 'required|string|min:8|confirmed',
                ]);
            
                // Create the new user
                $user = User::create([
                    // 'name' => $validatedData['name'],
                    // 'email' => $validatedData['email'],
                    // 'password' => bcrypt($validatedData['password']),
                
                    /** For testing use only */
                    'name' => fake()->name,
                    'email' => fake()->unique()->safeEmail,
                    'password' => Hash::make(fake()->password(8)),
                ]);

            } 
            catch (\Exception $e) {
                // Log the error
                Log::error($e->getMessage());
            
                // Return the error response
                return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
            }
        
        // Perform any additional actions after registration, e.g., sending verification email, logging in the user, etc.

        return response()->json(['user' => $user, 'status' => 1, 'value' => "Registration successful"]);
    }
}

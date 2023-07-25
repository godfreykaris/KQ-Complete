<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    public function register(Request $request)
    {
        try 
            {
                // Validate the registration form data
                $userData = $request->validate([
                    'name' => 'required|string|max:255',
                    'email' => 'required|email|unique:users',
                    //'password' => 'required|string|min:8|confirmed',
                ]);
            
                // Create the new user
                $user = User::create([
                    // 'name' => $userData['name'],
                    // 'email' => $userData['email'],
                    // 'password' => bcrypt($userData['password']),
                
                    /** For testing use only */
                    'name' => fake()->name,
                    'email' => fake()->unique()->safeEmail,
                    'password' => Hash::make(fake()->password(8)),
                ]);

            } 
            catch (\Exception $e) 
            {
                // Log the error
                Log::error($e->getMessage());
            
                // Return the error response
                return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
            }
        
        // Perform any additional actions after registration, e.g., sending verification email, logging in the user, etc.

        return response()->json(['user' => $user, 'status' => 1, 'value' => "Registration successful"]);
    }

    // Get a particular user
    public function getUser($id)
    {
        try 
        {
            $user = User::findOrFail($id);
            return response()->json(['user' => $user, 'status' => 1]);
        } 
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'User not found.'], 404);
        }
    }

    // Update a User
    public function updateUser(Request $request, $id)
    {
        try 
        {
            $user = User::findOrFail($id);

            $userData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $id,
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user->name = $userData['name'];
            $user->email = $userData['email'];
            $user->password = $userData['password'];

            $user->save();

            return response()->json(['user' => $user, 'status' => 1, 'message' => 'User updated successfully']);
        } 
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.'], 500);

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
        }
    }

    // Delete a User
    public function deleteUser($id)
    {
        try 
        {
            $user = User::findOrFail($id);
            $user->delete();
            return response()->json(['message' => 'User deleted successfully', 'status' => 1]);
        } 
        catch (ModelNotFoundException $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'User not found.'], 404);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.'], 500);

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
        }
    }

    // List all Users (Paginated)
    public function listUsers()
    {
        try
        {
            $users = User::paginate(10); // Adjust the pagination limit as needed
            return response()->json(['users' => $users, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.'], 500);

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
        }
        
    }

    // Search Users
    public function searchUsers(Request $request)
    {
        try
        {
            $searchTerm = $request->input('search');
            $users = User::where('name', 'like', '%' . $searchTerm . '%')
                ->orWhere('email', 'like', '%' . $searchTerm . '%')
                ->get();
            return response()->json(['users' => $users, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.'], 500);

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
        }
        
    }

    // View Current User Profile
    public function viewUserProfile()
    {
        try
        {
            $user = Auth::user();
            return response()->json(['user' => $user, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.'], 500);

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
        }        
    }

    // User Payment Methods (Assuming a 'payments' relationship is set up in the User model)
    public function userPaymentMethods()
    {
        $user = Auth::user();
        $paymentMethods = $user->payments;
        return response()->json(['payment_methods' => $paymentMethods, 'status' => 1]);
    }

    // User Wallet or Points (Assuming a 'wallet' attribute is present in the User model)
    public function userWallet()
    {
        $user = Auth::user();
        $walletBalance = $user->wallet;
        return response()->json(['wallet_balance' => $walletBalance, 'status' => 1]);
    }


    // // Update Current User Profile
    // public function updateCurrentUserProfile(Request $request)
    // {
    //     $user = Auth::user();

    //     $userData = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|email|unique:users,email,' . $user->id,
    //         'password' => 'nullable|string|min:8|confirmed',
    //     ]);

    //     $user->name = $userData['name'];
    //     $user->email = $userData['email'];

    //     if ($request->has('password')) {
    //         $user->password = Hash::make($userData['password']);
    //     }

    //     $user->save();

    //     return response()->json(['user' => $user, 'status' => 1, 'message' => 'User profile updated successfully']);
    // }

    // // User Booking History
    // public function userBookingHistory()
    // {
    //     $user = Auth::user();
    //     $bookings = $user->bookings; // Assuming you have a 'bookings' relationship set up in the User model
    //     return response()->json(['bookings' => $bookings, 'status' => 1]);
    // }

    

}

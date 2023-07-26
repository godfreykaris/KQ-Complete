<?php

namespace App\Http\Controllers;

use App\Models\Payment;
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
            //return response()->json(['error' => 'An error occurred.'], 500);

            // For debugging
             return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
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
            $users = User::all();
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

    // Add a new payment method for the user
    public function addPaymentMethod(Request $request)
    {
        try 
        {
            // Validate the payment method data
            $request->validate([
                'card_number' => 'required|string',
                'card_holder_name' => 'required|string',
                'expiration_date' => 'required|string',
                'security_code' => 'required|string',
            ]);

            // Get the authenticated user
            $user = Auth::user();

            // Save the payment method details to the user's record in the database
            $paymentMethod = new Payment([
                'card_number' => $request->input('card_number'),
                'card_holder_name' => $request->input('card_holder_name'),
                'expiration_date' => $request->input('expiration_date'),
                'security_code' => $request->input('security_code'),
            ]);

            User::where('id', $user->id)->payments()->save($paymentMethod);

            return response()->json(['message' => 'Payment method added successfully.', 'status' => 1]);
        } 
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred while adding the payment method.'], 500);
        }
    }

    // Delete a payment method for the user
    public function deletePaymentMethod($paymentId)
    {
        try 
        {
            // Get the authenticated user
            $user = Auth::user();

            // Find the payment method by its id and ensure it belongs to the authenticated user
            $paymentMethod = Payment::where('user_id', $user->id)->findOrFail($paymentId);

            // Delete the payment method
            $paymentMethod->delete();

            return response()->json(['message' => 'Payment method deleted successfully.', 'status' => 1]);
        }
        catch (ModelNotFoundException $e) 
        {
            Log::error($e->getMessage());
            // Handle ModelNotFoundException
            return response()->json(['error' => 'Payment method not found.'], 404);
        } 
        catch (\Exception $e) 
        {
            // Handle other exceptions
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred while deleting the payment method.'], 500);

            // For debugging
            // return response()->json(['error' => 'An error occurred while deleting the payment method. ' . $e->getMessage() ], 500);
        }
    }


    // User Wallet or Points (Assuming a 'wallet' attribute is present in the User model)
    public function userWallet()
    {
        try 
        {
            $user = Auth::user();
            $walletBalance = $user->wallet;
            $rewardPoints = $user->reward_points;
            return response()->json(['wallet_balance' => $walletBalance, 'reward_points' => $rewardPoints, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.'], 500);
        }
    }

    // Reward users with points for booking a flight
    public function rewardPointsForBookingFlight(Request $request)
    {
        try
        {
            $userPointsData = $request->validate([
                'points_earned' => 'required|integer|min:1',               
            ]);

            // Assume the user's booking is successful, and they earned 100 reward points
            $user = Auth::user();
            $pointsEarned = $userPointsData['points_earned'];

            // Update the user's reward_points attribute
            User::where('id', $user->id)
                ->increment('reward_points', $pointsEarned);

            // Optionally, you can also update the wallet balance if they earned some wallet credits as part of the reward
            // $user->increment('wallet', $walletCreditsEarned);

            return response()->json(['message' => 'Points rewarded successfully.', 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred while rewarding points.'], 500);

            // For debugging
            // return response()->json(['error' => 'An error occurred while rewarding points. ' . $e->getMessage()], 500);
        }
    }


    // Update Current User Profile
    public function updateCurrentUserProfile(Request $request)
    {
        try
        {
            $user = Auth::user();

            $userData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'password' => 'nullable|string|min:8|confirmed',
            ]);

            $user->name = $userData['name'];
            $user->email = $userData['email'];

            if ($request->has('password')) 
            {
                $user->password = Hash::make($userData['password']);
            }

            $mUser = User::findOrFail($user->id);
            $mUser->save();

            return response()->json(['user' => $user, 'status' => 1, 'message' => 'User profile updated successfully']);
        }
        catch (ModelNotFoundException $e) 
        {
            return response()->json(['error' => 'Flight not found'], 404);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred while rewarding points.'], 500);

            // For debugging
            // return response()->json(['error' => 'An error occurred while rewarding points. ' . $e->getMessage()], 500);
        }
        
    }

    // User Booking History
    public function userBookingHistory()
    {
        try
        {
            $user = Auth::user();
        
            $mUser = User::findOrFail($user->id);
            $bookings = $mUser->bookings; // Assuming you have a 'bookings' relationship set up in the User model

            return response()->json(['bookings' => $bookings, 'status' => 1]);
        }
        catch (ModelNotFoundException $e) 
        {
            return response()->json(['error' => 'User not found', 'status' => 0], 404);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.', 'status' => 0], 500);

            // For debugging
            // return response()->json(['error' => 'An error occurred while rewarding points. ' . $e->getMessage()], 500);
        }
        
    }


}

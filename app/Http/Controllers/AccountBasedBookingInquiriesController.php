<?php

namespace App\Http\Controllers;

use App\Models\AccountBasedBookingInquiry;
use App\Models\BookingInquiryType;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AccountBasedBookingInquiriesController extends Controller
{
    public function store(Request $request)
    {
            try 
            {
                $validatedData = $request->validate([
                    'name' => 'required',
                    'email' => 'required|email',
                    'user_id' => 'required|exists:users,id',
                    'booking_inquiry_type_id' => 'required|exists:booking_inquiry_types,id',
                    'subject' => 'required',
                    'message' => 'required',
                ]);
        
                $accountBasedBookingInquiry = AccountBasedBookingInquiry::create([
                            // 'name' => $validatedData['name'],
                            // 'email' => $validatedData['email'],
                            // 'user_id' => $validatedData['user_id'],
                            // 'booking_inquiry_type_id' => $validatedData['inquiry_type_id'],          
                            // 'subject' => $validatedData['subject'],
                            // 'message' => $validatedData['message'],
        
                             /**For testing only */
                            'name' => fake()->name,
                            'email' => fake()->safeEmail,
                            'user_id' => User::pluck('id')->random(), 
                            'booking_inquiry_type_id' => BookingInquiryType::pluck('id')->random(),          
                            'subject' => fake()->sentence,
                            'message' => fake()->paragraph,
                        ]
                    );
            } 
            catch (\Exception $e) {
                // Log the error
                Log::error($e->getMessage());
            
                // Return the error response
                return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
            }

        return response()->json(['booking_inquiry' => $accountBasedBookingInquiry, 'status' => 1, 'value' => "User booking inquiry sent successfully"]);
    }
}

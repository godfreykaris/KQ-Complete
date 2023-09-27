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
                $inquiryData = $request->validate([
                    'name' => 'required',
                    'email' => 'required|email',
                    'user_id' => 'required|exists:users,id',
                    'booking_inquiry_type_id' => 'required|exists:booking_inquiry_types,id',
                    'subject' => 'required',
                    'message' => 'required',
                ]);
        
                $accountBasedBookingInquiry = AccountBasedBookingInquiry::create([
                            'name' => $inquiryData['name'],
                            'email' => $inquiryData['email'],
                            'user_id' => $inquiryData['user_id'],
                            'booking_inquiry_type_id' => $inquiryData['inquiry_type_id'],          
                            'subject' => $inquiryData['subject'],
                            'message' => $inquiryData['message'],
                            'user_id' => User::pluck('id')->random(),  // For testing

                            
                        ]
                    );

                return response()->json(['status' => 1, 'success' => "User booking inquiry sent successfully"]);

            } 
            catch (\Exception $e) 
            {
                // Log the error
                Log::error($e->getMessage());
            
                // Return the error response
                
                // For Debugging
                // return response()->json(['error' => 'An error occurred. ' . $e->getMessage(), 'status' => 0]);

                return response()->json(['error' => 'An error occurred.', 'status' => 0]);
            }
    }

     // Get all enquiry types
     public function getInquiryTypes(Request $request)
     {
         try
         {
             $inquiries = BookingInquiryType::all();
 
             return response()->json(['inquiries' => $inquiries, 'status' => 1]);
         }
         catch (\Exception $e) 
         {
             // Log the exception or handle it as needed
             // For example:
             Log::error($e->getMessage());
 
             // For debugging
             // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()]);
 
              return response()->json(['error' => 'An error occurred.', 'status' => 0]);
         }
     }
 
}

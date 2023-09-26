<?php

namespace App\Http\Controllers;

use App\Models\BookingInquiryType;
use App\Models\GuestBookingInquiry;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;

class GuestBookingInquiryController extends Controller
{
    public function store(Request $request)
    {
            try 
            {
                $inquiryData = $request->validate([
                    'name' => 'required',
                    'email' => 'required|email',
                    'booking_inquiry_type_id' => 'required|exists:booking_inquiry_types,id',
                    'subject' => 'required',
                    'message' => 'required',
                ]);
        
                $guestBookingInquiry = GuestBookingInquiry::create([
                            'name' => $inquiryData['name'],
                            'email' => $inquiryData['email'],
                            'booking_inquiry_type_id' => $inquiryData['booking_inquiry_type_id'],          
                            'subject' => $inquiryData['subject'],
                            'message' => $inquiryData['message'],
                                
                        ]
                    );

                    return response()->json(['status' => 1, 'success' => "Guest booking inquiry sent successfully"]);
            } 
            catch (\Exception $e) 
            {
                // Log the error
                Log::error($e->getMessage());
            
                // Return the error response

                // For debugging
                 return response()->json(['error' => 'An error occurred. ' . $e->getMessage(), 'status' => 0]);

                //return response()->json(['error' => 'An error occurred.', 'status' => 0]);
            }

            
    }

   
}

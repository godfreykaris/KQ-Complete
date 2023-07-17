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
                $validatedData = $request->validate([
                    'name' => 'required',
                    'email' => 'required|email',
                    'booking_inquiry_type_id' => 'required|exists:booking_inquiry_types,id',
                    'subject' => 'required',
                    'message' => 'required',
                ]);
        
                $guestBookingInquiry = GuestBookingInquiry::create([
                            // 'name' => $validatedData['name'],
                            // 'email' => $validatedData['email'],
                            // 'booking_inquiry_type_id' => $validatedData['inquiry_type_id'],          
                            // 'subject' => $validatedData['subject'],
                            // 'message' => $validatedData['message'],
        
                             /**For testing only */
                            'name' => fake()->name,
                            'email' => fake()->safeEmail,
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

        return response()->json(['booking_inquiry' => $guestBookingInquiry, 'status' => 1, 'value' => "Guest booking inquiry sent successfully"]);
    }
}

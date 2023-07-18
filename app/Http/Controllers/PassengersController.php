<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Passenger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PassengersController extends Controller
{
    public function addPassenger(Request $request, $bookingReference)
    {
        try
        {
            // Retrieve the booking
             $booking = Booking::where('booking_reference', $bookingReference)->first();

             if (!$booking) {
                 return response()->json(['error' => 'Booking not found.'], 404);
             }

             $passengersData = $request->validate([
                'passengers' => 'required|array',
                'passengers.*.name' => 'required|string',
                'passengers.*.date_of_birth' => 'required|date',
            ]);

            // Create and save the new passengers
            foreach ($passengersData['passengers'] as $passengerData) {
                $passenger = new Passenger($passengerData);
                $booking->passengers()->save($passenger);
            }

            return response()->json(['passengers' => $passengersData, 'status' => 1]);
        }
        catch (\Exception $e) {
            // Log the error
            Log::error($e->getMessage());
        
            // Return the error response
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
        }        
        
    }


    public function deletePassenger($passengerId)
    {
        try
        {
            // Retrieve the booking
            $passenger = Passenger::where('passenger_id', $passengerId)->first();

            if (!$passenger) {
                return response()->json(['error' => 'Booking not found.'], 404);
            }

            // Delete the booking
            $passenger->delete();

            return response()->json(['info' =>"Passenger deleted successfully", 'status' => 1]);
        }
        catch (\Exception $e) {
            // Log the error
            Log::error($e->getMessage());
        
            // Return the error response
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
        }        
        
    }

    public function updatePassenger(Request $request, $passengerId)
    {
        try {
            // Validate the user input
            $validatedData = $request->validate([
                'name' => 'required|string',
                'date_of_birth' => 'required|date',
            ]);

            // Retrieve the booking
            $passenger = Passenger::where('passenger_id', $passengerId)->first();

            if (!$passenger) {
                return response()->json(['error' => 'Booking not found.'], 404);
            }

            // Update the passenger details
            $passenger->update($validatedData);

            return response()->json([ 'passenger' => $passenger, 'info' => 'Passenger updated successfully', 'status' => 1]);
        } catch (\Exception $e) {
            // Log the error
            Log::error($e->getMessage());

            // Return the error response
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
        }
    }

}

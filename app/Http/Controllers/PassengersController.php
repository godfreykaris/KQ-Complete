<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Flight;
use App\Models\Passenger;
use App\Models\Seat;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class PassengersController extends Controller
{
    public function getPassengers($bookingReference, $ticketNumber)
    {
        try
        {
            // Retrieve the booking
             $booking = Booking::where('booking_reference', $bookingReference)->first();

             // Make sure the booking is valid
             if (!$booking) 
             {
                 return response()->json(['error' => 'Booking not found.', 'status' => 0]);
             }

             

            /** Get the ticket so that we can also update its price */
            $ticket = Ticket::where('booking_reference', $bookingReference)
                             ->where('ticket_number', $ticketNumber)
                             ->first();

            // Make sure the ticket is valid
            if(!$ticket)
            {
                return response()->json(['error' => 'The ticket associated with this booking is invalid. Booking reference: ' . $bookingReference, 'status' => 0]);
            }

            $passengers = Passenger::with(['seat.location', 'seat.flightClass'])
                                    ->where('booking_id', $booking->id)->get();

            if(!$passengers)
                return response()->json(['error' => 'No passengers found', 'status' => 0]);


            return response()->json(['passengers' => $passengers, 'flightId' => $booking->flight_id, 'success' => 'Your ticket was found.', 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the error
            Log::error($e->getMessage());
        
            // Return the error response
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage(), 'status' => 0]); // For debugging
            //return response()->json(['error' => 'An error occurred.', 'status' => 0]);
        }        
        
    }

    public function addPassengers(Request $request, $bookingReference, $ticketNumber)
    {
        try
        {
            // Retrieve the booking
             $booking = Booking::where('booking_reference', $bookingReference)->first();

             // Make sure the booking is valid
             if (!$booking) 
             {
                 return response()->json(['error' => 'Booking not found.', 'status' => 0]);
             }

             $passengersData = $request->validate([
                'passengers' => 'required|array',
                'passengers.*.name' => 'required|string',
                'passengers.*.passport_number' => 'string',
                'passengers.*.identification_number' => 'string',
                'passengers.*.date_of_birth' => 'required|date',
                'passengers.*.seat_id' => 'required|exists:seats,id',
            ]);

            /*Get the flight. The flight is_international field is used to make sure the passenges have 
             the required identification details */
            $flight = Flight::where('id', $booking->flight_id)->first();

            // Make sure the flight is valid
            if(!$flight)
            {
                return response()->json(['error' => 'The flight associated with this booking does not exist. Booking reference: ' . $bookingReference, 'status' => 0]);
            }

            /** Get the ticket so that we can also update its price */
            $ticket = Ticket::where('booking_reference', $bookingReference)
                             ->where('ticket_number', $ticketNumber)
                             ->first();

            // Make sure the ticket is valid
            if(!$ticket)
            {
                return response()->json(['error' => 'The ticket associated with this booking is invalid. Booking reference: ' . $bookingReference, 'status' => 0]);
            }

            // The ticket price to update
            $ticketPrice = $ticket->ticket_price;

            // Create and save the new passengers
            $addedPassengers = [];
            foreach ($passengersData['passengers'] as $passengerData) 
            {
                // Make sure all the correct identification details are provided
                if(!isset($passengerData['passport_number']) && !$passengerData['identification_number'])
                {
                    return response()->json(['error' => 'You must provide the passport number(international or domestic travels) or identification number(domestic travels) for ' . $passengerData['name'] . ' .', 'status' => 0]);
                }
            
                if($flight->is_international && !isset($passengerData['passport_number']))
                {
                    return response()->json(['error' => 'You must provide the passport number for ' . $passengerData['name'] . ' for international travels', 'status' => 0]);
                }

                $seat = DB::table('seats')->where('id', $passengerData['seat_id'])->first();
                
                
                if(!$seat)
                {                    
                    return response()->json(['error' => 'There are no available seats', 'status' => 0]);
                }
                /****************************************************************************** */

                // Make sure the seat is avilable
                if (!$seat || !$seat->is_available) 
                {
                    return response()->json(['error' => 'Selected seat for ' . $passengerData['name'] . ' is not available.', 'status' => 0]);
                }
                else
                {
                    // Add the passenger
                    $passenger = new Passenger($passengerData);
                    $passenger->passenger_id = $passenger->generatePassengerId();

                    $existingPassenger = Passenger::where('seat_id', $passenger->seat_id)
                                                    ->where('passport_number', $passenger->passport_number)
                                                    ->where('identification_number', $passenger->identification_number)
                                                    ->first();

                    if($existingPassenger)
                    {
                        return response()->json(['error' => 'Passenger Exists', 'status' => 0]);
                    }

                    $booking->passengers()->save($passenger);
                    $addedPassengers[] = $passenger->toArray(); // Convert passenger object to an array and store it

                    // Update the seat's availability
                    $seat->update([
                'is_available' => false,
            ]);  
                    
                    // Update the ticket price
                    $ticketPrice += $seat->price;
                }                
                
            }

            // Update the ticket
            $ticket->update([
                'ticket_price' => $ticketPrice,            
            ]);

            return response()->json(['success' => 'Passenger Added successfully.', 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the error
            Log::error($e->getMessage());
        
            // Return the error response
             return response()->json(['error' => 'An error occurred. ' . $e->getMessage(), 'status' => 0]); // For debugging
           // return response()->json(['error' => 'An error occurred.', 'status' => 0]);
        }        
        
    }


    public function deletePassenger($bookingReference, $ticketNumber, $seatNumber)
    {
        try
        {
            // Retrieve the booking
            $booking = Booking::where('booking_reference', $bookingReference)->first();

            // Make sure the booking is valid
            if (!$booking) 
            {
                return response()->json(['error' => 'Booking not found.', 'status' => 0]);
            }

            /** Get the ticket so that we can also update its price */
            $ticket = Ticket::where('booking_reference', $bookingReference)
                             ->where('ticket_number', $ticketNumber)
                             ->first();

            // Make sure the ticket is valid
            if(!$ticket)
            {
                return response()->json(['error' => 'The ticket associated with this booking is invalid. Booking reference: ' . $bookingReference, 'status' => 0]);
            }

            
            $seat = Seat::where('seat_number', $seatNumber)
                        ->where('flight_id' , $booking->flight_id)->first();

            if (!$seat) 
            {
                return response()->json(['error' => 'Seat not found.' , 'status' => 0]);
            }

            // Retrieve the booking
            $passenger = Passenger::where('booking_id', $booking->id)
                         ->where('seat_id' , $seat->id)->first();

            if (!$passenger) 
            {
                return response()->json(['error' => 'Passenger not found.', 'status' => 0]);
            }

            
            // Make sure the seat is valid
            if(!$seat)
            {
                return response()->json(['error' => 'The passenger\'s seat is unavailable.', 'status' => 0]);
            }

            // Update the seat availability
            $seat->update([
                'is_available' => true,
            ]);            

            //Update the ticket price
            $seatPrice = $seat->price;
            $ticketPrice = $ticket->ticket_price;
            $ticketPrice -= $seatPrice;
            $ticket->update([
                'ticket_price' => $ticketPrice,            
            ]);

            // Delete the passenger
            $passenger->delete();

            return response()->json(['success' =>"Passenger deleted successfully", 'status' => 1]);
        }
        catch (\Exception $e) {
            // Log the error
            Log::error($e->getMessage());
        
            // Return the error response
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage(), 'status' => 0]);
        }        
        
    }

    public function updatePassengers(Request $request, $bookingReference, $ticketNumber)
{
    try 
    {
        // Retrieve the booking
        $booking = Booking::where('booking_reference', $bookingReference)->first();

        // Make sure the booking is valid
        if (!$booking) 
        {
            return response()->json(['error' => 'Booking not found.', 'status' => 0]);
        }

        $passengersData = $request->validate([
            'passengers' => 'required|array',
            'passengers.*.name' => 'required|string',
            'passengers.*.passport_number' => 'string',
            'passengers.*.identification_number' => 'string',
            'passengers.*.date_of_birth' => 'required|date',
            'passengers.*.seat_id' => 'required|exists:seats,id',
            'passengers.*.passenger_id' => 'required|exists:passengers,passenger_id',

        ]);

        /** Get the ticket so that we can also update its price */
        $ticket = Ticket::where('booking_reference', $bookingReference)
                ->where('ticket_number', $ticketNumber)
                ->first();

        // Make sure the ticket is valid
        if(!$ticket)
        {
            return response()->json(['error' => 'The ticket associated with this booking is invalid. Booking reference: ' . $bookingReference, 'status' => 0]);
        }


        // Iterate over the passengers provided in the request
        foreach ($passengersData['passengers'] as $passengerData) 
        {
            // Find the passenger by a unique identifier (e.g., passport number or identification number)
            $existingPassenger = Passenger::where('passenger_id', $passengerData['passenger_id'])->first();

            // Update passenger's seat availability
            $seat = Seat::where('id', $passengerData['seat_id'])->first();
            // Make sure the seat is valid
            if(!$seat && ($seat->is_available || $seat->id === $existingPassenger->seat_id))
            {
                return response()->json(['error' => 'The passenger\'s seat is unavailable.', 'status' => 0]);
            }

            if ($existingPassenger) 
            {
                // Update the existing passenger's details
                $existingPassenger->update($passengerData);
            } 
            else 
            {
                // Passenger doesn't exist, create a new one
                $passenger = new Passenger($passengerData);
                $passenger->passenger_id = $passenger->generatePassengerId();
                $booking->passengers()->save($passenger);
            }
        }

        return response()->json(['success' => 'Passengers updated successfully.', 'status' => 1]);
    } 
    catch (\Exception $e) 
    {
        // Log the error
        Log::error($e->getMessage());

        // Return the error response
        return response()->json(['error' => 'An error occurred. ' . $e->getMessage(), 'status' => 0]);
    }
}


}

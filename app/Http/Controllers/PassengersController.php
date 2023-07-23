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
    public function addPassengers(Request $request, $bookingReference)
    {
        try
        {
            // Retrieve the booking
             $booking = Booking::where('booking_reference', $bookingReference)->first();

             // Make sure the booking is valid
             if (!$booking) 
             {
                 return response()->json(['error' => 'Booking not found.'], 404);
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
                return response()->json(['error' => 'The flight associated with this booking does not exist. Booking reference: ' . $bookingReference], 400);
            }

            /** Get the ticket so that we can also update its price */
            $ticket = Ticket::where('booking_reference', $bookingReference)->first();

            // Make sure the ticket is valid
            if(!$ticket)
            {
                return response()->json(['error' => 'The ticket associated with this booking is invalid. Booking reference: ' . $bookingReference], 400);
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
                    return response()->json(['error' => 'You must provide the passport number(international or domestic travels) or identification number(domestic travels) for ' . $passengerData['name'] . ' .'], 400);
                }
            
                if($flight->is_international && !isset($passengerData['passport_number']))
                {
                    return response()->json(['error' => 'You must provide the passport number for ' . $passengerData['name'] . ' for international travels'], 400);
                }

                //$seat = DB::table('seats')->where('id', $passengerData['seat_id'])->first();
                
                /****************************** For testing only ****************************/
                // For now we use an available seat for testing
                $availableSeat = Seat::where('is_available', true)->first(); 
                if($availableSeat)
                {
                    $seat = DB::table('seats')->where('id', $availableSeat->id)->first(); 
                    
                    // For testing only
                    $passengerData['seat_id'] = $seat->id;
                    if($passengerData['passport_number'])
                        $passengerData['passport_number'] = fake()->numerify('##########'); // For testing only
                    if($passengerData['identification_number'])
                        $passengerData['identification_number'] = fake()->numerify('##########'); // For testing only
                
                }
                else
                {
                    return response()->json(['error' => 'There are no available seats'], 400);
                }
                /****************************************************************************** */

                // Make sure the seat is avilable
                if (!$seat || !$seat->is_available) 
                {
                    return response()->json(['error' => 'Selected seat for ' . $passengerData['name'] . ' is not available.'], 400);
                }
                else
                {
                    // Add the passenger
                    $passenger = new Passenger($passengerData);
                    $passenger->passenger_id = $passenger->generatePassengerId();
                    $booking->passengers()->save($passenger);
                    $addedPassengers[] = $passenger->toArray(); // Convert passenger object to an array and store it

                    // Update the seat's availability
                    DB::table('seats')->where('id', $seat->id)->update(['is_available' => false]); 
                    
                    // Update the ticket price
                    $ticketPrice += $seat->price;
                }                
                
            }

            // Update the ticket
            $ticket->update([
                'ticket_price' => $ticketPrice,            
            ]);

            return response()->json(['passengers' => $addedPassengers, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the error
            Log::error($e->getMessage());
        
            // Return the error response
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500); // For debugging
            return response()->json(['error' => 'An error occurred.'], 500);
        }        
        
    }


    public function deletePassenger($passengerId)
    {
        try
        {
            // Retrieve the booking
            $passenger = Passenger::where('passenger_id', $passengerId)->first();

            if (!$passenger) 
            {
                return response()->json(['error' => 'Passenger not found.'], 404);
            }

            // We get the booking which allows us to get the associated ticket and thus update the ticket price
            $booking = Booking::where('id', $passenger->booking_id)->first();

            // Make sure the booking is valid
            if(!$booking)
            {
                return response()->json(['error' => 'The passenger is associated to an invalid booking'], 404);
            }

            // Get the ticket
            $ticket = Ticket::where('booking_reference', $booking->booking_reference)->first();

            // Make sure it is a valid ticket
            if(!$ticket)
            {
                return response()->json(['error' => 'The passenger is associated to an invalid ticket'], 404);
            }

            // Update passenger's seat availability
            $seat = Seat::where('id', $passenger->seat_id)->first();
            // Make sure the seat is valid
            if(!$seat || !$seat->is_available)
            {
                return response()->json(['error' => 'The passenger\'s seat is unavailable.'], 404);
            }

            // Update the seat availability
            DB::table('seats')->where('id', $seat->id)->update(['is_available' => true]); 
            

            //Update the ticket price
            $seatPrice = $seat->price;
            $ticketPrice = $ticket->ticket_price;
            $ticketPrice -= $seatPrice;
            $ticket->update([
                'ticket_price' => $ticketPrice,            
            ]);

            // Delete the passenger
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
            
            // Retrieve the passenger
            $passenger = Passenger::where('id', $passengerId)->first();

            // Make sure the passenger is valid
            if (!$passenger) 
            {
                return response()->json(['error' => 'Passenger not found.'], 404);
            }

            // Validate the user input
            $passengerData = $request->validate([
                
                'name' => 'required|string',
                'passport_number' => 'string',
                'identification_number' => 'string',
                'date_of_birth' => 'required|date',
                'seat_id' => 'required|exists:seats,id',
            ]);

            // Get the booking to which the passenger belongs. We need it for the booking reference and flight id
            $booking = Booking::where('id', $passenger->booking_id)->first();

            // Make sure the booking is valid
            if(!$booking)
            {
                return response()->json(['error' => 'The passenger belongs to an invalid booking.'], 404);
            }

            /*Get the flight. The flight is_international field is used to make sure the passenges have 
             the required identification details */
             $flight = Flight::where('id', $booking->flight_id)->first();

             // Make sure the flight is valid
             if(!$flight)
             {
                 return response()->json(['error' => 'The flight associated with this passengers booking does not exist.'], 400);
             }

            // Make sure all the correct identification details are provided
            if(!isset($passengerData['passport_number']) && !$passengerData['identification_number'])
            {
                return response()->json(['error' => 'You must provide the passport number(international or domestic travels) or identification number(domestic travels) for ' . $passengerData['name'] . ' .'], 400);
            }
        
            if($flight->is_international && !isset($passengerData['passport_number']))
            {
                return response()->json(['error' => 'You must provide the passport number for ' . $passengerData['name'] . ' for international travels'], 400);
            }
                       
            /*************** For testing only ********************/
            $availableSeat = Seat::where('is_available', true)->first(); 
            if($availableSeat)
            {
                $seat = DB::table('seats')->where('id', $availableSeat->id)->first(); 
                
                // For testing only
                $passengerData['seat_id'] = $seat->id;
                if($passengerData['passport_number'])
                    $passengerData['passport_number'] = fake()->numerify('##########'); // For testing only
                if($passengerData['identification_number'])
                    $passengerData['identification_number'] = fake()->numerify('##########'); // For testing only
            
            }
            else
            {
                return response()->json(['error' => 'There are no available seats'], 400);
            }
            /****************************************************/

             // Check if the seat has been changed
            $seatId = $passengerData['seat_id'];

            if($seatId !== $passenger->seat_id)
            {
                $seat = Seat::where('id', $seatId)->first();
                // Make sure the seat is valid
                if(!$seat || !$seat->is_available)
                {
                    return response()->json(['error' => 'The passenger\'s selected seat is unavilable.'], 404);
                }
             
                // Update the seat availability
                DB::table('seats')->where('id', $seat->id)->update(['is_available' => false]); 

                // Update the prevoius seat availability
                $previousSeat = Seat::where('id', $passenger->seat_id)->first();

                // Make sure the passenger had a valid seat
                if(!$previousSeat || $previousSeat->is_available)
                {
                   return response()->json(['error' => 'The passenger\'s previous seat is invalid.'], 404);
                }

                DB::table('seats')->where('id', $previousSeat->id)->update(['is_available' => true]); 

                // Store the ticket prices, previous and current
                $previousSeatPrice = $previousSeat->price;
                $currentSeatPrice =$seat->price;

                // Get the ticket
                $ticket = Ticket::where('booking_reference', $booking->booking_reference)->first();

                // Make sure it is a valid ticket
                if(!$ticket)
                {
                    return response()->json(['error' => 'The passenger is associated to an invalid ticket'], 404);
                }

                $ticketPrice = $ticket->ticket_price;
                
                $newTicketPrice = $ticketPrice - $previousSeatPrice + $currentSeatPrice;
                
                $ticket->update([
                    'ticket_price' => $newTicketPrice,            
                ]);

            }           
             
            // Update the passenger details
            $passenger->update($passengerData);

            return response()->json([ 'passenger' => $passenger, 'info' => 'Passenger updated successfully', 'status' => 1]);
        } 
        catch (\Exception $e) 
        {
            // Log the error
            Log::error($e->getMessage());

            // Return the error response
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
        }
    }

}

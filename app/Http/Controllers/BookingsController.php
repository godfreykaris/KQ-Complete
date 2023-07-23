<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Booking;
use App\Models\Ticket;
use App\Models\Flight;
use App\Models\Seat;
use App\Models\Passenger;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;


class BookingsController extends Controller
{

    public function generateBookingReference()
    {
        $bookingReference = 'KQ-BR-' . strtoupper(Str::random(8));

        // Check if the generated booking reference already exists in the database
        while (Booking::where('booking_reference', $bookingReference)->exists()) 
        {
            $bookingReference = 'KQ-BR-' . strtoupper(Str::random(8));
        }
    
           
        return $bookingReference;
    }

    public function generateTicketNumber()
    {
        $ticketPrefix = 'KQ-TK-'; 
        $randomNumber = mt_rand(100000, 999999); // Generate a random 6-digit number
        
        $ticketNumber = $ticketPrefix . $randomNumber;

        // Check if the generated ticket number already exists in the database
        while (Ticket::where('ticket_number', $ticketNumber)->exists()) 
        {
            $randomNumber = mt_rand(100000, 999999);
            $ticketNumber = $ticketPrefix . $randomNumber;
        }

        
        return $ticketNumber;
    }

    
    public function generateBoardingPass()
    {
        $boardingPass = 'KQ-BP-' . strtoupper(Str::random(10));


        // Check if the generated boarding pass already exists in the database
        while (Ticket::where('boarding_pass', $boardingPass)->exists()) 
        {
            $boardingPass = 'KQ-BP-' . strtoupper(Str::random(10));
        }
    
           
        return $boardingPass;
    }

    public function calculateTicketPrice($bookingId)
    {
        // Get the passengers associated with the booking
        $passengers = Passenger::where('booking_id', $bookingId)->get();

        $ticketPrice = 0.0;

        foreach($passengers as $passenger)
        {
            // Get the passenger's seat price
            $seatPrice = Seat::where('id', $passenger->seat_id)->first()->price;

            $ticketPrice += $seatPrice;
        }

        return $ticketPrice;
    }

    public function getFlightStatus($flightId)
    {
        // Get the flight status id
        $flightStatusId = Flight::where('id', $flightId)->first()->flight_status_id;

        // Make sure the flight status is valid
        if($flightStatusId)
            return $flightStatusId;
        else
            return null;
    }

    

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {       

        try 
        {
                // Validate the request data
                $bookingData = $request->validate([
                    'flight_id' => 'required|exists:flights,id',
                    'email' => 'required|email',

                    'passengers' => 'required|array',
                    'passengers.*.name' => 'required|string',
                    'passengers.*.passport_number' => 'string',
                    'passengers.*.identification_number' => 'string',
                    'passengers.*.date_of_birth' => 'required|date',
                    'passengers.*.seat_id' => 'required|exists:seats,id',                
                ]);
            
                // Retrieve the selected flight and check if it's available
                $flight = Flight::where('id', $bookingData['flight_id'])->first();
                if (!$flight)
                {
                    return response()->json(['error' => 'Invalid flight selection.'], 400);
                }
                
                // Check if the selected seats are available
                $seats = []; // For storing the available seats
                foreach ($bookingData['passengers'] as $passengerData) 
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

                    /** For testing only */
                    $availableSeat = Seat::where('is_available', true)->first();
                    if($availableSeat)
                    {
                        $seat = Seat::where('id', $availableSeat->id)->first();

                        if (!$seat || !$seat->is_available) {
                            return response()->json(['error' => 'Selected seat for ' . $passengerData['name'] . ' is not available.'], 400);
                        }
    
                        $seats[] = $seat; //Append the seat
    
                        // Update the seat's availability
                        $seat->update([
                            'is_available' => false,
                        ]); 
                    }
                    else
                    {
                        return response()->json(['error' => 'There are no available seats'], 400);
                    }


                }                
            
                // Create a new booking
                $booking = Booking::create([
                    // 'flight_id' => $bookingData['flight_id'],
                    // 'email' => $bookingData['passenger_email'],
                    'booking_reference' => $this->generateBookingReference(),
                    'booking_date' => fake()->dateTime(),

                    /**For testing only */
                    'flight_id' => Flight::pluck('id')->random(),
                    'email' => fake()->safeEmail,
                    
                ]);
                            
                // Create and save the new passengers
                $addedPassengers = [];
                $counter = 0;
                foreach ($bookingData['passengers'] as $passengerData) {

                    // For testing only
                    $passengerData['seat_id'] = $seats[$counter]->id; 
                    
                    // For testing only
                    if($passengerData['passport_number'])
                        $passengerData['passport_number'] = fake()->numerify('##########'); // For testing only
                    if($passengerData['identification_number'])
                        $passengerData['identification_number'] = fake()->numerify('##########'); // For testing only
                                    
                    $passenger = new Passenger($passengerData);
                    
                    $passenger->passenger_id = $passenger->generatePassengerId();

                    $booking->passengers()->save($passenger);
                    $addedPassengers[] = $passenger->toArray(); // Convert passenger object to an array and store it

                    // Update the seat's availability
                    
                    $seat = Seat::where('id', $passenger->seat_id)->first();
                    $seat->update([
                        'is_available' => false,
                    ]); 

                    $counter++;
                }

                /* Generate a ticket for the booking after adding the passengers
                   to facilitate ticket price calculation */

                // Generate the ticket number
                $ticketNumber = $this->generateTicketNumber();

                // Get the flight status id
                $flightStatusId = $this->getFlightStatus($booking->flight_id);
                if($flightStatusId == null)
                    return response()->json(['error' => 'An error occurred when setting the flight status'], 400);

                // Get the ticket price
                $ticketPrice = $this->calculateTicketPrice($booking->id);

                // Generate the boarding pass
                $boardingPass = $this->generateBoardingPass();

                $ticket = Ticket::create([
                    'ticket_number' => $ticketNumber,
                    'ticket_price' => $ticketPrice,
                    'booking_reference' => $booking->booking_reference,
                    'boarding_pass' => $boardingPass,
                    'flight_status_id' => $flightStatusId,
                    'flight_id' => $booking->flight_id,
                    ]);
                            
                // Return the created booking and ticket details
                return response()->json(['booking' => $booking, 'ticket' => $ticket, 'passengers' => $addedPassengers, 'status' => 1]);

        } 
        catch (\Exception $e) 
        {
            // Log the error
            Log::error($e->getMessage());
        
            // For debugging
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);

            // Return the error response
           // return response()->json(['error' => 'An error occurred. '], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $bookingReference)
    {
        try 
        {
            // Retrieve the booking
            $booking = Booking::where('booking_reference', $bookingReference)->first();

            if (!$booking) 
            {
                return response()->json(['error' => 'Booking not found.'], 404);
            }

            // Validate the request data
            $bookingData = $request->validate([
                'flight_id' => 'required|exists:flights,id',
                'email' => 'required|email',

                'passengers' => 'required|array',
                'passengers.*.passenger_id' => 'required|string',
                'passengers.*.name' => 'required|string',
                'passengers.*.passport_number' => 'string',
                'passengers.*.identification_number' => 'string',
                'passengers.*.date_of_birth' => 'required|date',
                'passengers.*.seat_id' => 'required|exists:seats,id',   
            ]);

            // Retrieve the selected flight and check if it's available
            $flight = Flight::find($bookingData['flight_id']);
            if (!$flight) 
            {
                return response()->json(['error' => 'The selected flight does not exist.'], 400);
            }

           
            foreach ($bookingData['passengers'] as $passengerData) 
            {
                // Make sure all the correct identification details are provided
                if(!$passengerData['passport_number'] && !$passengerData['identification_number'])
                {
                    return response()->json(['error' => 'Must provide passport number(international or domestic travels) or identification number(domestic travels) for ' . $passengerData['name'] . ' for international travels'], 400);
                }

                if($flight->is_international && !$passengerData['passport_number'])
                {
                    return response()->json(['error' => 'Must provide passport number for ' . $passengerData['name'] . ' for international travels'], 400);
                }
                
                // Check if the selected seat is available

                /** For testing only */
                $availableSeat = Seat::where('is_available', true)->first();
                if($availableSeat)
                {
                    $seat = Seat::where('id', $availableSeat->id)->first();

                    if (!$seat || !$seat->is_available) {
                        return response()->json(['error' => 'Selected seat for ' . $passengerData['name'] . ' is not available.'], 400);
                    }
    
                    $seats[] = $seat; //Append the seats
    
                    // Update the seat availability
                    $seat->update([
                        'is_available' => false,
                    ]); 
                }
                else
                {
                    return response()->json(['error' => 'There are no available seats'], 400);
                }

            } 

            // Update the booking
            $booking->update([
                // 'flight_id' => $bookingData['flight_id'],
                // 'email' => $bookingData['passenger_email'],

                /**For testing only */
                'flight_id' => Flight::pluck('id')->random(),
                'email' => fake()->safeEmail,
            ]);

            
             // Update the passenges
             $updatedPassengers = [];

             // For testing only
             $existingPassengerDetails = Passenger::where('booking_id', $booking->id)->get(); // We need to get use existing ids for testing
             $passengerIDs = [];
             foreach($existingPassengerDetails as $passengerDetails)
             {
                $passengerIDs[] = $passengerDetails['passenger_id'];
             }


             $counter = 0;
             foreach ($bookingData['passengers'] as $passengerData) 
             {
                 //$passenger = Passenger::find($passengerData['passenger_id']);
                 // For testing only
                 $passenger = Passenger::where('passenger_id' , $passengerIDs[$counter])->first();

                 if($passenger)
                 {
                    //Get the previous seat id
                    $previous_seat_id = $passenger->seat_id;

                    //If the seat id changed, change the availability of the previous and current seat                    
                    //$current_seat_id = $passengerData['seat_id'];
                  
                    $current_seat_id = $seats[$counter]->id;  // For testing only

                    if($previous_seat_id  != $current_seat_id)
                    {
                        // Update the availability of the previous seat
                        $previousSeat = Seat::where('id', $previous_seat_id)->first();
                        $seat->update([
                            'is_available' => true,
                        ]); 

                        // Update the availability of the current seat
                        DB::table('seats')->where('id', $current_seat_id)->update(['is_available' => false]);
                    }

                    $passengerData['seat_id'] = $current_seat_id; // For testing only
                    $passengerData['passenger_id'] = $passengerIDs[$counter]; // For testing only
                    $passengerData['name'] = fake()->name; // For testing only
                    $passengerData['date_of_birth'] = fake()->date; // For testing only

                    if($passengerData['passport_number'])
                        $passengerData['passport_number'] = fake()->numerify('##########'); // For testing only
                    if($passengerData['identification_number'])
                        $passengerData['identification_number'] = fake()->numerify('##########'); // For testing only

                    $passenger->fill($passengerData);                    
                    $booking->passengers()->save($passenger);
                    $updatedPassengers[] = $passenger;

                 }
              

                 $counter++;
             }

             /* Update a ticket for the booking after adding the passengers
                to facilitate ticket price calculation */

              // Get the ticket price
              $ticketPrice = $this->calculateTicketPrice($booking->id);

              // Get the flight status id
              $flightStatusId = $this->getFlightStatus($booking->flight_id);
              if($flightStatusId == null)
                  return response()->json(['error' => 'An error occurred when setting the flight status'], 400);

              // Update the associated ticket if necessary
              $ticket = Ticket::where('booking_reference', $bookingReference)->first();
              if ($ticket) 
              {
                  $ticket->update([
                      'flight_id' => $booking->flight_id,
                      'ticket_price' => $ticketPrice,
                      'flight_status_id' => $flightStatusId,
                  
                  ]);
              }
              else
              {
                  return response()->json(['error' => 'Ticket not found. '], 500);
              }

            // Return the updated booking details
            return response()->json(['booking' => $booking, 'ticket' => $ticket, 'passengers' => $updatedPassengers, 'status' => 1]);
        } 
        catch (\Exception $e) 
        {
            // Log the error
            Log::error($e->getMessage());

            // For debugging
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);

            // Return the error response
            //return response()->json(['error' => 'An error occurred. '], 500);
        }
    }


    /**
     * Delete the booking associated with the booking reference
     */
    public function destroy(string $bookingReference)
    {
        try 
        {
            // Retrieve the booking
            $booking = Booking::where('booking_reference', $bookingReference)->first();

            //Make sure it is a valid booking
            if (!$booking) 
            {
                return response()->json(['error' => 'Booking not found.'], 404);
            }

            // Get the associated ticket
            $ticket = Ticket::where('booking_reference', $bookingReference)->first();
            
            // Make sure it is a valid ticket
            if ($ticket)
            {
                // Delete it
                $ticket->delete();
            }
            else
            {
                return response()->json(['error' => 'Ticket not found. '], 500);
            }

            
            //Get the passengers associated with this booking
            $booking_passengers = Passenger::where('booking_id', $booking->id)->get();
            
            //Make their seats availability to true
            foreach($booking_passengers as $passenger)
            {
                DB::table('seats')->where('id', $passenger->seat_id)->update(['is_available' => true]);
            }

            // Delete the associated passengers
            $booking->passengers()->delete();
            
            // Delete the booking
            $booking->delete();

            // Return a success response
            return response()->json(['message' => 'Booking deleted successfully.', 'status' => 1]);

        } 
        catch (\Exception $e) 
        {
            // Log the error
            Log::error($e->getMessage());

            // For debugging
            //return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);

            // Return the error response
            return response()->json(['error' => 'An error occurred. '], 500);
        }
    }
}

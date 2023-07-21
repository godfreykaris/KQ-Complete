<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Booking;
use App\Models\Ticket;
use App\Models\FlightStatus;
use App\Models\Flight;
use App\Models\Seat;
use App\Models\FlightClass;
use App\Models\Passenger;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;


class BookingsController extends Controller
{
    public function generateBookingReference()
    {
        return fake()->unique()->regexify('[A-Z0-9]{6}');
    }

    public function generateTicketNumber()
    {
        // Generate a unique ticket number
        return fake()->unique()->regexify('[A-Z]{2}\d{6}');
    }

    public function generateBoardingPass()
    {
        return fake()->unique()->regexify('[A-Z0-9]{10}');
    }

    public function calculateTicketPrice()
    {
        return fake()->randomFloat(2, 100, 1000);
    }

    public function getFlightStatus()
    {
        return FlightStatus::where('name', 'On-time')->first()->id;
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
                    'class_id' => 'required|exists:flight_classes,id',                    
                    'email' => 'required|email',

                    'passengers' => 'required|array',
                    'passengers.*.name' => 'required|string',
                    'passengers.*.date_of_birth' => 'required|date',
                    'passengers.*.seat_id' => 'required|exists:seats,id',
                
                ]);
            
                // Retrieve the selected flight and check if it's available
                $flight = DB::table('flights')->where('id', $bookingData['flight_id'])->first();
                if (!$flight)
                {
                    return response()->json(['error' => 'Invalid flight selection.'], 400);
                }
                
                // Check if the selected seats is available
                $seats = []; // For storing the available seats
                foreach ($bookingData['passengers'] as $passengerData) 
                {
                    //$seat = DB::table('seats')->where('id', $passengerData['seat_id'])->first();

                    /** For testing only */
                    $seat = DB::table('seats')->where('id', Seat::where('is_available', true)->first()->id)->first();

                    if (!$seat || !$seat->is_available) {
                        return response()->json(['error' => 'Selected seat for ' . $passengerData['name'] . ' is not available.'], 400);
                    }

                    $seats[] = $seat; //Append the seats

                    // Update the seat availability
                    DB::table('seats')->where('id', $seat->id)->update(['is_available' => false]);

                }                
            
                // Create a new booking
                $booking = Booking::create([
                    // 'flight_id' => $bookingData['flight_id'],
                    // 'flight_class_id' => $bookingData['class_id'],
                    // 'email' => $bookingData['passenger_email'],
                    'booking_reference' => $this->generateBookingReference(),
                    'booking_date' => fake()->dateTime(),

                    /**For testing only */
                    'flight_id' => Flight::pluck('id')->random(),
                    'flight_class_id' => FlightStatus::pluck('id')->random(),          
                    'email' => fake()->safeEmail,
                    
                ]);
            
                // Generate a ticket for the booking
                $ticket = Ticket::create([
                    'ticket_number' => $this->generateTicketNumber(),
                    'ticket_price' => $this->calculateTicketPrice(),
                    'booking_reference' => $booking->booking_reference,
                    'boarding_pass' => $this->generateBoardingPass(),
                    'flight_status_id' => $this->getFlightStatus(),
                    'flight_id' => $booking->flight_id,
                    ]);

                
                // Create and save the new passengers
                $addedPassengers = [];
                $counter = 0;
                foreach ($bookingData['passengers'] as $passengerData) {

                    $passengerData['seat_id'] = $seats[$counter]->id; // For testing only
                    
                    $passenger = new Passenger($passengerData);
                    
                    $booking->passengers()->save($passenger);
                    $addedPassengers[] = $passenger->toArray(); // Convert passenger object to an array and store it

                    // Update the seat availability
                    DB::table('seats')->where('id', $passenger->seat_id)->update(['is_available' => false]);

                    $counter++;
                }
                            
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
        try {
            // Retrieve the booking
            $booking = Booking::where('booking_reference', $bookingReference)->first();

            if (!$booking) {
                return response()->json(['error' => 'Booking not found.'], 404);
            }

            // Validate the request data
            $bookingData = $request->validate([
                'flight_id' => 'required|exists:flights,id',
                'class_id' => 'required|exists:flight_classes,id',                    
                'email' => 'required|email',

                'passengers' => 'required|array',
                'passengers.*.name' => 'required|string',
                'passengers.*.date_of_birth' => 'required|date',
                'passengers.*.seat_id' => 'required|exists:seats,id',
            ]);

            // Retrieve the selected flight and check if it's available
            $flight = Flight::find($bookingData['flight_id']);
            if (!$flight) {
                return response()->json(['error' => 'Invalid flight selection.'], 400);
            }

            // Check if the selected seat is available
            //$seat = DB::table('seats')->where('id', $bookingData['seat_id'])->first();

            foreach ($bookingData['passengers'] as $passengerData) 
            {
                /** For testing only */
                $seat = DB::table('seats')->where('id', Seat::where('is_available', true)->first()->id)->first();

                if (!$seat || !$seat->is_available) {
                    return response()->json(['error' => 'Selected seat is not available.'], 400);
                }

            } 

            // Update the booking
            $booking->update([
                // 'flight_id' => $bookingData['flight_id'],
                // 'flight_class_id' => $bookingData['class_id'],
                // 'seat_id' => $bookingData['seat_id'],
                // 'passenger_name' => $bookingData['passenger_name'],
                // 'passenger_email' => $bookingData['passenger_email'],
                // 'date_of_birth' => $bookingData['date_of_birth'],

                /**For testing only */
                'flight_id' => Flight::pluck('id')->random(),
                'flight_class_id' => FlightStatus::pluck('id')->random(),         
                'email' => fake()->safeEmail,
            ]);

            // Update the associated ticket if necessary
            $ticket = Ticket::where('booking_reference', $bookingReference)->first();
            if ($ticket) {
                $ticket->update([
                    'flight_id' => $booking->flight_id,

                ]);
            }
            else
            {
                return response()->json(['error' => 'Ticket not found. '], 500);
            }

            // Optionally, you can perform additional actions or validations here

            // Return the updated booking details
            return response()->json(['booking' => $booking, 'ticket' => $ticket, 'status' => 1]);
        } catch (\Exception $e) {
            // Log the error
            Log::error($e->getMessage());

            // For debugging
            //return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);

            // Return the error response
            return response()->json(['error' => 'An error occurred. '], 500);
        }
    }


    /**
     * Delete the booking associated with the booking reference
     */
    public function destroy(string $bookingReference)
    {
        try {
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
            return response()->json(['message' => 'Booking deleted successfully.']);

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

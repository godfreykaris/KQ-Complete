<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Booking;
use App\Models\Ticket;
use App\Models\FlightStatus;
use App\Models\Flight;
use App\Models\Seat;
use App\Models\FlightClass;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;


class BookingsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function generateTicketNumber()
    {
        // Generate a unique ticket number
        return Str::random(10);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        

        try 
        {
                        // Validate the request data
                $validatedData = $request->validate([
                    'flight_id' => 'required|exists:flights,id',
                    'class_id' => 'required|exists:flight_classes,id',
                    'seat_id' => 'required|exists:seats,id',
                
                    'passenger_name' => 'required|string',
                    'passenger_email' => 'required|email',
                    'date_of_birth' => 'required|date',
                
                ]);
            
                // Retrieve the selected flight and check if it's available
                $flight = DB::table('flights')->where('id', $validatedData['flight_id'])->first();
                if (!$flight) {
                    return response()->json(['error' => 'Invalid flight selection.'], 400);
                }
                
                // Check if the selected seat is available
                //$seat = DB::table('seats')->where('id', $validatedData['seat_id'])->first();

                /** For testing only */
                $seat = DB::table('seats')->where('id', Seat::where('is_available', true)->first()->id)->first();

                if (!$seat || !$seat->is_available) {
                    return response()->json(['error' => 'Selected seat is not available.'], 400);
                }
            
                // Create a new booking
                $booking = Booking::create([
                    // 'flight_id' => $validatedData['flight_id'],
                    // 'flight_class_id' => $validatedData['class_id'],
                    // 'seat_id' => $validatedData['seat_id'],   
                    //'date_of_birth' => $validatedData['date_of_birth'],       
                    // 'passenger_name' => $validatedData['passenger_name'],
                    // 'passenger_email' => $validatedData['passenger_email'],

                    /**For testing only */
                    'flight_id' => Flight::pluck('id')->random(),
                    'flight_class_id' => FlightStatus::pluck('id')->random(),
                    'seat_id' => $seat->id,          
                    'passenger_name' => fake()->name,
                    'passenger_email' => fake()->safeEmail,
                    'date_of_birth' => fake()->date,
                    'booking_reference' => fake()->unique()->regexify('[A-Z0-9]{6}'),
                    'booking_date' => fake()->dateTime(),
                ]);
            
                // Generate a ticket for the booking

                $ticket = Ticket::create([
                    'ticket_number' => fake()->unique()->regexify('[A-Z]{2}\d{6}'),
                    'passenger_name' => $booking->passenger_name,
                    'passenger_email' => $booking->passenger_email,
                    ///Date of birth
                    'ticket_price' => fake()->randomFloat(2, 100, 1000),
                    'booking_reference' => $booking->booking_reference,
                    'boarding_pass' => fake()->unique()->regexify('[A-Z0-9]{10}'),
                    'flight_status_id' => FlightStatus::where('name', 'On-time')->first()->id, // Replace 'On-time' with the appropriate flight status name
                    'flight_id' => $booking->flight_id,
                    'seat_id' => $booking->seat_id,
                ]);
            
                // Update the seat availability
                DB::table('seats')->where('id', $validatedData['seat_id'])->update(['is_available' => false]);
            
                // Optionally, you can perform additional actions or validations here
            
                // Return the created booking and ticket details
                return response()->json(['booking' => $booking, 'ticket' => $ticket, 'status' => 1]);
        } 
        catch (\Exception $e) {
            // Log the error
            Log::error($e->getMessage());
        
            // Return the error response
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
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
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
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
            $validatedData = $request->validate([
                'flight_id' => 'required|exists:flights,id',
                'class_id' => 'required|exists:flight_classes,id',
                'seat_id' => 'required|exists:seats,id',
                'passenger_name' => 'required|string',
                'passenger_email' => 'required|email',
            ]);

            // Retrieve the selected flight and check if it's available
            $flight = Flight::find($validatedData['flight_id']);
            if (!$flight) {
                return response()->json(['error' => 'Invalid flight selection.'], 400);
            }

            // Check if the selected seat is available
            //$seat = DB::table('seats')->where('id', $validatedData['seat_id'])->first();

            /** For testing only */
            $seat = DB::table('seats')->where('id', Seat::where('is_available', true)->first()->id)->first();

            if (!$seat || !$seat->is_available) {
                return response()->json(['error' => 'Selected seat is not available.'], 400);
            }

            // Update the booking
            $booking->update([
                // 'flight_id' => $validatedData['flight_id'],
                // 'flight_class_id' => $validatedData['class_id'],
                // 'seat_id' => $validatedData['seat_id'],
                // 'passenger_name' => $validatedData['passenger_name'],
                // 'passenger_email' => $validatedData['passenger_email'],

                /**For testing only */
                'flight_id' => Flight::pluck('id')->random(),
                'flight_class_id' => FlightStatus::pluck('id')->random(),
                'seat_id' => $seat->id,          
                'passenger_name' => fake()->name,
                'passenger_email' => fake()->safeEmail,
            ]);

            // Update the associated ticket if necessary
            $ticket = Ticket::where('booking_reference', $bookingReference)->first();
            if ($ticket) {
                $ticket->update([
                    'passenger_name' => $booking->passenger_name,
                    'passenger_email' => $booking->passenger_email,
                    'flight_id' => $booking->flight_id,
                    'seat_id' => $booking->seat_id,

                ]);
            }
            else
            {
                return response()->json(['error' => 'Ticket not found. '], 500);
            }


            // Update the seat availability
            if ($seat->id !== $booking->seat_id) {
                $seat->update(['is_available' => false]);
                Seat::where('id', $booking->seat_id)->update(['is_available' => true]);
            }

            // Optionally, you can perform additional actions or validations here

            // Return the updated booking details
            return response()->json(['booking' => $booking, 'ticket' => $ticket, 'status' => 1]);
        } catch (\Exception $e) {
            // Log the error
            Log::error($e->getMessage());

            // Return the error response
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $bookingReference)
    {
        try {
            // Retrieve the booking
            $booking = Booking::where('booking_reference', $bookingReference)->first();

            if (!$booking) {
                return response()->json(['error' => 'Booking not found.'], 404);
            }

            // Delete the booking
            $booking->delete();

            // Update the associated ticket if necessary
            $ticket = Ticket::where('booking_reference', $bookingReference)->first();
            
            if ($ticket)
            {
                $seat_id = $ticket->seat_id;

                $ticket->delete();
            }
            else
            {
                return response()->json(['error' => 'Ticket not found. '], 500);
            }


            // Check if the selected seat is available
            //$seat = DB::table('seats')->where('id', $validatedData['seat_id'])->first();

            
            // Update the seat availability
            if ($seat_id) 
            {               
                Seat::where('id', $seat_id)->update(['is_available' => true]);
            }
            else
            {
                return response()->json(['error' => 'Seat not found. '], 500);
            }

            // Return a success response
            return response()->json(['message' => 'Booking deleted successfully.']);
        } catch (\Exception $e) {
            // Log the error
            Log::error($e->getMessage());

            // Return the error response
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
        }
    }
}

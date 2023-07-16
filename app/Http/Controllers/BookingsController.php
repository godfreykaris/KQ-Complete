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
                    // 'passenger_name' => $validatedData['passenger_name'],
                    // 'passenger_email' => $validatedData['passenger_email'],

                    /**For testing only */
                    'flight_id' => Flight::pluck('id')->random(),
                    'flight_class_id' => FlightStatus::pluck('id')->random(),
                    'seat_id' => $seat->id,          
                    'passenger_name' => fake()->name,
                    'passenger_email' => fake()->safeEmail,

                    'booking_reference' => fake()->unique()->regexify('[A-Z0-9]{6}'),
                    'booking_date' => fake()->dateTime(),
                ]);
            
                // Generate a ticket for the booking

                $ticket = Ticket::create([
                    'ticket_number' => fake()->unique()->regexify('[A-Z]{2}\d{6}'),
                    'passenger_name' => $booking->passenger_name,
                    'passenger_email' => $booking->passenger_email,
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

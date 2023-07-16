<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Booking;
use App\Models\Ticket;

use Illuminate\Support\Facades\DB;
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
        // Validate the request data
        $validatedData = $request->validate([
            'flight_id' => 'required|exists:flights,id',
            'class_id' => 'required|exists:flight_classes,id',
            'seat_id' => 'required|exists:seats,id',
            'passenger_name' => 'required|string',
            'passenger_email' => 'required|email',
            // Add validation rules for other booking details
        ]);

        // Retrieve the selected flight and check if it's available
        $flight = DB::table('flights')->where('id', $validatedData['flight_id'])->first();
        if (!$flight) {
            return response()->json(['error' => 'Invalid flight selection.'], 400);
        }

        // Check if the selected seat is available
        $seat = DB::table('seats')->where('id', $validatedData['seat_id'])->first();
        if (!$seat || !$seat->is_available) {
            return response()->json(['error' => 'Selected seat is not available.'], 400);
        }

        // Create a new booking
        $booking = Booking::create([
            'flight_id' => $validatedData['flight_id'],
            'class_id' => $validatedData['class_id'],
            'seat_id' => $validatedData['seat_id'],
            'passenger_name' => $validatedData['passenger_name'],
            'passenger_email' => $validatedData['passenger_email'],
            // Set other booking details
        ]);

        // Generate a ticket for the booking
        $ticket = Ticket::create([
            'booking_id' => $booking->id,
            'ticket_number' => $this->generateTicketNumber(), // Generate a unique ticket number
            // Set other ticket details
        ]);

        // Update the seat availability
        DB::table('seats')->where('id', $validatedData['seat_id'])->update(['is_available' => false]);

        // Optionally, you can perform additional actions or validations here

        // Return the created booking and ticket details
        return response()->json(['booking' => $booking, 'ticket' => $ticket]);
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

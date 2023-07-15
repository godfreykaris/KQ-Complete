<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TicketsController extends Controller
{
    public function show($ticket_number)
    {
        try 
        {
            $ticket = DB::select('SELECT t.ticket_number, t.passenger_name, t.passenger_email, t.ticket_price, t.booking_reference,
                                     t.boarding_pass, fst.name AS flight_status_name, f.flight_number AS flight_number, s.seat_number AS seat_number
                                    FROM tickets t
                                    JOIN flight_statuses fst ON t.flight_status_id = fst.id
                                    JOIN flights f ON t.flight_id = f.id
                                    JOIN seats s ON t.seat_id = s.id
                                    WHERE t.ticket_number = ?', [$ticket_number]);
        
            return response()->json($ticket[0]);
        } 
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.'], 500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Flight;
use App\Models\FlightStatus;
use App\Models\Passenger;
use App\Models\Ticket;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;


class TicketsController extends Controller
{
    public function show($ticket_number)
    {
        try 
        {
            $ticket = DB::select('SELECT t.ticket_number, t.booking_reference, t.boarding_pass, fst.name AS flight_status, f.flight_number AS flight_number
                                    FROM tickets t
                                    JOIN flight_statuses fst ON t.flight_status_id = fst.id
                                    JOIN flights f ON t.flight_id = f.id
                                    WHERE t.ticket_number = ?', [Ticket::pluck('ticket_number')->random()]); // For testing only
                                    //WHERE t.ticket_number = ?', [$ticket_number]);
        
            return response()->json($ticket[0]);
        } 
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            //return response()->json(['error' => 'An error occurred. '.$e->getMessage()], 500);

            return response()->json(['error' => 'An error occurred.'], 500);
        }
       
    }

    public function generateTicketReport($ticket_number)
    {
        try
        {
             // Retrieve ticket data based on the ticket ID
            $ticket = Ticket::where('ticket_number', $ticket_number)->first();

            // Make sure the ticket is valid
            if(!$ticket)
            {
                return response()->json(['error' => 'The ticket ' . $ticket_number . ' cannot be found'], 500);
            }

            //Get the booking associated with the ticket number
            $booking = Booking::where('booking_reference', $ticket->booking_reference)->first();

            if(!$booking)
            {
                return response()->json(['error' => 'The ticket is connected to an invalid booking reference.'], 500);
            }

            //Get the passengers under the found booking
            $passengers = Passenger::where('booking_id',$booking->id)->get();

            //Make sure we have valid passengers
            if(!$passengers)
            {
                return response()->json(['error' => 'No passengers'], 500);
            }

            
            // Ticket data to be passed to the PDF template
            $ticketData = [
                'ticket' => $ticket,
                'ticketNumber' => $ticket->ticket_number,
                'bookingReference' => $ticket->booking_reference,
                'bookingEmail' => $booking->email,
                'boardingPass' => $ticket->boarding_pass,
                'flightStatus' => FlightStatus::find($ticket->flight_status_id)->name,
                'flight' => Flight::find($ticket->flight_id)->flight_number,
                "passengers" => $passengers,
            ];

            // Load the blade temlate view that is used to organize and stylethe ticket data
            $pdf = FacadePdf::loadView('ticket.pdf_template', $ticketData);

            return $pdf->stream('ticket.pdf'); // Stream the PDF to the browser

        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            return response()->json(['error' => 'An error occurred. '.$e->getMessage()], 500);

            //return response()->json(['error' => 'An error occurred.'], 500);
        }
       
    }

}

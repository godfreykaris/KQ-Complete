<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Destination;
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
            // Retrieve the ticket from the database
            $ticket = Ticket::where('ticket_number', $ticket_number)->first();

            // Make sure it exists
            if(!$ticket)
            {
                return response()->json(['error' => 'This ticket number does not exist. Ticket Number: ' . $ticket_number], 500);
            }
                   
            return response()->json(['ticket' => $ticket, 'status' => 1]);

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
             // Retrieve ticket data based on the ticket number
            $ticket = Ticket::where('ticket_number', $ticket_number)->first();

            // Make sure the ticket is valid
            if(!$ticket)
            {
                return response()->json(['error' => 'The ticket ' . $ticket_number . ' cannot be found'], 500);
            }

            // Get the booking associated with the ticket number
            $booking = Booking::where('booking_reference', $ticket->booking_reference)->first();

            // Make sure the booking exists
            if(!$booking)
            {
                return response()->json(['error' => 'The ticket is connected to an invalid booking reference.'], 500);
            }

            // Get the passengers under the found booking
            $passengers = Passenger::with('seat')->where('booking_id', $booking->id)->get();

            // Make sure we have valid passengers
            if(!$passengers)
            {
                return response()->json(['error' => 'No passengers available for the ticket.'], 500);
            }
                    
            // Ticket data to be passed to the PDF template
            $ticketData = [
                'ticketNumber' => $ticket->ticket_number,
                'ticketPrice' =>$ticket->ticket_price,
                'bookingReference' => $ticket->booking_reference,
                'bookingEmail' => $booking->email,
                'boardingPass' => $ticket->boarding_pass,
                'flightStatus' => FlightStatus::find($ticket->flight_status_id)->name,
                'flight' => Flight::find($ticket->flight_id)->flight_number,
                'destination' => Destination::find(Flight::find($ticket->flight_id)->arrival_destination_id)->name,
                'flightType' => Flight::find($ticket->flight_id)->is_international == 1 ? 'International' : 'Domestic',
                "passengers" => $passengers,
            ];

            // Load the blade template view that is used to organize and stylethe ticket data
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

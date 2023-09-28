<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Booking;
use App\Models\Ticket;
use App\Models\Flight;
use App\Models\Seat;
use App\Models\Passenger;
use App\Models\FlightStatus;
use App\Models\City;
use Barryvdh\Debugbar\Facades\Debugbar;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\Message;

use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;

use App\Http\Controllers\PayPalController;
use App\Models\Airline;

class BookingsController extends Controller
{
    private $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    public function generateBookingReference()
    {
        $bookingReference = 'KQ-BR-' . strtoupper(Str::random(6, $this->characters));

        // Check if the generated booking reference already exists in the database
        while (Booking::where('booking_reference', $bookingReference)->exists()) 
        {
            $bookingReference = 'KQ-BR-' . strtoupper(Str::random(6, $this->characters));
        }
    
           
        return $bookingReference;
    }

    public function generateTicketNumber()
    {
        $ticketNumber = 'KQ-TK-' . strtoupper(Str::random(6, $this->characters));


        // Check if the generated ticket number already exists in the database
        while (Ticket::where('ticket_number', $ticketNumber)->exists()) 
        {
            $ticketNumber = 'KQ-TK-' . strtoupper(Str::random(6, $this->characters));

        }

        
        return $ticketNumber;
    }

    
    public function generateBoardingPass()
    {
        $boardingPass = 'KQ-BP-' . strtoupper(Str::random(6, $this->characters));


        // Check if the generated boarding pass already exists in the database
        while (Ticket::where('boarding_pass', $boardingPass)->exists()) 
        {
            $boardingPass = 'KQ-BP-' . strtoupper(Str::random(6, $this->characters));
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

    function updatePassengersAndBooking($booking, $bookingData)
    {
         // Fetch the existing passengers for the booking
         $existingPassengers = $booking->passengers;   

         // Update the passenges
         $updatedPassengers = [];

         $counter = 0;
         foreach ($bookingData['passengers'] as $passengerData) 
         {
            if($passengerData['passenger_id'] != 'empty')
            {   
                $passenger = Passenger::find($passengerData['passenger_id']);
           

                 if($passenger)
                 {
                    //Get the previous seat id
                    $previous_seat_id = $passenger->seat_id;

                    //If the seat id changed, change the availability of the previous and current seat                    
                    $current_seat_id = $passengerData['seat_id'];                    

                    if($previous_seat_id  != $current_seat_id)
                    {
                        // Update the availability of the previous seat
                        $previousSeat = Seat::where('id', $previous_seat_id)->first();
                        $previousSeat->update([
                            'is_available' => true,
                        ]); 

                        // Update the availability of the current seat
                        $currentSeat = Seat::where('id', $current_seat_id)->first();
                        $currentSeat->update([
                            'is_available' => false,
                        ]); 
                    }
        
                    $passenger->fill($passengerData);                    
                    $booking->passengers()->save($passenger);
                    $updatedPassengers[] = $passenger->id;

                 }
            }
            else
            {
                // Update the availability of the current seat
                $current_seat_id = $passengerData['seat_id'];                    
                $currentSeat = Seat::where('id', $current_seat_id)->first();
                $currentSeat->update([
                    'is_available' => false,
                ]); 

                $passenger = new Passenger($passengerData);                
                $passenger->passenger_id = $passenger->generatePassengerId();

                $booking->passengers()->save($passenger);
                $updatedPassengers[] = $passenger->id;
            }
                           

             $counter++;
         }

         // Delete passengers that were not included in passengerData
         foreach ($existingPassengers as $passenger) {
             if (!in_array($passenger->id, $updatedPassengers)) {
                 $passenger->delete();
             }
         }

          // Update the booking
          $booking->update([
              'flight_id' => $bookingData['flight_id'],
              'email' => $bookingData['email'],
              'trip_type' => $bookingData['trip_type'],
          ]);

         /* Update a ticket for the booking after adding the passengers
            to facilitate ticket price calculation */

          // Get the ticket price
          $ticketPrice = $this->calculateTicketPrice($booking->id);

          // Get the flight status id
          $flightStatusId = $this->getFlightStatus($booking->flight_id);
          if($flightStatusId == null)
              return response()->json(['error' => 'An error occurred when setting the flight status',  'status' => 0]);

          // Update the associated ticket if necessary
          $ticket = Ticket::where('booking_reference', $booking->booking_reference)->first();
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
              return response()->json(['error' => 'Ticket not found. ',  'status' => 0]);
          }

        // Return the updated booking details
        return response()->json(['success' => 'Booking updated successfully', 'status' => 1]);
    }

    /**
     * Get the booking associated with the booking reference and ticket number
     */
    public function getBooking(string $bookingReference, string $ticketNumber)
    {
        try 
        {
            // Retrieve the booking
            $booking = Booking::where('booking_reference', $bookingReference)
                        ->with([
                            'flight',
                            'passengers' => function ($query) {
                                $query->select('id', 'booking_id', 'name', 'seat_id', 'identification_number', 'passport_number', 'date_of_birth')
                                    ->with([
                                        'seat:id,seat_number,price,is_available,flight_id,flight_class_id,location_id',
                                        'seat.location:id,name',
                                        'seat.plane:id,name',
                                        'seat.flight:id,flight_number',
                                        'seat.flightClass:id,name',
                                    ]);
                            },
                        ])
                        ->first();

            //Make sure it is a valid booking
            if (!$booking) 
            {
                return response()->json(['error' => 'Booking not found.', 'status' => 0]);
            }

            // Get the associated ticket
            $ticket = Ticket::where('booking_reference', $bookingReference)
                              ->where('ticket_number', $ticketNumber)
                              ->first();
            
            // Make sure it is a valid ticket
            if (!$ticket)
            {               
                return response()->json(['error' => 'No ticket matches the booking reference and ticket number.', 'status' => 0]);
            }

            // Fetch the "from" city object with only id and name fields
            $fromCity = City::select('id', 'name')->find($booking->flight->departure_city_id);                    
            // Fetch the "to" city object with only id and name fields
            $toCity = City::select('id', 'name')->find($booking->flight->arrival_city_id);

            $airline = Airline::select('id', 'name')->find($booking->flight->airline_id);

        // Return a success response with the booking, flight, and city objects
        return response()->json([
                'success' => 'Booking found.',
                'status' => 1,
                'booking' => [
                    'id' => $booking->id,
                    'user_id' => $booking->user_id,
                    'flight_id' => $booking->flight_id,
                    'email' => $booking->email,
                    'booking_reference' => $booking->booking_reference,
                    'trip_type' => $booking->trip_type,
                    'booking_date' => $booking->booking_date,
                    'created_at' => $booking->created_at,
                    'updated_at' => $booking->updated_at,
                    'flight' => [
                        'id' => $booking->flight->id,
                        'flight_number' => $booking->flight->flight_number,
                        'departure_time' => $booking->flight->departure_time,
                        'arrival_time' => $booking->flight->arrival_time,
                        'return_time' => $booking->flight->return_time,
                        'duration' => $booking->flight->duration,
                        'is_international' => $booking->flight->is_international,
                        'flight_status_id' => $booking->flight->flight_status_id,
                        'departure_city' => $fromCity, // Include the "from" city object
                        'arrival_city' => $toCity, // Include the "to" city object
                        'airline' => $airline,
                        'created_at' => $booking->flight->created_at,
                        'updated_at' => $booking->flight->updated_at,
                    ],
                    'passengers' => $booking->passengers,
                ],
            ]);

        } 
        catch (\Exception $e) 
        {
            // Log the error
            Log::error($e->getMessage());

            // For debugging
            //return response()->json(['error' => 'An error occurred. ' . $e->getMessage(),  'status' => 0]);

            // Return the error response
            return response()->json(['error' => 'An error occurred. ', 'status' => 0]);
        }
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
                    'trip_type' => 'required|string',

                    'passengers' => 'required|array',
                    'passengers.*.name' => 'required|string',
                    'passengers.*.passport_number' => 'string',
                    'passengers.*.identification_number' => 'string',
                    'passengers.*.date_of_birth' => 'required|date',
                    'passengers.*.seat_id' => 'required|exists:seats,id',                
                ]);
                
                if($bookingData['trip_type'] != 'One way' && $bookingData['trip_type'] != 'Round trip')
                {
                    return response()->json(['error' => 'Invalid trip type.',  'status' => 0]);
                }

                // Retrieve the selected flight and check if it's available
                $flight = Flight::where('id', $bookingData['flight_id'])->first();
                if (!$flight)
                {
                    return response()->json(['error' => 'Invalid flight selection.',  'status' => 0]);
                }
                
                $seats = [];

                // Check if the selected seats are available
                foreach ($bookingData['passengers'] as $passengerData) 
                {
                    // Make sure all the correct identification details are provided
                    if(!isset($passengerData['passport_number']) && !$passengerData['identification_number'])
                    {
                        return response()->json(['error' => 'You must provide the passport number(international or domestic travels) or identification number(domestic travels) for ' . $passengerData['name'] . ' .',  'status' => 0]);
                    }
                
                    if($flight->is_international && !isset($passengerData['passport_number']))
                    {
                        return response()->json(['error' => 'You must provide the passport number for ' . $passengerData['name'] . ' for international travels',  'status' => 0]);
                    }

                    $seat =Seat::where('id', $passengerData['seat_id'])->first();

                    if($seat) 
                    {
                
                        if (!$seat || !$seat->is_available) {
                            return response()->json(['error' => 'Selected seat for ' . $passengerData['name'] . ' is not available.',  'status' => 0]);
                        }
       
                        $seats[] = $seat;

                        // Update the seat's availability
                        $seat->update([
                            'is_available' => false,
                        ]); 
                    }
                    else
                    {
                        return response()->json(['error' => 'There are no available seats',  'status' => 0]);
                    }


                }                
            

                // Store the booking data in the session
                $request->session()->put('bookingData', $bookingData);

                $request->session()->put('seats', $seats);


                /* ------------- Payment Integration ---------- */
                //Get the total ticket price
                $ticketPrice = 0;
                foreach($seats as $seat)
                {
                    $ticketPrice += $seat->price;
                }

                if($bookingData['trip_type'] == 'Round trip')
                    $ticketPrice *= 2;

                // Store the ticket price in the session
                $request->session()->put('ticketPrice', $ticketPrice);

                $request->session()->put('updating', false);
                $request->session()->put('booking_process', true);

                
                // Redirect to a specific route after booking creation
                return response()->json(['redirect' => route('stripe.payment'), 'success' => 'Redirecting to Stripe. Please wait...', 'status' => 1]);   
                                

        } 
        catch (\Exception $e) 
        {
            // Log the error
            Log::error($e->getMessage());
        
            // For debugging
            //return response()->json(['error' => 'An error occurred. ' . $e->getMessage(), 'status' => 0]);

            // Return the error response
            return response()->json(['error' => 'An error occurred. ',  'status' => 0]);
        }
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
                return response()->json(['error' => 'Booking not found.', 'status' => 0]);
            }

            // Validate the request data
            $bookingData = $request->validate([
                'flight_id' => 'required|exists:flights,id',
                'email' => 'required|email',
                'trip_type' => 'required|string',

                'passengers' => 'required|array',
                'passengers.*.passenger_id' => 'required|string',
                'passengers.*.name' => 'required|string',
                'passengers.*.passport_number' => 'string',
                'passengers.*.identification_number' => 'string',
                'passengers.*.date_of_birth' => 'required|date',
                'passengers.*.seat_id' => 'required|exists:seats,id',   
            ]);

            if($bookingData['trip_type'] != 'One way' && $bookingData['trip_type'] != 'Round trip')
            {
                return response()->json(['error' => 'Invalid trip type.',  'status' => 0]);
            }

            // Retrieve the selected flight and check if it's available
            $flight = Flight::find($bookingData['flight_id']);
            if (!$flight) 
            {
                return response()->json(['error' => 'The selected flight does not exist.',  'status' => 0]);
            }

           
            foreach ($bookingData['passengers'] as $passengerData) 
            {
                // Make sure all the correct identification details are provided
                if(!$passengerData['passport_number'] && !$passengerData['identification_number'])
                {
                    return response()->json(['error' => 'Must provide passport number(international or domestic travels) or identification number(domestic travels) for ' . $passengerData['name'] . ' for international travels',  'status' => 0]);
                }

                if($flight->is_international && !$passengerData['passport_number'])
                {
                    return response()->json(['error' => 'Must provide passport number for ' . $passengerData['name'] . ' for international travels',  'status' => 0]);
                }
                
                // Check if the selected seat is available
                $seat =Seat::where('id', $passengerData['seat_id'])->first();

                if($seat) 
                {
            
                    if (!$seat) {
                        return response()->json(['error' => 'Selected seat for ' . $passengerData['name'] . ' is not available.',  'status' => 0]);
                    }
   
                    $seats[] = $seat;

                }
                else
                {
                    return response()->json(['error' => 'There are no available seats',  'status' => 0]);
                }

            } 

            $previousTicketPrice =  $this->calculateTicketPrice($booking->id);

             /* ------------- Payment Integration ---------- */
             //Get the total ticket price
             $currentTicketPrice = 0;
             foreach($seats as $seat)
             {
                 $currentTicketPrice  += $seat->price;
             }

             if($bookingData['trip_type'] == 'Round trip')
                $currentTicketPrice *= 2;

             if($currentTicketPrice > $previousTicketPrice)
             {
                 // Store the booking data in the session
                 $request->session()->put('bookingData', $bookingData);

                 $request->session()->put('bookingReference', $bookingReference);

                 $request->session()->put('seats', $seats);

                // Store the ticket price in the session
                $request->session()->put('ticketPrice', $currentTicketPrice - $previousTicketPrice);

                $request->session()->put('updating', true);
                $request->session()->put('booking_process', true);

                
                // Redirect to a specific route after booking creation
                return response()->json(['redirect' => route('stripe.payment'), 'success' => 'Redirecting to Stripe. Please wait...', 'status' => 1]); 

             }
            
             return $this->updatePassengersAndBooking($booking, $bookingData);
           
        } 
        catch (\Exception $e) 
        {
            // Log the error
            Log::error($e->getMessage());

            // For debugging
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage(),  'status' => 0]);

            // Return the error response
            //return response()->json(['error' => 'An error occurred. ',  'status' => 0]);
        }
    }


    /**
     * Delete the booking associated with the booking reference
     */
    public function destroy(string $bookingReference, string $ticketNumber)
    {
        try 
        {
            // Retrieve the booking
            $booking = Booking::where('booking_reference', $bookingReference)->first();

            //Make sure it is a valid booking
            if (!$booking) 
            {
                return response()->json(['error' => 'Booking not found.', 'status' => 0]);
            }

            // Get the associated ticket
            $ticket = Ticket::where('booking_reference', $bookingReference)
                            ->where('ticket_number' , $ticketNumber)->first();
            
            // Make sure it is a valid ticket
            if ($ticket)
            {
                // Delete it
                $ticket->delete();
            }
            else
            {
                return response()->json(['error' => 'Ticket not found. ', 'status' => 0]);
            }

            
            //Get the passengers associated with this booking
            $booking_passengers = Passenger::where('booking_id', $booking->id)->get();
            
            //Make their seats availability to true
            foreach($booking_passengers as $passenger)
            {
                $seat = Seat::where('id', $passenger->seat_id)->first();
                $seat->update([
                    'is_available' => true,
                ]); 
            }

            // Delete the associated passengers
            $booking->passengers()->delete();
            
            // Delete the booking
            $booking->delete();

            // Return a success response
            return response()->json(['success' => 'Booking deleted successfully.', 'status' => 1]);

        } 
        catch (\Exception $e) 
        {
            // Log the error
            Log::error($e->getMessage());

            // For debugging
            //return response()->json(['error' => 'An error occurred. ' . $e->getMessage(), 'status' => 0]);

            // Return the error response
            return response()->json(['error' => 'An error occurred. ', 'status' => 0]);
        }
    }
    public function updateBookingAfterPayment(Request $request)
    {
        try
        {
            // Retrieve the booking data from the session
            $bookingData = $request->session()->get('bookingData');

            $bookingReference = $request->session()->get('bookingReference');

            $seats = $request->session()->get('seats');

           // Ensure that $seats is an array and not empty before proceeding
           if (!is_array($seats) || !empty($seats)) 
           {             
              return view('booking.error')->with('error', 'No seats found.')->with('success', '');;
           }


            // Retrieve the booking
            $booking = Booking::where('booking_reference', $bookingReference)->first();

             //Make sure it is a valid booking
             if (!$booking) 
             {
                return view('booking.error')->with('error', 'Booking update failed.')->with('success', '');;
            }
            // Call the function to update passengers and booking
            $result = $this->updatePassengersAndBooking($booking, $bookingData);

            // Check if the update was successful (you should define your own success criteria)
            if ($result->getStatusCode() === 200) {
                // Return a view with a success message
                return view('booking.booking_status')->with('success', 'Booking updated successfully.')->with('error', '');;
            } else {
                // Handle the case where the update was not successful
                // You can return an error view or redirect to an error page
                return view('booking.error')->with('error', 'Booking update failed.')->with('success', '');;
            }


        }
        catch (\Exception $e) 
        {
            // Log the error
            Log::error($e->getMessage());
    
            // For debugging
            //return response()->json(['error' => 'An error occurred. ' . $e->getMessage(),  'status' => 0]);
    
            // Return the error response
            return view('booking.booking_status')->with('error' ,'An error occurred.')->with('success', '');;
        } 

    }


    public function createBookingAfterPayment(Request $request)
    {
           
        try
        {
            // Retrieve the booking data from the session
            $bookingData = $request->session()->get('bookingData');
       
            $seats = $request->session()->get('seats');

           // Ensure that $seats is an array and not empty before proceeding
           if (!is_array($seats) || !empty($seats)) 
           {             
              return view('booking.error')->with('error', 'No seats found.')->with('success', '');;
           }

            // Create a new booking
            $booking = Booking::create([
                'flight_id' => $bookingData['flight_id'],
                'email' => $bookingData['email'],
                'trip_type' => $bookingData['trip_type'],
                'booking_date' => Carbon::now(), // Use the current date and time as the booking date
                'booking_reference' => $this->generateBookingReference(),
                'user_id' => Auth::check() ? Auth::id() : null,
            ]);
                        
            // Create and save the new passengers
            $addedPassengers = [];
            $counter = 0;
            foreach ($bookingData['passengers'] as $passengerData) {
                                       
                $passenger = new Passenger($passengerData);
                
                $passenger->passenger_id = $passenger->generatePassengerId();

                $booking->passengers()->save($passenger);
                $addedPassengers[] = $passenger; // Convert passenger object to an array and store it

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
                return view('booking.booking_status')->with('error' ,'An error occurred when setting the flight status')->with('success', '');;
            
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
            
        
            // Ticket data to be passed to the PDF template
            $ticketData = [
                'ticketNumber' => $ticket->ticket_number,
                'ticketPrice' =>$ticket->ticket_price,
                'bookingReference' => $ticket->booking_reference,
                'bookingEmail' => $booking->email, 
                'boardingPass' => $ticket->boarding_pass,
                'flightStatus' => FlightStatus::find($ticket->flight_status_id)->name,
                'flight' => Flight::find($ticket->flight_id)->flight_number,
                'destination' => City::find(Flight::find($ticket->flight_id)->arrival_city_id)->name,
                'flightType' => Flight::find($ticket->flight_id)->is_international == 1 ? 'International' : 'Domestic',
                "passengers" => $addedPassengers,
            ];
        
            // // Load the blade template view that is used to organize and style the ticket data
            // $pdf = FacadePdf::loadView('ticket.pdf_template', $ticketData);
                        
            // // Send an email with the PDF attachment
            // Mail::send([], [], function (Message $message) use ($pdf, $ticketData) {
            //     $message->to($ticketData['bookingEmail'])
            //         ->subject('Your Ticket Information')
            //         ->html(
            //             "<html>
            //                 <head>
            //                     <style>
            //                         /* Center-align the content */
            //                         body {
            //                             text-align: center;
            //                         }
            //                         .container {
            //                             display: inline-block;
            //                             text-align: center;
            //                         }
            //                     </style>
            //                 </head>
            //                 <body>
            //                     <div class='container'>
            //                         <h2>Your Ticket Information</h2>
            //                         <p>Hello,</p>
            //                         <p>Thank you for booking your ticket with us. Attached is your ticket information.</p>
            //                         <p><strong>Ticket Number:</strong> {$ticketData['ticketNumber']}</p>
            //                         <p><strong>Ticket Price:</strong> {$ticketData['ticketPrice']} USD</p>
            //                         <p><strong>Booking Reference:</strong> {$ticketData['bookingReference']}</p>
            //                         <p><strong>Flight:</strong> {$ticketData['flight']}</p>
            //                         <p><strong>Destination:</strong> {$ticketData['destination']}</p>
            //                         <p><strong>Flight Type:</strong> {$ticketData['flightType']}</p>
            //                         <p>Thank you for choosing our services!</p>
                                    
            //                     </div>
            //                 </body>
            //             </html>"
            //         )
            //         ->attachData($pdf->output(), 'ticket.pdf', [
            //             'mime' => 'application/pdf',
            //         ]);
            // });


            return view('booking.booking_status')->with('success', 'Booking created successfully. Ticket data sent to your email.')->with('error', '');

        }
        catch (\Exception $e) 
        {
            // Log the error
            Log::error($e->getMessage());

            // For debugging
            //return response()->json(['error' => 'An error occurred. ' . $e->getMessage(),  'status' => 0]);

            // Return the error response
            return view('booking.booking_status')->with('error' ,'An error occurred.')->with('success', '');;
        }    
       
    }
}

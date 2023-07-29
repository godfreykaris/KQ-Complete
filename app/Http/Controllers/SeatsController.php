<?php

namespace App\Http\Controllers;

use App\Models\FlightClass;
use App\Models\Plane;
use App\Models\Seat;
use App\Models\SeatLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SeatsController extends Controller
{
    public function seatExists($seatData)
    {
        $existingSeat = Seat::where('seat_number', $seatData['seat_number'])
                        ->where('plane_id', $seatData['plane_id'])
                        ->first();

        if($existingSeat)
            return true;
        else
            return false;
    }

    // Get a seat
    public function show(Request $request, $seatNumber, $planeId)
    {

        try
        {
            // Make sure the seat is valid
            $seat = Seat::where('seat_number', $seatNumber)
                          ->where('plane_id', $planeId)
                          ->first();
            if(!$seat)
            {
                return response()->json(['error' => 'The seat does not exist', 'status' => 0 ]);
            }

            return response()->json(['seat' => $seat, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage(), 'status' => 0 ]);

             return response()->json(['error' => 'An error occurred.', 'status' => 0 ]);
        }
    }

    // Get all seats for a particular plane
    public function index(Request $request, $planeId)
    {
        try
        {
            $seats = Seat::where('plane_id', $planeId)->get();

            return response()->json(['seats' => $seats, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage(), 'status' => 0 ]);

             return response()->json(['error' => 'An error occurred.', 'status' => 0 ]);
        }
    }

    // Store a new seat into the database
    public function store(Request $request)
    { 
        DB::beginTransaction();
      
        try 
        {
            /// Validate the form data
            $seatsData = $request->validate([
                'plane_id' => 'required|integer',
                'flight_class_id' => 'required|integer',
                'seats.*.seat_number' => 'required|string|max:10',
                'seats.*.location_id' => 'required|integer',
                'seats.*.price' => 'required|numeric',
            ]);
        
            $planeId = $seatsData['plane_id'];

            // Make sure the plane exists
            $plane = Plane::where('id', $planeId)->first();
            if(!$plane)
            {
                return response()->json(['error' => 'The plane with id ' . $planeId . ' does not exist', 'status' => 0 ]);
            }

            $flightClassId = $seatsData['flight_class_id'];
            // Make sure the class exists
            $flight = FlightClass::where('id', $flightClassId)->first();
            if(!$flight)
            {
                return response()->json(['error' => 'The flight with id ' . $flightClassId . ' does not exist', 'status' => 0 ]);
            }


            $addedSeatsData = [];
            // Loop through each seat submitted in the form
            foreach ($seatsData['seats'] as $seatData)
            {
                
                // Make sure the seat locaion exists
                $seatLocationId = $seatData['location_id'];
                $seatLocation = SeatLocation::where('id', $seatLocationId)->first();
                if(!$seatLocation)
                {
                    return response()->json(['error' => 'The Seat Location with id ' . $seatLocationId . ' does not exist', 'status' => 0 ]);
                }

                // Create a new seat instance and set its attributes
                $seat = new Seat([
                    'seat_number' => $seatData['seat_number'],
                    'price' => $seatData['price'],
                    'is_available' => false,
                    'plane_id' => $planeId,
                    'flight_class_id' => $flightClassId,
                    'flight_id' => null, // Since we are manually adding seats, there's no specific flight associated yet.
                    'location_id' => $seatLocationId,
                ]);

                // Make sure the seat does not exist
                $existingSeat = Seat::where('seat_number', $seat->seat_number)
                                    ->where('plane_id', $seat->plane_id)
                                    ->first();

                if($existingSeat)
                {
                    return response()->json(['error' => 'The seat with the seat number ' . $seat->seat_number . ' and plane id ' . $seat->plane_id . ' exists', 'status' => 0 ]);
                }
            
                // Save the seat to the database
                $seat->save();

                $addedSeatsData[] = $seat;
            }

            DB::commit();

            return response()->json(['success' => 'Seats added successfully.', 'status' => 1]);
        } 
        catch (\Exception $e) 
        {
            DB::rollback();

            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
             return response()->json(['error' => 'An error occurred. ' . $e->getMessage(), 'status' => 0 ]);

            // return response()->json(['error' => 'An error occurred.', 'status' => 0 ]);
        }
    }

    // Update a seat 
    public function update(Request $request, $seatNumber)
    {    
        DB::beginTransaction();
   
        try 
        {
           /// Validate the form data
           $seatData = $request->validate([
                'plane_id' => 'required|integer',
                'flight_class_id' => 'required|integer',
                'seat_number' => 'required|string|max:5',
                'location_id' => 'required|integer',
                'price' => 'required|numeric',
            ]);
        
            $planeId = $seatData['plane_id'];

            // Make sure the plane exists
            $plane = Plane::where('id', $planeId)->first();
            if(!$plane)
            {
                return response()->json(['error' => 'The plane with id ' . $planeId . ' and name ' . $plane->name . ' does not exist', 'status' => 0 ]);
            }

            $flightClassId = $seatData['flight_class_id'];
            // Make sure the class exists
            $flight = FlightClass::where('id', $flightClassId)->first();
            if(!$flight)
            {
                return response()->json(['error' => 'The flight with id ' . $flightClassId . ' does not exist', 'status' => 0, 'status' => 0 ]);
            }

             // Make sure the seat locaion exists
             $seatLocationId = $seatData['location_id'];
             $seatLocation = SeatLocation::where('id', $seatLocationId)->first();
             if(!$seatLocation)
             {
                 return response()->json(['error' => 'The Seat Location with id ' . $seatLocationId . ' does not exist', 'status' => 0 ]);
             }
            
            // Make sure the seat is valid
            $seat = Seat::where('seat_number', $seatNumber)
                         ->where('plane_id', $planeId)
                         ->first();

            if(!$seat)
            {
                return response()->json(['error' => 'The seat does not exist', 'status' => 0 ]);
            }

            // Make sure the details given do not conflict with another seat
            if($this->seatExists(($seatData)))
            {
                return response()->json(['error' => 'The seat with the seat number ' . $seat->seat_number . ' and plane id ' . $seat->plane_id . ' exists', 'status' => 0 ]);
            }

            // Update the seat
            $seat->update($seatData);

            DB::commit();

            return response()->json(['success' => 'Seat successfully updated.', 'status' => 1]);
        } 
        catch (\Exception $e) 
        {
            DB::rollback();

            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage(), 'status' => 0 ]);

             return response()->json(['error' => 'An error occurred.', 'status' => 0 ]);
        }
    }


    // Delete seat
    public function delete($seatId)
    {
        try
        {
            // Make sure the seat is valid
            $seat = Seat::where('id', $seatId)->first();
            if(!$seat)
            {
                return response()->json(['error' => 'The seat does not exist.', 'status' => 0 ]);
            }

            // Delete the seat
            $seat->delete();

            return response()->json(['success' => 'Seat deleted successfully.', 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            Log::error($e->getMessage());

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage(), 'status' => 0 ]);

             return response()->json(['error' => 'An error occurred.', 'status' => 0 ]);
        }

    }

}

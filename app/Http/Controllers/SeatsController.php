<?php

namespace App\Http\Controllers;

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
                return response()->json(['error' => 'The seat does not exist'], 500);
            }

            return response()->json(['seat' => $seat, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);

             return response()->json(['error' => 'An error occurred.'], 500);
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
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);

             return response()->json(['error' => 'An error occurred.'], 500);
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
                'seats.*.seat_number' => 'required|string|max:10',
                'seats.*.seat_location' => 'required|string',
                'seats.*.price' => 'required|numeric',
            ]);
        
            $planeId = $seatsData['plane_id'];

            // Make sure the plane exists
            $plane = Plane::where('id', $planeId)->first();
            if(!$plane)
            {
                return response()->json(['error' => 'The plane with id ' . $planeId . ' and name ' . $plane->name . ' does not exist'], 500);
            }
        
            // Loop through each seat submitted in the form
            foreach ($seatsData['seats'] as $seatData)
            {
                // Get the seat location ID based on the seat location name
                $seatLocationId = SeatLocation::where('name', $seatData['seat_location'])->value('id');
            
                // Create a new seat instance and set its attributes
                $seat = new Seat([
                    'seat_number' => $seatData['seat_number'],
                    'price' => $seatData['price'],
                    'is_available' => false,
                    'plane_id' => $planeId,
                    'flight_id' => null, // Since we are manually adding seats, there's no specific flight associated yet.
                    'seat_location_id' => $seatLocationId,
                ]);

                // Make sure the seat does not exist
                $existingSeat = Seat::where('seat_number', $seat->seat_number)
                                    ->where('plane_id', $seat->plane_id)
                                    ->first();

                if($existingSeat)
                {
                    return response()->json(['error' => 'The seat whith the seat number ' . $seat->seat_number . ' and plane id ' . $seat->plane_id . ' exists'], 500);
                }
            
                // Save the seat to the database
                $seat->save();
            }

            DB::commit();

            return response()->json(['seat' => $seat, 'status' => 1]);
        } 
        catch (\Exception $e) 
        {
            DB::rollback();

            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);

             return response()->json(['error' => 'An error occurred.'], 500);
        }
    }

    // Update a seat 
    public function update(Request $request, $seatNumber)
    {    
        DB::beginTransaction();
   
        try 
        {
            // Validate the request data
             /// Validate the form data
             $seatData = $request->validate([
                'plane_id' => 'required|integer',
                'seat_number' => 'required|string|max:10',
                'seat_location' => 'required|string',
                'price' => 'required|numeric',
            ]);
        
            $planeId = $seatData['plane_id'];

            // Make sure the plane exists
            $plane = Plane::where('id', $planeId)->first();
            if(!$plane)
            {
                return response()->json(['error' => 'The plane with id ' . $planeId . ' and name ' . $plane->name . ' does not exist'], 500);
            }

            
            // Make sure the seat is valid
            $seat = Seat::where('seat_number', $seatNumber)
                         ->where('plane_id', $planeId)
                         ->first();

            if(!$seat)
            {
                return response()->json(['error' => 'The seat does not exist'], 500);
            }

            // Make sure the details given do not conflict with another seat
            if($this->seatExists(($seatData)))
            {
                return response()->json(['error' => 'The seat whith the seat number ' . $seat->seat_number . ' and plane id ' . $seat->plane_id . ' exists'], 500);
            }

            // Update the seat
            $seat->update($seatData);

            DB::commit();

            return response()->json(['seat' => $seat, 'status' => 1]);
        } 
        catch (\Exception $e) 
        {
            DB::rollback();

            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);

             return response()->json(['error' => 'An error occurred.'], 500);
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
                return response()->json(['error' => 'The seat does not exist'], 500);
            }

            // Delete the seat
            $seat->delete();

            return response()->json(['message' => 'Seat deleted successfully', 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);

             return response()->json(['error' => 'An error occurred.'], 500);
        }

    }

}

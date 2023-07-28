<?php

namespace App\Http\Controllers;

use App\Models\Airline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AirlineController extends Controller
{
    public function airlineExists($airlineData)
    {
        $existingAirline = Airline::where('code', $airlineData['code'])->first();

        if($existingAirline)
            return true;
        else
            return false;
    }

    // Get a airline
    public function show(Request $request, $airlineCode)
    {
        try
        {
            // Make sure the airline is valid
            $airline = Airline::where('code', $airlineCode)->first();
            if(!$airline)
            {
                return response()->json(['error' => 'The airline does not exist', 'status' => 0], 404);
            }

            return response()->json(['airline' => $airline, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()]);

             return response()->json(['error' => 'An error occurred.', 'status' => 0]);
        }
    }

    // Get all airlines
    public function index(Request $request)
    {
        try
        {
            $airlines = Airline::all();

            return response()->json(['airlines' => $airlines, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()]);

             return response()->json(['error' => 'An error occurred.', 'status' => 0]);
        }
    }

    // Store a new airline into the database
    public function store(Request $request)
    {       
        try 
        {
            // Validate the request data
            $airlineData = $request->validate([
                'name' => 'required|string',
                'code' => 'required|string',                              
            ]);

           
            // Make sure the airline is not a duplicate
            if($this->airlineExists(($airlineData)))
            {
                return response()->json(['error' => 'The airline exists', 'status' => 0]);
            }                       

            // Creae the airline
            $airline = Airline::create([
                'name' => $airlineData['name'],
                'code' => $airlineData['code'],
            ]);

            return response()->json(['success' => 'Airline added successfully', 'status' => 1]);
        } 
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()]);

             return response()->json(['error' => 'An error occurred.', 'status' => 0]);
        }
    }

    // Update a airline 
    public function update(Request $request, $airlineId)
    {       
        try 
        {
            // Validate the request data
            $airlineData = $request->validate([
                'name' => 'required|string',
                'code' => 'required|string',                              
            ]);

            
            // Make sure the airline is valid
            $airline = Airline::where('id', $airlineId)->first();
            if(!$airline)
            {
                return response()->json(['error' => 'The airline does not exist', 'status' => 0], 404);
            }

            // Make sure the details given do not conflict with another airline
            if($this->airlineExists(($airlineData)))
            {
                return response()->json(['success' => 'Airline already upto date.', 'status' => 1]);
            }

            // Update the airline
            $airline->update($airlineData);

            return response()->json(['success' => 'Airline updated successfully.', 'status' => 1]);
        } 
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
             return response()->json(['error' => 'An error occurred. ' . $e->getMessage(), 'status' => 0]);

            // return response()->json(['error' => 'An error occurred.', 'status' => 0]);
        }
    }


    // Delete airline
    public function delete($airlineId)
    {
        try
        {
            // Make sure the airline is valid
            $airline = Airline::where('id', $airlineId)->first();
            if(!$airline)
            {
                return response()->json(['error' => 'The airline does not exist', 'status' => 0]);
            }

            // Delete the airline
            $airline->delete();

            return response()->json(['success' => 'Airline deleted successfully', 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()]);

             return response()->json(['error' => 'An error occurred.', 'status' => 0]);
        }

    }
}

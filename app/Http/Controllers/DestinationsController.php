<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DestinationsController extends Controller
{
    public function show($departure_destination)
    {
        try 
        {
            //Ge the departure destination id
            $departure_destination_details = DB::select('SELECT * FROM destinations WHERE name=? LIMIT 1', [$departure_destination]);

            // Make sure the departure destination exists in the database
            if (!empty($departure_destination_details)) 
            {
                $departure_destination_id = $departure_destination_details[0]->id;
                $available_destinations = DB::select('SELECT DISTINCT ad.name FROM flights f  JOIN destinations ad ON f.arrival_destination_id = ad.id WHERE f.departure_destination_id = ?', [$departure_destination_id]);
            } 
            else 
            {
                return response()->json(['error' => 'Departure destination does not exist!'], 500);

            }
            
        
            return response()->json($available_destinations);
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

<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FlightsController extends Controller
{
    public function index()
    {
        try 
        {
            $flights = DB::select('SELECT flight_number, departure_time, arrival_time, duration, airline, is_international, dd.name AS departure_destination_name, ad.name AS arrival_destination_name, p.name AS plane_name
            FROM flights f
            JOIN destinations dd ON f.departure_destination_id = dd.id
            JOIN destinations ad ON f.arrival_destination_id = ad.id
            JOIN planes p ON f.plane_id = p.id');
        
            return response()->json($flights);
        } 
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            //return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
            
            return response()->json(['error' => 'An error occurred.'], 500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Flight;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FlightsController extends Controller
{
    public function index()
    {
        try 
        {
            $flights = Flight::all();
        
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

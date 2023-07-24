<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Flight;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CitiesController extends Controller
{
    public function getArrivalCities($departureCity)
    {
        try 
        {
            //Ge the departure city details
            $departureCityDetails = City::where('name', $departureCity)->first();

            // Make sure the departure city exists in the database
            if (!$departureCityDetails) 
            {
                $departureCityId = $departureCityDetails->id;
                $arrivalCities = Flight::where('departure_city_id', $departureCityId)->get();
            } 
            else 
            {
                return response()->json(['error' => 'Departure destination does not exist!'], 500);

            }
            
        
            return response()->json($arrivalCities);
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

<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Flight;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CitiesController extends Controller
{
    public function cityExists($cityData)
    {
        $existingCity = City::where('name', $cityData['name'])
                        ->where('country', $cityData['country'])
                        ->first();

        if($existingCity)
            return true;
        else
            return false;
    }

    // Store a new city into the database
    public function store(Request $request)
    {       
        try 
        {
            // Validate the request data
            $cityData = $request->validate([
                'name' => 'required|string',
                'country' => 'required|string',                              
            ]);

            /*********** For testing only *************/
            $cityData['name'] = fake()->city;
            $cityData['country'] = fake()->country;
            /******************************************/

            // Make sure the city is not a duplicate
            if($this->cityExists(($cityData)))
            {
                return response()->json(['error' => 'The city exists'], 500);
            }                       

            // Creae the city
            $city = City::create([
                'name' => $cityData['name'],
                'country' => $cityData['country'],
            ]);

            return response()->json(['city' => $city, 'status' => 1]);
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

    // Update a city 
    public function update(Request $request, $cityId)
    {       
        try 
        {
            // Validate the request data
            $cityData = $request->validate([
                'name' => 'required|string',
                'country' => 'required|string',                              
            ]);

            /*********** For testing only *************/
            $cityData['name'] = fake()->city;
            $cityData['country'] = fake()->country;
            $cityId = City::pluck('id')->random();
            /******************************************/

            // Make sure the city is valid
            $city = City::where('id', $cityId)->first();
            if(!$city)
            {
                return response()->json(['error' => 'The city does not exist'], 500);
            }

            // Make sure the details given do not conflict with another city
            if($this->cityExists(($cityData)))
            {
                return response()->json(['error' => 'The city exists'], 500);
            }

            // Update the city
            $city->update($cityData);

            return response()->json(['city' => $city, 'status' => 1]);
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


    // Delete city
    public function delete($cityId)
    {
        try
        {
            // Make sure the city is valid
            $city = City::where('id', $cityId)->first();
            if(!$city)
            {
                return response()->json(['error' => 'The city does not exist'], 500);
            }

            // Delete the city
            $city->delete();

            return response()->json(['message' => 'City deleted successfully', 'status' => 1]);
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

    // Get all cities
    public function getCity(Request $request, $cityName, $cityCountry)
    {
        try
        {
            // Make sure the city is valid
            $city = City::where('name', $cityName)
                          ->where('country', $cityCountry)
                          ->first();
            if(!$city)
            {
                return response()->json(['error' => 'The city does not exist'], 500);
            }

            return response()->json(['city' => $city, 'status' => 1]);
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

    // Get a single city
    public function getAllCities(Request $request)
    {
        try
        {
            $cities = City::all();

            return response()->json(['cities' => $cities, 'status' => 1]);
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

    // Get arrival cities given a destination city
    public function getArrivalCities($departureCity)
    {
        try 
        {
            //Ge the departure city details
            $departureCityDetails = City::where('name', $departureCity)->first();

            // Make sure the departure city exists in the database
            if (!$departureCityDetails) 
            {
                return response()->json(['error' => 'Departure city does not exist!'], 500);
            } 
            
            $departureCityId = $departureCityDetails->id;
            $arrivalCities = Flight::where('departure_city_id', $departureCityId)->get();
            
        
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

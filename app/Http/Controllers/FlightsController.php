<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Flight;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FlightsController extends Controller
{
    public function index()
    {
        try 
        {
            $flights = Flight::all();
        
            return response()->json(['flights' => $flights, 'status' => 1]);
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

    // Display the details of a specific flight
    public function show($flightId)
    {
        try 
        {
            $flight = Flight::findOrFail($flightId);
            return response()->json(['flight' => $flight]);
        }
        catch (ModelNotFoundException $e) 
        {
            return response()->json(['error' => 'Flight not found'], 404);
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

    // Store a new flight into the database
    public function store(Request $request)
    {
        $flightData = $request->validate([
            'flight_number' => 'required|string|max:255',
            'airline' => 'required|string|max:255',
            'plane_id' => 'required|exists:planes,id',
            'is_international' => 'required|boolean',
            'departure_time' => 'required|date',
            'arrival_time' => 'required|date|after:departure_time',
            'flight_status_id' => 'required|exists:flight_statuses,id',
            'departure_city_id' => 'required|exists:cities,id',
            'arrival_city_id' => 'required|exists:cities,id',
        ]);

        DB::beginTransaction();
        
        try 
        {
            // Create the flight
            $flight = Flight::create($flightData);

            DB::commit();

            return response()->json(['flight' => $flight, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            DB::rollback();

            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.'], 500);

            // For debugging
            // return response()->json(['error' => 'Error: ' . $e->getMessage()], 500);
        }
    }


    // Update a flight
    public function update(Request $request, $flightId)
    {
        $flightData = $request->validate([
            'flight_number' => 'required|string|max:255',
            'airline' => 'required|string|max:255',
            'plane_id' => 'required|exists:planes,id',
            'is_international' => 'required|boolean',
            'departure_time' => 'required|date',
            'arrival_time' => 'required|date|after:departure_time',
            'flight_status_id' => 'required|exists:flight_statuses,id',
            'departure_city_id' => 'required|exists:cities,id',
            'arrival_city_id' => 'required|exists:cities,id',
        ]);

        DB::beginTransaction();
        
        try 
        {
            // Find the flight
            $flight = Flight::findOrFail($flightId);

            // Update the flight
            $flight->update($flightData);

            DB::commit();

            return response()->json(['flight' => $flight, 'status' => 1]);
        }         
        catch (ModelNotFoundException $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Flight not found'], 404);
        }
        catch (\Exception $e) 
        {
            DB::rollback();

            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.'], 500);

            // For debugging
            // return response()->json(['error' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    // Delete a flight
    public function delete($flightId)
    {
        DB::beginTransaction();

        try 
        {
            // Find the flight
            $flight = Flight::findOrFail($flightId);

            // Delete the flight
            $flight->delete();

            DB::commit();

            return response()->json(['message' => 'Flight deleted successfully', 'status' => 1]);
        }
        catch (ModelNotFoundException $e) 
        {
            Log::error($e->getMessage());

            return response()->json(['error' => 'Flight not found'], 404);
        }
        catch (\Exception $e) 
        {
            DB::rollback();

            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.'], 500);

            // For debugging
            // return response()->json(['error' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    // Get flights with a particular departure city
    public function getFlightsByDepartureCity($departureCityId)
    {
        try 
        {
            // Make sure the departure city is valid
            $city = City::findOrFail($departureCityId);

            $flights = Flight::where('departure_city_id', $city->id)->get();

            return response()->json(['flights' => $flights, 'status' => 1]);
        }
        catch (ModelNotFoundException $e) 
        {
            Log::error($e->getMessage());

            return response()->json(['error' => 'Departure city not found'], 404);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.'], 500);

            // For debugging
            // return response()->json(['error' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    // Get flights departing after a given number of hours
    public function getFlightsDepartingAfterHours($hours)
    {
        try 
        {
            // Calculate the departure time after the given hours from the current time
            $departureTime = Carbon::now()->addHours($hours);

            // Get flights that depart after the calculated departure time
            $flights = Flight::where('departure_time', '>', $departureTime)->get();

            return response()->json(['flights' => $flights, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.'], 500);
        }

        // For debugging
        // return response()->json(['error' => 'Error: ' . $e->getMessage()], 500);
    }

    // Get flights departing on a particular departure date
    public function getFlightsByDepartureDate(Request $request)
    {
        try 
        {
            $flightData = $request->validate([
                'departure_date' => 'required|date',
            ]);

            $departureDate = $flightData['departure_date'];

            // Get flights that depart on the specified departure date
            $flights = Flight::whereDate('departure_time', $departureDate)->get();

            return response()->json(['flights' => $flights, 'status' => 1]);
        } 
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.'], 500);

            // For debugging
            // return response()->json(['error' => 'Error: ' . $e->getMessage()], 500);
        }

    }

}

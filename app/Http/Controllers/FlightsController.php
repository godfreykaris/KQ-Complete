<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Flight;
use App\Models\FlightStatus;
use App\Models\Seat;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FlightsController extends Controller
{
    public function generateFlightNumber()
    {
        $flightPrefix = 'KQ-FN-'; 
        $randomNumber = mt_rand(100000, 999999); // Generate a random 6-digit number
        
        $flightNumber = $flightPrefix . $randomNumber;

        // Check if the generated flight number already exists in the database
        while (Flight::where('flight_number', $flightNumber)->exists()) 
        {
            $randomNumber = mt_rand(100000, 999999);
            $flightNumber = $flightPrefix . $randomNumber;
        }

        
        return $flightNumber;
    }

    public function index()
    {
        try 
        {
           $flights = Flight::with('plane', 'flightStatus', 'departureCity', 'arrivalCity')->get();
        
            return response()->json(['flights' => $flights, 'status' => 1]);
        } 
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            //return response()->json(['error' => 'An error occurred. ' . $e->getMessage(), 'status' => 0]);
            
            return response()->json(['error' => 'An error occurred.', 'status' => 0]);
        }
    }

    // Display the details of a specific flight
    public function show($flightId)
    {
        try 
        {
            $flight = Flight::with(['plane', 'flightStatus', 'departureCity', 'arrivalCity'])
                     ->findOrFail($flightId);

            return response()->json(['flight' => $flight, 'status' => 1]);
        }
        catch (ModelNotFoundException $e) 
        {
            return response()->json(['error' => 'Flight not found', 'status' => 0], 404);
        } 
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            //return response()->json(['error' => 'An error occurred. ' . $e->getMessage(), 'status' => 0]);
            
            return response()->json(['error' => 'An error occurred.', 'status' => 0]);
        }
    }

    // Store a new flight into the database
    public function store(Request $request)
    {
        $flightData = $request->validate([
            'airline_id' => 'required|exists:airlines,id',
            'plane_id' => 'required|exists:planes,id',
            'is_international' => 'required|boolean',
            'departure_time' => 'required|date',
            'flight_status_id' => 'required|exists:flight_statuses,id',
            'arrival_time' => 'required|date|after:departure_time',
            'departure_city_id' => 'required|exists:cities,id',
            'arrival_city_id' => 'required|exists:cities,id',
        ]);

        DB::beginTransaction();
        
        try 
        {
            // Generate the flight number
            $flightNumber = $this->generateFlightNumber();
            $flightData['flight_number'] = $flightNumber;

            // Create the flight
            $flight = Flight::create($flightData);

            DB::commit();

            return response()->json(['success' => 'Flight added successfully.', 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            DB::rollback();

            Log::error($e->getMessage());
            //return response()->json(['error' => 'An error occurred.', 'status' => 0]);

            // For debugging
             return response()->json(['error' => 'Error: ' . $e->getMessage(), 'status' => 0]);
        }
    }


    // Update a flight
    public function update(Request $request, $flightId)
    {
        $flightData = $request->validate([
            'airline_id' => 'required|exists:airlines,id',
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

            // If the plane changes, delete the seats that were previously added to the seats table

            // Get previous plane
            $previousPlaneId = $flight->plane_id;

            if($previousPlaneId != $flightData['plane_id'])
            {
                // Delete the seats
                Seat::where('flight_id', $flightId)->delete();

                // Update the flight
                $flight->update($flightData);

                // Add the changed planes seats
                $flight->createFlightSeats();

            }
            else
            {
                // Update the flight
                $flight->update($flightData);
            }            

            DB::commit();

            return response()->json(['success' => 'Flight Updated Successfully.', 'status' => 1]);
        }         
        catch (ModelNotFoundException $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Flight not found', 'status' => 0], 404);
        }
        catch (\Exception $e) 
        {
            DB::rollback();

            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.', 'status' => 0]);

            // For debugging
            // return response()->json(['error' => 'Error: ' . $e->getMessage(), 'status' => 0]);
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

            return response()->json(['success' => 'Flight deleted successfully', 'status' => 1]);
        }
        catch (ModelNotFoundException $e) 
        {
            Log::error($e->getMessage());

            return response()->json(['error' => 'Flight not found', 'status' => 0], 404);
        }
        catch (\Exception $e) 
        {
            DB::rollback();

            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred. Make sure the flight has no active bookings just in case.', 'status' => 0]);

            // For debugging
            // return response()->json(['error' => 'Error: ' . $e->getMessage(), 'status' => 0]);
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

            return response()->json(['error' => 'Departure city not found', 'status' => 0], 404);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.', 'status' => 0]);

            // For debugging
            // return response()->json(['error' => 'Error: ' . $e->getMessage(), 'status' => 0]);
        }
    }

    // Get flights departing within a given number of hours
    public function getFlightsDepartingWithinHours($hours)
    {
        try 
        {
            // Manually validate the number of hours to ensure it's a positive integer
            $hours = (int)$hours;

            if ($hours <= 0 || $hours > 1000) 
            {
                return response()->json(['error' => 'Invalid number of hours. Acceptable range 0 to 1000 hours.', 'status' => 0], 400);
            }

            // Calculate the departure time after the given hours from the current time
            $departureTime = Carbon::now()->addHours($hours);

            // Get flights that depart within the calculated departure time
            $flights = Flight::where('departure_time', '<', $departureTime)->get();

            return response()->json(['flights' => $flights, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.', 'status' => 0]);
        }

        // For debugging
        // return response()->json(['error' => 'Error: ' . $e->getMessage(), 'status' => 0]);
    }

    // Get flights departing on a particular departure date
    public function getFlightsByDepartureDate(Request $request, $departureDate)
    {
        try 
        {
            // Validate that the provided departure date is a valid date format
            if (!strtotime($departureDate)) 
            {
                return response()->json(['error' => 'Invalid departure date format.', 'status' => 1], 400);
            }

            // Get flights that depart on the specified departure date
            $flights = Flight::whereDate('departure_time', $departureDate)->get();

            return response()->json(['flights' => $flights, 'status' => 1]);
        } 
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.', 'status' => 0]);

            // For debugging
            // return response()->json(['error' => 'Error: ' . $e->getMessage(), 'status' => 0]);
        }

    }

}

<?php

namespace App\Http\Controllers;

use App\Models\Plane;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PlanesController extends Controller
{
    public function generatePlaneId()
    {
        $planeId = 'PL-' . strtoupper(Str::random(6));

        // Check if the generated booking reference already exists in the database
        while (Plane::where('plane_id', $planeId)->exists()) 
        {
            $planeId = 'PL-' . strtoupper(Str::random(6));
        }
    
           
        return $planeId;
    }

    public function planeExists($planeData)
    {
        $existingPlane = Plane::where('name', $planeData['name'])
                        ->where('model', $planeData['model'])
                        ->where('capacity', $planeData['capacity'])
                        ->first();

        if($existingPlane)
            return true;
        else
            return false;
    }

    // Get a plane
    public function show(Request $request, $planeId)
    {
        try
        {
            // Make sure the plane is valid
            $plane = Plane::where('plane_id', $planeId)->first();
            if(!$plane)
            {
                return response()->json(['error' => 'The plane does not exist', 'status' => 0]);
            }

            return response()->json(['plane' => $plane, 'status' => 1]);
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

    // Get all planes
    public function index(Request $request)
    {
        try
        {
            $planes = Plane::all();

            return response()->json(['planes' => $planes, 'status' => 1]);
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

    // Store a new plane into the database
    public function store(Request $request)
    {       
        try 
        {
            // Validate the request data
            $planeData = $request->validate([
                'name' => 'required|string',
                'model' => 'required|string',
                'capacity' => 'required|numeric'                              
            ]);

            // Make sure the plane is not a duplicate
            if($this->planeExists(($planeData)))
            {
                return response()->json(['error' => 'The plane exists', 'status' => 0]);
            }                       

            // Creae the plane
            $plane = Plane::create([
                'plane_id' => $this->generatePlaneId(),
                'name' => $planeData['name'],
                'model' => $planeData['model'],
                'capacity' => $planeData['capacity'],
            ]);

            return response()->json(['success' => 'Plane added successfully.', 'status' => 1]);
        } 
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()]);

             return response()->json(['error' => 'An error occurred.']);
        }
    }

    // Update a plane 
    public function update(Request $request, $planeId)
    {       
        try 
        {
             // Validate the request data
             $planeData = $request->validate([
                'name' => 'required|string',
                'model' => 'required|string',
                'capacity' => 'required|numeric'                              
            ]);

            
            // Make sure the plane is valid
            $plane = Plane::where('plane_id', $planeId)->first();
            if(!$plane)
            {
                return response()->json(['error' => 'The plane does not exist', 'status' => 0]);
            }

            // Make sure the details given do not conflict with another plane
            if($this->planeExists(($planeData)))
            {
                return response()->json(['success' => 'The plane is upto date.', 'status' => 1]);
            }

            // Update the plane
            $plane->update($planeData);

            return response()->json(['success' => 'Plane updated successfully.', 'status' => 1]);
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


    // Delete plane
    public function delete($planeId)
    {
        try
        {
            // Make sure the plane is valid
            $plane = Plane::where('plane_id', $planeId)->first();
            if(!$plane)
            {
                return response()->json(['error' => 'The plane does not exist', 'status' => 0]);
            }

            // Delete the plane
            $plane->delete();

            return response()->json(['success' => 'Plane deleted successfully', 'status' => 1]);
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

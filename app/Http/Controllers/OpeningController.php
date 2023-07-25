<?php

namespace App\Http\Controllers;

use App\Models\Opening;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OpeningController extends Controller
{
    public function index()
    {
        try
        {
            $openings = Opening::all();
            return response()->json($openings);
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

    public function getMatchingEmployees($openingId)
    {
        try
        {
            // Retrieve the opening by ID
            $opening = Opening::where('id', $openingId)->first();

            // Make sure the opening is valid
            if (!$opening) 
            {
                return response()->json(['error' => 'Opening not found.'], 404);
            }

            // Retrieve all employees who meet the qualifications and skills required for the opening
            $matchingEmployees = $opening->getMatchingEmployees();

            // Return the matching employees as JSON response
            return response()->json(['matched_employees' => $matchingEmployees, 'status' => 1]);
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

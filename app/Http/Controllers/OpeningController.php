<?php

namespace App\Http\Controllers;

use App\Models\Opening;
use Illuminate\Http\Request;

class OpeningController extends Controller
{
    public function index()
    {
        $openings = Opening::all();
        return response()->json($openings);
    }

    public function getMatchingEmployees($openingId)
    {
        // Retrieve the opening by ID
        $opening = Opening::findOrFail($openingId);

        // Retrieve all employees who meet the qualifications and skills required for the opening
        $matchingEmployees = $opening->getMatchingEmployees();

        // Return the matching employees as JSON response
        return response()->json(['data' => $matchingEmployees]);
    }
}

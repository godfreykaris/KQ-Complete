<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PlanesController extends Controller
{
    public function index()
    {
        try 
        {
            $planes = DB::select('SELECT * FROM planes');
        
            return response()->json($planes);
        } 
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred.'], 500);
        }
    }
}

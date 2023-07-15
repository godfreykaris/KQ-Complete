<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SeatsController extends Controller
{
    public function index()
    {
        try 
        {
            $seats = DB::select('SELECT * FROM seats');
        
            return response()->json($seats);
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

<?php

namespace App\Http\Controllers;

use App\Models\Opening;
use Barryvdh\DomPDF\PDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;


class OpeningController extends Controller
{
    public function index()
    {
        try
        {
            $openings = Opening::with('skills', 'qualifications')->get();
            return response()->json(['openings' => $openings, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage() , 'status' => 0]);

             return response()->json(['error' => 'An error occurred.' , 'status' => 0]);
        }
        
    }

    // Get an opening
    public function show(Request $request, $openingId)
    {
        try
        {
            // Make sure the opening is valid
            $opening = Opening::where('id', $openingId)->first();
            if(!$opening)
            {
                return response()->json(['error' => 'The opening does not exist' , 'status' => 0]);
            }

            return response()->json(['opening' => $opening, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage() , 'status' => 0]);

             return response()->json(['error' => 'An error occurred.' , 'status' => 0]);
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
                return response()->json(['error' => 'Opening not found.', 'status' => 0], 404);
            }

            // Retrieve all openings who meet the qualifications and skills required for the opening
            $matchingEmployees = $opening->getMatchingEmployees();

            $data = json_decode($matchingEmployees, true);

            // Load the blade template view that is used to organize and style the matches data
            $pdf = FacadePdf::loadView('matched_employees.pdf_template', ['matched_employees' => $data]);

            return $pdf->stream('employee-matches.pdf'); // Stream the PDF to the browser
           
        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
             return response()->json(['error' => 'An error occurred. ' . $e->getMessage() , 'status' => 0]);

            // return response()->json(['error' => 'An error occurred.' , 'status' => 0]);
        }
        
    }

    // Create a new opening
    public function store(Request $request)
    {
        try
        {
            $openingData = $request->validate([
                'title' => 'required',
                'description' => 'required',
                'qualifications' => 'nullable|array',
                'qualifications.*' => 'exists:qualifications,id',
                'skills' => 'nullable|array',
                'skills.*' => 'exists:skills,id',
            ]);
        
            // Check if the opening already exists based on email
            $existingOpening = Opening::where('title', $openingData['title'])->first();
            if($existingOpening)
            {
                return response()->json(['error' => 'There exists an opening with the specified title.' , 'status' => 0]);
            }
        
            // Remove the qualifications and skills from $openingData
            $qualifications = $openingData['qualifications'] ?? null;
            $skills = $openingData['skills'] ?? null;
            unset($openingData['qualifications']);
            unset($openingData['skills']);
            
            // Create the opening
            $opening = Opening::create($openingData);
            
            // Update qualifications and skills
            $now = now();
            if ($qualifications) 
            {
                $opening->qualifications()->attach($qualifications,  ['created_at' => $now, 'updated_at' => $now]);
            }
        
            if ($skills) 
            {
                $opening->skills()->attach($skills, ['created_at' => $now, 'updated_at' => $now]);
            }
        
            
    
            return response()->json(['success' => 'Opening added successfully.', 'status' => 1]);

        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage() , 'status' => 0]);

             //return response()->json(['error' => 'An error occurred.' , 'status' => 0]);
        }        
    }

    // Update an existing opening
    public function update(Request $request, $openingId)
    {
        try
        {
            $openingData = $request->validate([
                'title' => 'required',
                'description' => 'required',
                'qualifications' => 'nullable|array',
                'qualifications.*' => 'exists:qualifications,id',
                'skills' => 'nullable|array',
                'skills.*' => 'exists:skills,id',
            ]);
    
                
            // Fetch the opening
            $opening = Opening::where('id', $openingId)->first();
            // Make sure the opening exists
            if(!$opening)
            {
                return response()->json(['error' => 'The opening does not exist', 'status' => 0]);
            }
    
            // Remove the qualifications and skills from $openingData
            unset($openingData['qualifications']);
            unset($openingData['skills']);
    
            $opening->update($openingData);
    
            // Sync qualifications and skills if provided in the request
            $now = now();
    
            // Initialize arrays to hold pivot data for qualifications and skills
            $qualificationPivotData = [];
            $skillPivotData = [];
    
            // Check if qualifications data is provided in the request
            if ($request->has('qualifications')) 
            {
                // Loop through the input array of qualifications
                foreach ($request->input('qualifications') as $qualificationId) 
                {
                    // Set pivot data for the current qualification with 'created_at' and 'updated_at' timestamps
                    $qualificationPivotData[$qualificationId] = ['created_at' => $now, 'updated_at' => $now];
                }
            }
    
            // Check if skills data is provided in the request
            if ($request->has('skills')) 
            {
                // Loop through the input array of skills
                foreach ($request->input('skills') as $skillId) 
                {
                    // Set pivot data for the current skill with 'created_at' and 'updated_at' timestamps
                    $skillPivotData[$skillId] = ['created_at' => $now, 'updated_at' => $now];
                }
            }
    
            // Sync qualifications with pivot data (including 'created_at' and 'updated_at' timestamps)
            $opening->qualifications()->sync($qualificationPivotData);
    
            // Sync skills with pivot data (including 'created_at' and 'updated_at' timestamps)
            $opening->skills()->sync($skillPivotData);
    
            
            return response()->json(['success' => 'Opening updated successfully.', 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage() , 'status' => 0]);

             //return response()->json(['error' => 'An error occurred.' , 'status' => 0]);
        }  
        
    }

    // Delete an opening
    public function delete($openingId)
    {
        try
        {
            // Fetch the opening
            $opening = Opening::where('id', $openingId)->first();

            //Make sure the opening is valid
            if(!$opening)
            {
                return response()->json(['error' => 'The opening with id ' . $openingId . ' does not exist.', 'status' => 0], 404);
            }

            // Detach qualifications and skills from the opening before deletion
            $opening->qualifications()->detach();
            $opening->skills()->detach();

            // Delete opening
            $opening->delete();

            return response()->json(['success' => 'Opening deleted successfully', 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage() , 'status' => 0]);

             //return response()->json(['error' => 'An error occurred.' , 'status' => 0]);
        }  
        
    }
}

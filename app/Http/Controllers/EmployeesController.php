<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Str;


class EmployeesController extends Controller
{
    public function generateEmployeeId()
    {
        $employeeId = 'KQ-EP-' . strtoupper(Str::random(15));

        // Check if the generated booking reference already exists in the database
        while (Employee::where('employee_id', $employeeId)->exists()) 
        {
            $employeeId = 'KQ-EP-' . strtoupper(Str::random(15));
        }
    
           
        return $employeeId;
    }

    // Get all employees
    public function index()
    {
        try
        {
            $employees = Employee::with('skills', 'qualifications', 'jobTitle')->get();

            return response()->json(['employees' => $employees, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);

             //return response()->json(['error' => 'An error occurred.'], 500);
        }         
    }

    // Fetch a single employee by ID
    public function show($employeeId)
    {
        try
        {
            // Fetch the employee
            $employee = Employee::with('skills', 'qualifications', 'jobTitle')->where('employee_id', $employeeId)->first();

            // Make sure the employee is valid
            if(!$employee)
            {
                return response()->json(['error' => 'The employee with id ' . $employeeId . ' does not exist.'], 404);
            }

            // Return the employee as a JSON response
            return response()->json(['employee' => $employee, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);

             //return response()->json(['error' => 'An error occurred.'], 500);
        } 
        
    }

    // Create a new employee
    public function store(Request $request)
    {
        try
        {
            $employeeData = $request->validate([
                'first_name' => 'required',
                'last_name' => 'required',
                'email' => 'required|email|unique:employees,email',
                'phone' => 'required',
                'date_of_birth' => 'required|date',
                'address' => 'required',
                'job_title_id' => 'required|exists:job_titles,id',
                'qualifications' => 'nullable|array',
                'qualifications.*' => 'exists:qualifications,id',
                'skills' => 'nullable|array',
                'skills.*' => 'exists:skills,id',
            ]);

               
            // Check if the employee already exists based on email
            $existingEmployee = Employee::where('email', $employeeData['email'])->first();
            if($existingEmployee)
            {
                return response()->json(['error' => 'There exists an employee with the specified email address.'], 500);
            }

            // Create an employee ID
            $employeeId = $this->generateEmployeeId();
            $employeeData['employee_id'] = $employeeId;

        
            // Remove the qualifications and skills from $employeeData
            $qualifications = $employeeData['qualifications'] ?? null;
            $skills = $employeeData['skills'] ?? null;
            unset($employeeData['qualifications']);
            unset($employeeData['skills']);
            
            // Create the employee
            $employee = Employee::create($employeeData);
            
            // Update qualifications and skills
            $now = now();
            if ($qualifications) 
            {
                $employee->qualifications()->attach($qualifications,  ['created_at' => $now, 'updated_at' => $now]);
            }
        
            if ($skills) 
            {
                $employee->skills()->attach($skills, ['created_at' => $now, 'updated_at' => $now]);
            }
        
            
    
            return response()->json(['success' => 'Employee added successfully.', 'status' => 1], 201);

        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);

             //return response()->json(['error' => 'An error occurred.'], 500);
        }        
    }

    // Update an existing employee
    public function update(Request $request, $employeeId)
    {
        try
        {
            $employeeData = $request->validate([
                'first_name' => 'required',
                'last_name' => 'required',
                'email' => 'required|email|unique:employees,email',
                'phone' => 'required',
                'date_of_birth' => 'required|date',
                'address' => 'required',
                'job_title_id' => 'required|exists:job_titles,id',
                'qualifications' => 'nullable|array',
                'qualifications.*' => 'exists:qualifications,id',
                'skills' => 'nullable|array',
                'skills.*' => 'exists:skills,id',
            ]);
    
               
            // Fetch the employee
            $employee = Employee::where('employee_id', $employeeId)->first();
            // Make sure the employee exists
            if(!$employee)
            {
                return response()->json(['error' => 'The employee does not exist']);
            }
    
            // Remove the qualifications and skills from $employeeData
            unset($employeeData['qualifications']);
            unset($employeeData['skills']);
    
            $employee->update($employeeData);
    
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
            $employee->qualifications()->sync($qualificationPivotData);
    
            // Sync skills with pivot data (including 'created_at' and 'updated_at' timestamps)
            $employee->skills()->sync($skillPivotData);
    
            
            return response()->json(['employee' => $employee, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);

             //return response()->json(['error' => 'An error occurred.'], 500);
        }  
        
    }

    // Delete an employee
    public function destroy($employeeId)
    {
        try
        {
            // Fetch the employee
            $employee = Employee::where('employee_id', $employeeId)->first();

            //Make sure the employee is valid
            if(!$employee)
            {
                return response()->json(['error' => 'The employee with id ' . $employeeId . ' does not exist.'], 404);
            }

            // Detach qualifications and skills from the employee before deletion
            $employee->qualifications()->detach();
            $employee->skills()->detach();

            // Delete employee
            $employee->delete();

            return response()->json(['message' => 'Employee deleted successfully', 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            // Log the exception or handle it as needed
            // For example:
            Log::error($e->getMessage());

            // For debugging
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);

             //return response()->json(['error' => 'An error occurred.'], 500);
        }  
        
    }

}

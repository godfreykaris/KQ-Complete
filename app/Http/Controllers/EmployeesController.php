<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeesController extends Controller
{
    // Get all employees
    public function index()
    {
        $employees = Employee::all();
        return response()->json($employees);
    }

    // Create a new employee
    public function store(Request $request)
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
        $existingEmployee = Employee::where('email', $employeeData['emails'])->first();


        $employee = Employee::create($employeeData);

        // Attach qualifications and skills if provided in the request
        if ($request->has('qualifications')) {
            $employee->qualifications()->attach($request->input('qualifications'));
        }

        if ($request->has('skills')) {
            $employee->skills()->attach($request->input('skills'));
        }

        return response()->json($employee, 201);
    }

    // Get a single employee by ID
    public function show($id)
    {
        $employee = Employee::findOrFail($id);
        return response()->json($employee);
    }

    // Update an existing employee
    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);

        $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:employees,email,' . $id,
            'phone' => 'required',
            'date_of_birth' => 'required|date',
            'address' => 'required',
            'job_title_id' => 'required|exists:job_titles,id',
        ]);

        $employee->update($request->all());

        // Sync qualifications and skills if provided in the request
        if ($request->has('qualifications')) {
            $employee->qualifications()->sync($request->input('qualifications'));
        }

        if ($request->has('skills')) {
            $employee->skills()->sync($request->input('skills'));
        }

        return response()->json($employee);
    }

    // Delete an employee
    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();

        return response()->json(['message' => 'Employee deleted successfully']);
    }

}

<?php

namespace App\Http\Controllers;

use App\Models\EmployeeQualification;
use Illuminate\Http\Request;

class EmployeeQualificationsController extends Controller
{
    // Create a new employee qualification
    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'qualification_id' => 'required|exists:qualifications,id',
        ]);

        $employeeQualification = EmployeeQualification::create($request->all());

        return response()->json($employeeQualification, 201);
    }

    // Delete an employee qualification
    public function destroy($id)
    {
        $employeeQualification = EmployeeQualification::findOrFail($id);
        $employeeQualification->delete();

        return response()->json(['message' => 'Employee qualification deleted successfully']);
    }
}

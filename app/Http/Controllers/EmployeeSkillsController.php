<?php

namespace App\Http\Controllers;

use App\Models\EmployeeSkill;
use Illuminate\Http\Request;

class EmployeeSkillsController extends Controller
{
    // Create a new employee skill
    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'skill_id' => 'required|exists:skills,id',
        ]);

        $employeeSkill = EmployeeSkill::create($request->all());

        return response()->json($employeeSkill, 201);
    }

    // Delete an employee skill
    public function destroy($id)
    {
        $employeeSkill = EmployeeSkill::findOrFail($id);
        $employeeSkill->delete();

        return response()->json(['message' => 'Employee skill deleted successfully']);
    }
}

<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Qualification;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EmployeeQualification>
 */
class EmployeeQualificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => Employee::pluck('id')->random(),
            'qualification_id' => Qualification::pluck('id')->random(),
        ];
    }
}

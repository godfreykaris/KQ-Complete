<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EmployeeSkill>
 */
class EmployeeSkillFactory extends Factory
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
            'skill_id' => Skill::pluck('id')->random(),
        ];
    }
}

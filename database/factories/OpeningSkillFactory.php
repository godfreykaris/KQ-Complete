<?php

namespace Database\Factories;

use App\Models\Opening;
use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OpeningSkill>
 */
class OpeningSkillFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'opening_id' => Opening::pluck('id')->random(),
            'skill_id' => Skill::pluck('id')->random(),
        ];
    }
}

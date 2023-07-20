<?php

namespace Database\Factories;

use App\Models\Opening;
use App\Models\Qualification;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OpeningQualification>
 */
class OpeningQualificationFactory extends Factory
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
            'qualification_id' => Qualification::pluck('id')->random(),
        ];
    }
}

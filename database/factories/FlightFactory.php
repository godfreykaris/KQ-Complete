<?php

namespace Database\Factories;

use App\Models\Airline;
use App\Models\City;
use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\FlightStatus;
use App\Models\Plane;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Flight>
 */
class FlightFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $departureTime = fake()->dateTimeBetween('now', '+2 days');
        $arrivalTime = fake()->dateTimeBetween($departureTime, '+4 day');

        return [
            'flight_number' => fake()->unique()->regexify('[A-Z]{2}\d{3}'),
            'departure_time' => $departureTime,
            'arrival_time' => $arrivalTime,
            'return_time' => fake()->dateTimeBetween($departureTime, '+30 days'),
            'is_international' => fake()->boolean(30),
            'flight_status_id' => FlightStatus::pluck('id')->random(),
            'departure_city_id' => City::pluck('id')->random(),
            'arrival_city_id' => City::pluck('id')->random(),
            'plane_id' => Plane::pluck('id')->random(),
            'airline_id' => Airline::pluck('id')->random(),

        ];
    }
}

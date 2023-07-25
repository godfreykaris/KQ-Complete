<?php

namespace Database\Factories;

use App\Models\Flight;
use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Plane;
use App\Models\FlightClass;
use App\Models\SeatLocation;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class SeatFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'seat_number' => fake()->unique()->randomNumber(3),
            'is_available' => fake()->boolean(),
            'price' => fake()->randomFloat(2, 100, 500),
            'plane_id' => Plane::pluck('id')->random(),
            'flight_id' => Flight::pluck('id')->random(),
            'flight_class_id' => FlightClass::pluck('id')->random(),
            'location_id' => SeatLocation::pluck('id')->random(),
        ];
    }
}

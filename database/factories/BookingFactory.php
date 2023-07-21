<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Flight;
use App\Models\Seat;
use App\Models\FlightClass;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            
            'email' => fake()->safeEmail,
            'booking_reference' => fake()->unique()->regexify('[A-Z0-9]{6}'),
            'booking_date' => fake()->dateTime(),
            'flight_id' => Flight::pluck('id')->random(),
            'flight_class_id' => FlightClass::pluck('id')->random(),
        ];
    }
}

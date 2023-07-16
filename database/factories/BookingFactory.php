<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Flight;
use App\Models\Seat;

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
            
            'passenger_name' => fake()->name,
            'passenger_email' => fake()->safeEmail,
            'booking_reference' => fake()->unique()->regexify('[A-Z0-9]{6}'),
            'booking_date' => fake()->dateTime(),
            'flight_id' => Flight::pluck('id')->random(),
            'seat_id' => Seat::pluck('id')->random(),
        ];
    }
}

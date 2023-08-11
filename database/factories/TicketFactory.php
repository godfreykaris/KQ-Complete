<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Flight;
use App\Models\FlightStatus;
use App\Models\Seat;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ticket_number' => 'KQ-TK-' . fake()->unique()->regexify('[A-Z0-9]{6}'),
            'ticket_price' => fake()->randomFloat(2, 100, 1000),
            'booking_reference' => 'KQ-BR-' . fake()->unique()->regexify('[A-Z0-9]{6}'),
            'boarding_pass' => fake()->unique()->regexify('[A-Z0-9]{10}'),
            'flight_status_id' => FlightStatus::pluck('id')->random(),
            'flight_id' => Flight::pluck('id')->random(),
        ];
    }
}

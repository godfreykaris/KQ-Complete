<?php

namespace Database\Seeders;

use App\Models\Booking;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PassengersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bookingId = Booking::pluck('id')->random();
        [
            'name' => fake()->name,
            'date_of_birth' => fake()->date,
            'booking_id' => $bookingId->isNotEmpty() ? $bookingId : rand(1, 20),
            
        ];
    }
}

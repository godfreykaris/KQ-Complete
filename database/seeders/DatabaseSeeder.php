<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Booking;
use App\Models\Flight;
use App\Models\Seat;
use App\Models\Ticket;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PlanesTableSeeder::class);
        $this->call(FlightClassesTableSeeder::class);
        $this->call(SeatLocationsTableSeeder::class);
        $this->call(DestinationsTableSeeder::class);
        $this->call(FlightStatusesTableSeeder::class);
        Seat::factory(100)->create();
        Flight::factory(30)->create();
        Ticket::factory(40)->create();
        Booking::factory(40)->create();
    }
}

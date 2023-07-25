<?php

namespace Database\Seeders;

use App\Models\FlightStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FlightStatusesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $flight_statuses = [
            ['name' => 'On-time'],
            ['name' => 'Delayed'],
            ['name' => 'Cancelled'],
            ['name' => 'Departed'],
        ];

        foreach($flight_statuses as $key => $value)
        {
            FlightStatus::create($value);
        }
    }
}

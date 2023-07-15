<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\FlightClass;

class FlightClassesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $flight_classes = [
            ['name' => 'Economy'],
            ['name' => 'Business'],
            ['name' => 'First Class'],
        ];

        foreach($flight_classes as $key => $value)
        {
            FlightClass::create($value);
        }
    }
}

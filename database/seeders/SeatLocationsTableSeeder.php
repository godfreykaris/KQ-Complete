<?php

namespace Database\Seeders;

use App\Models\SeatLocation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SeatLocationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $seat_locations = [
            ['name' => 'Aisle'],
            ['name' => 'Window'],
            ['name' => 'Middle'],
            ['name' => 'Front'],
            ['name' => 'Back'],
            ['name' => 'Exit Row'],
            ['name' => 'Bulkhead'],
            ['name' => 'Overwing'],
        ];

        foreach($seat_locations as $key => $value)
        {
            SeatLocation::create($value);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Plane;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $planes = [
            [
                'plane_id' => "PL-FG45738",
                'name' => 'Boeing 737',
                'model' => 'Boeing',
                'capacity' => 180,
            ],

            [
                'plane_id' => "PL-OKJGJJD5",
                'name' => 'Airbus A320',
                'model' => 'Airbus',
                'capacity' => 150,
            ],

            [
                'plane_id' => "PL-NBVHRH45",
                'name' => 'Bombardier Q400',
                'model' => 'Bombardier',
                'capacity' => 80,
            ]
        ];

        foreach($planes as $key => $value)
        {
            Plane::create($value);
        }
    }
}

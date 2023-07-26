<?php

namespace Database\Seeders;

use App\Models\Airline;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AirlinesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert sample data into the airlines table
        Airline::create([
            'name' => 'Emirates',
            'code' => 'EMR',
        ]);

        Airline::create([
            'name' => 'British Airways',
            'code' => 'BAW',
        ]);

        Airline::create([
            'name' => 'Lufthansa',
            'code' => 'LH',
        ]);

        Airline::create([
            'name' => 'Singapore Airlines',
            'code' => 'SIA',
        ]);

        Airline::create([
            'name' => 'Qatar Airways',
            'code' => 'QTR',
        ]);
    }
}

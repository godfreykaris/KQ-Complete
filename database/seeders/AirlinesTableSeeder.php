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
        $airlines = [
            [
                'name' => 'Emirates',
                'code' => 'EMR',
            ],
            [
                'name' => 'British Airways',
                'code' => 'BAW',
            ],
            [
                'name' => 'Lufthansa',
                'code' => 'LH',
            ],
            [
                'name' => 'Singapore Airlines',
                'code' => 'SIA',
            ],
            [
                'name' => 'Qatar Airways',
                'code' => 'QTR',
            ],
            // Add more airlines as needed
        ];

        foreach ($airlines as $airline) {
            Airline::create($airline);
        }
    }
}

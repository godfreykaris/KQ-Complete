<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Destination;

class DestinationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $destinations = [
            ['name' => 'Nairobi'],
            ['name' => 'Baghdad'],
            ['name' => 'Casablanca'],
        ];

        foreach($destinations as $key => $value)
        {
            Destination::create($value);
        }
    }
}

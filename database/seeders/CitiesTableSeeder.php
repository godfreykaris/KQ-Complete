<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CitiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cities = [
            [
                'name' => 'Nairobi',
                'country' => 'Kenya',
            ],
            [
                'name' => 'Baghdad',
                'country' => 'Afghanistan',
            ],
            [
                'name' => 'Casablanca',
                'country' => 'Moroco',
            ],
        ];

        foreach($cities as $key => $value)
        {
            City::create($value);
        }
    }
}

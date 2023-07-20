<?php

namespace Database\Seeders;

use App\Models\Qualification;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QualificationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define qualifications for an airline company
        $qualifications = [
            'Bachelor\'s Degree in Aeronautical Engineering',
            'Bachelor\'s Degree in Aviation Management',
            'Bachelor\'s Degree in Aviation Science',
            'Bachelor\'s Degree in Airline Operations',
            'Pilot License (ATPL)',
            'Flight Attendant Certification',
            'Air Traffic Control License',
            'Aircraft Maintenance License',
            'Aviation Safety Certification',
            'Cabin Crew Training',
            'Airline Transport Pilot License (ATPL)',
            'Aircraft Mechanic Certification',
            'Aircraft Dispatcher License',
            'Aviation Management Certification',
            'Aircraft Cabin Interior Design Certification',
            // Add more qualifications as needed
        ];

        foreach ($qualifications as $qualification) {
            Qualification::create(['name' => $qualification]);
        }
    }
}

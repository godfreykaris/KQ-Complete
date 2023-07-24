<?php

namespace Database\Seeders;

use App\Models\JobTitle;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JobTitlesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define job titles for an airline company
        $jobTitles = [
            'Pilot',
            'Co-Pilot',
            'Flight Attendant',
            'Aircraft Engineer',
            'Air Traffic Controller',
            'Airport Manager',
            'Ground Service Agent',
            'Customer Service Agent',
            'Cargo Handler',
            'Aircraft Cleaner',
            'Baggage Handler',
            'Airline Operations Manager',
            'Flight Dispatcher',
            'Maintenance Technician',
            'Ramp Agent',
            'Security Officer',
            'Flight Scheduler',
            'Crew Scheduler',
            'Sales Representative (Airline Tickets)',
            'Ticketing Agent',
            'In-Flight Services Manager',
            'Catering Coordinator (for In-Flight Meals)',
            'Flight Instructor',
            'Aviation Safety Officer',
            'Airline Marketing Specialist',
            'Airline Finance Analyst',
            'Flight Operations Coordinator',
            'Airline Crew Trainer',
            'Airline IT Support Specialist',
            'Baggage Claims Agent',
        ];

        foreach ($jobTitles as $name) {
            JobTitle::create(['name' => $name]);
        }
    }
}

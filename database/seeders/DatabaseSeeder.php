<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Booking;
use App\Models\Employee;
use App\Models\EmployeeQualification;
use App\Models\EmployeeSkill;
use App\Models\Flight;
use App\Models\Opening;
use App\Models\Qualification;
use App\Models\Seat;
use App\Models\Skill;
use App\Models\Ticket;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PlanesTableSeeder::class);
        $this->call(FlightClassesTableSeeder::class);
        $this->call(SeatLocationsTableSeeder::class);
        $this->call(DestinationsTableSeeder::class);
        $this->call(FlightStatusesTableSeeder::class);
        $this->call(BookingInquiryTypesSeeder::class);
        $this->call(JobTitlesTableSeeder::class);
        $this->call(QualificationsTableSeeder::class);
        $this->call(SkillsTableSeeder::class);
        Seat::factory(100)->create();
        Flight::factory(30)->create();
        Ticket::factory(40)->create();
        Booking::factory(40)->create();
        Employee::factory(20)->create();
        EmployeeQualification::factory(10)->create();
        EmployeeSkill::factory(10)->create();
        Opening::factory(3)->create();
    
    }
}

<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Booking;
use App\Models\Employee;
use App\Models\EmployeeQualification;
use App\Models\EmployeeSkill;
use App\Models\Flight;
use App\Models\Opening;
use App\Models\OpeningQualification;
use App\Models\OpeningSkill;
use App\Models\Seat;
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
        $this->call(CitiesTableSeeder::class);
        $this->call(FlightStatusesTableSeeder::class);
        $this->call(BookingInquiryTypesSeeder::class);
        $this->call(JobTitlesTableSeeder::class);
        $this->call(QualificationsTableSeeder::class);
        $this->call(SkillsTableSeeder::class);
        $this->call(AirlinesTableSeeder::class);
        $this->call(UserRolesTableSeeder::class);
        Seat::factory(200)->create();
        Flight::factory(5)->create();
        Ticket::factory(40)->create();
        Booking::factory(40)->create();
        Employee::factory(100)->create();
        EmployeeQualification::factory(200)->create();
        EmployeeSkill::factory(200)->create();
        Opening::factory(20)->create();
        OpeningQualification::factory(50)->create();
        OpeningSkill::factory(50)->create();
    }
}

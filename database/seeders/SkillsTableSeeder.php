<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SkillsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define skills for an airline company
        $skills = [
            'Aircraft Maintenance',
            'Flight Planning',
            'Safety Procedures',
            'Customer Service',
            'Aviation Regulations',
            'Crisis Management',
            'Teamwork',
            'Communication Skills',
            'Problem-Solving',
            'Leadership',
            'Navigation Skills',
            'Weather Forecasting',
            'Air Traffic Control',
            'Technical Troubleshooting',
            'Language Proficiency',
            'Computer Skills',
            'First Aid Training',
            // Add more skills as needed
        ];

        foreach ($skills as $skill) {
            Skill::create(['name' => $skill]);
        }
    }
}

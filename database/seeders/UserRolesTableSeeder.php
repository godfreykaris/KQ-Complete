<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserRolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user_roles = [
            ['name' => 'admin'],
            ['name' => 'hrm'],
            ['name' => 'normal'],
        ];

        foreach($user_roles as $key => $value)
        {
            Role::create($value);
        }
    }
}

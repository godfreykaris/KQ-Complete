<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'date_of_birth',
        'address',
        'job_title_id',
    ];

    // Relationship with JobTitle
    public function jobTitle()
    {
        return $this->belongsTo(JobTitle::class);
    }

    // Relationship with Qualifications (Many-to-Many)
    public function qualifications()
    {
        return $this->belongsToMany(Qualification::class, 'employee_qualifications');
    }

    // Relationship with Skills (Many-to-Many)
    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'employee_skills');
    }
}

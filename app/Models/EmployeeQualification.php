<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeQualification extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'qualification_id',
    ];

    public function qualification()
    {
        return $this->belongsTo(Qualification::class);
    }
}

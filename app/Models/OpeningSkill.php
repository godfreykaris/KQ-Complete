<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpeningSkill extends Model
{
    use HasFactory;

    protected $fillable = [
        'opening_id',
        'skill_id',
    ];

    public function qualification()
    {
        return $this->belongsTo(Qualification::class);
    }
}

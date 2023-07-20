<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpeningQualification extends Model
{
    use HasFactory;

    protected $fillable = [
        'opening_id',
        'qualification_id',
    ];

    public function qualification()
    {
        return $this->belongsTo(Qualification::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Passenger extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'passenger_id',
        'name',
        'identification_number',
        'passport_number',
        'date_of_birth',
        'seat_id',
    ];

    public function seat()
    {
        return $this->belongsTo(Seat::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Str;

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

    public function generatePassengerId()
    {
        $passengerId = 'KQ-P-' . strtoupper(Str::random(15));

        // Check if the generated booking reference already exists in the database
        while (Passenger::where('passenger_id', $passengerId)->exists()) 
        {
            $passengerId = 'KQ-P-' . strtoupper(Str::random(15));
        }
    
           
        return $passengerId;
    }
}

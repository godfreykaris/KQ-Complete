<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'flight_id',
        'flight_class_id',
        'seat_id',
        'passenger_name',
        'passenger_email',
        'date_of_birth',
        'booking_reference',
        'booking_date',
        
    ];

    public function passengers()
    {
        return $this->hasMany(Passenger::class);
    }
    
}

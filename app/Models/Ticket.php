<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_number',
        'ticket_price',
        'booking_reference',
        'boarding_pass',
        'flight_status_id',
        'flight_id',
    ];

    public function flightStatus()
    {
        return $this->belongsTo(FlightStatus::class, 'flight_status_id');
    }

    public function flight()
    {
        return $this->belongsTo(Flight::class, 'flight_id');
    }

    
    
}

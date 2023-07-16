<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_number',
        'passenger_name',
        'passenger_email',
        'ticket_price',
        'booking_reference',
        'boarding_pass',
        'flight_status_id',
        'flight_id',
        'seat_id',
    ];
    
}

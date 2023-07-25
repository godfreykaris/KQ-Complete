<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seat extends Model
{
    use HasFactory;

    protected $fillable = [
        'seat_number', 'price', 'is_available', 'plane_id', 'flight_id', 'flight_class_id', 'location_id',
    ];

    public function plane()
    {
        return $this->belongsTo(Plane::class);
    }

    public function flight()
    {
        return $this->belongsTo(Flight::class);
    }

    public function flightClass()
    {
        return $this->belongsTo(FlightClass::class);
    }

    public function location()
    {
        return $this->belongsTo(SeatLocation::class);
    }
}

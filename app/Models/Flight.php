<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    use HasFactory;

    protected $fillable = [
        'flight_number',
        'airline_id',
        'plane_id',
        'is_international',
        'duration',
        'departure_time',
        'arrival_time',
        'flight_status_id',
        'departure_city_id',
        'arrival_city_id',
        
    ];

    
    // Event listener for when a flight is created
    protected static function booted()
    {
        static::created(function ($flight) 
        {
            $flight->createFlightSeats();
        });

        
    }

    public function createFlightSeats()
    {
        // Get the plane associated with the flight
        $plane = $this->plane;

        // Replicate seats from the plane to the seats table
        $seats = $plane->seats->map(function ($seat) {
            return [
                'seat_number' => $seat->seat_number,
                'is_available' => true,
                'price' => $seat->price,
                'plane_id' => null, // Set plane_id to null for seats associated with a flight
                'flight_id' => $this->id,
                'flight_class_id' => $seat->flight_class_id,
                'location_id' => $seat->location_id,
            ];
        });

        // Insert replicated seats into the seats table
        Seat::insert($seats->toArray());
    }
    
    // Define the relationship with the Plane model
    public function plane()
    {
        return $this->belongsTo(Plane::class);
    }

    // Define the relationship with the FlightStatus model
    public function flightStatus()
    {
        return $this->belongsTo(FlightStatus::class, 'flight_status_id');
    }

    // Define the relationship with the City model for departure city
    public function departureCity()
    {
        return $this->belongsTo(City::class, 'departure_city_id');
    }

    // Define the relationship with the City model for arrival city
    public function arrivalCity()
    {
        return $this->belongsTo(City::class, 'arrival_city_id');
    }
}

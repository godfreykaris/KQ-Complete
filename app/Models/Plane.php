<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plane extends Model
{
    use HasFactory;

    protected $fillable = [
        'plane_id',
        'name',
        'model',
        'capacity'
        
    ];

    // Define the relationship with the Flight model
    public function flights()
    {
        return $this->hasMany(Flight::class);
    }

    // Define the relationship with the Seat model
    public function seats()
    {
        return $this->hasMany(Seat::class);
    }
}

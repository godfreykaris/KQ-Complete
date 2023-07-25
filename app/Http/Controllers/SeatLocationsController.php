<?php

namespace App\Http\Controllers;

use App\Models\SeatLocation;
use Illuminate\Http\Request;

class SeatLocationsController extends BaseController
{
    public function __construct()
    {
        parent::__construct(new SeatLocation());
    }

}

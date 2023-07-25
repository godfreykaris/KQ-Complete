<?php

namespace App\Http\Controllers;

use App\Models\FlightStatus;
use Illuminate\Http\Request;

class FlightStatusesController extends BaseController
{
    public function __construct()
    {
        parent::__construct(new FlightStatus());
    }
}

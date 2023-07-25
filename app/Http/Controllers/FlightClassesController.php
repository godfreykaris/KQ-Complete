<?php

namespace App\Http\Controllers;

use App\Models\FlightClass;
use Illuminate\Http\Request;

class FlightClassesController extends BaseController
{
    public function __construct()
    {
        parent::__construct(new FlightClass());
    }
}

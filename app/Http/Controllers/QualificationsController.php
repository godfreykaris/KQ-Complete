<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Flight;
use App\Models\Qualification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class QualificationsController extends BaseController
{
    public function __construct()
    {
        parent::__construct(new Qualification());
    }

}

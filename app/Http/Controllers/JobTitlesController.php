<?php

namespace App\Http\Controllers;

use App\Models\JobTitle;
use Illuminate\Http\Request;

class JobTitlesController extends BaseController
{
    public function __construct()
    {
        parent::__construct(new JobTitle());
    }
}

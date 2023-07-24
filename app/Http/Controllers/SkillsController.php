<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SkillsController extends BaseController
{
    public function __construct()
    {
        parent::__construct(new Skill());
    }

}

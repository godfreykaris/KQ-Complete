<?php

namespace App\Http\Controllers;

use App\Models\JobTitle;
use Illuminate\Http\Request;

class JobTitlesController extends Controller
{
    public function index()
    {
        // Retrieve all job titles from the database
        $jobTitles = JobTitle::all();

        return response()->json(['job_titles' => $jobTitles]);
    }

    public function store(Request $request)
    {
        // Validate the request data (if needed)

        // Create a new job title
        $jobTitle = JobTitle::create([
            'title' => $request->input('title'),
        ]);

        return response()->json(['job_title' => $jobTitle, 'message' => 'Job title created successfully']);
    }
}

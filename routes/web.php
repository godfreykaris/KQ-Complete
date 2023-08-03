<?php

use App\Http\Controllers\AccountBasedBookingInquiriesController;
use App\Http\Controllers\AirlineController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FlightsController;
use App\Http\Controllers\TicketsController;
use App\Http\Controllers\BookingsController;
use App\Http\Controllers\CitiesController;
use App\Http\Controllers\EmployeesController;
use App\Http\Controllers\FlightClassesController;
use App\Http\Controllers\FlightStatusesController;
use App\Http\Controllers\PlanesController;
use App\Http\Controllers\GuestBookingInquiryController;
use App\Http\Controllers\JobTitlesController;
use App\Http\Controllers\OpeningController;
use App\Http\Controllers\PassengersController;
use App\Http\Controllers\PayPalController;
use App\Http\Controllers\QualificationsController;
use App\Http\Controllers\SeatLocationsController;
use App\Http\Controllers\SeatsController;
use App\Http\Controllers\SkillsController;
use App\Http\Controllers\UsersController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/


// Define a specific route for your React app (root route)
Route::get('/', function () {
    return view('app');
});

// Catch-all route for other paths that should be handled by React Router
Route::get('/{any}', function () {
    return view('app'); 
})->where('any', '.*');
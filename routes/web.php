<?php

use App\Http\Controllers\AccountBasedBookingInquiriesController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FlightsController;
use App\Http\Controllers\TicketsController;
use App\Http\Controllers\BookingsController;
use App\Http\Controllers\CitiesController;
use App\Http\Controllers\EmployeesController;
use App\Http\Controllers\GuestBookingInquiryController;
use App\Http\Controllers\JobTitlesController;
use App\Http\Controllers\OpeningController;
use App\Http\Controllers\PassengersController;
use App\Http\Controllers\QualificationsController;
use App\Http\Controllers\SkillsController;
use App\Http\Controllers\UsersController;
use App\Models\Qualification;

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

Route::get('/', function () {
    return view('app');
});

Route::post('/users/register', [UsersController::class, 'register'])->name('user_register.store');

Route::get('/flights', [FlightsController::class, 'index']);

Route::get('/ticket/{ticket_number}', [TicketsController::class, 'show']);
Route::get('/tickets/{ticket_number}/report', [TicketsController::class, 'generateTicketReport'])->name('tickets.report');

Route::post('/cities/change/{cityId}', [CitiesController::class, 'update'])->name('cities.update');
Route::post('/cities/add', [CitiesController::class, 'store'])->name('cities.store');
Route::delete('/cities/delete/{cityId}', [CitiesController::class, 'delete'])->name('cities.delete');
Route::get('/arrival_cities/{departure_city}', [CitiesController::class, 'getArrivalCities'])->name('cities.get_arrival_cities');
Route::get('/cities', [CitiesController::class, 'index'])->name('cities.all');
Route::get('/cities/{cityName}/{cityCountry}', [CitiesController::class, 'show'])->name('cities.show');


Route::post('/bookings', [BookingsController::class, 'store'])->name('bookings.store');
Route::put('/bookings/{bookingReference}', [BookingsController::class, 'update'])->name('bookings.update');
Route::delete('/bookings/{bookingReference}', [BookingsController::class, 'destroy'])->name('bookings.destroy');

Route::post('/booking_inquiry/guest', [GuestBookingInquiryController::class, 'store'])->name('guest_booking_inquiry.store');
Route::post('/booking_inquiry/registered_user', [AccountBasedBookingInquiriesController::class, 'store'])->name('account_based_booking_inquiry.store');

Route::post('/passengers/add/{booking_reference}', [PassengersController::class, 'addPassengers'])->name('passengers.add');
Route::delete('/passengers/delete/{passengerId}', [PassengersController::class, 'deletePassenger'])->name('passengers.delete');
Route::put('/passengers/change/{passengerId}', [PassengersController::class, 'updatePassenger'])->name('passengers.update');

Route::get('/employees', [EmployeesController::class, 'index'])->name('employees.all');
Route::get('/employees/{employeeId}', [EmployeesController::class, 'show'])->name('employees.fetch_one');
Route::post('/employees/add', [EmployeesController::class, 'store'])->name('employees.add');
Route::delete('/employees/delete/{employeeId}', [EmployeesController::class, 'destroy'])->name('employees.delete');
Route::put('/employees/change/{employeeId}', [EmployeesController::class, 'update'])->name('employees.update');

Route::post('/qualifications/change/{qualificationId}', [QualificationsController::class, 'update'])->name('qualifications.update');
Route::post('/qualifications/add', [QualificationsController::class, 'store'])->name('qualifications.store');
Route::delete('/qualifications/delete/{qualificationId}', [QualificationsController::class, 'delete'])->name('qualifications.delete');
Route::get('/qualifications', [QualificationsController::class, 'index'])->name('qualifications.all');
Route::get('/qualifications/{qualificationName}', [QualificationsController::class, 'show'])->name('qualifications.show');

Route::post('/skills/change/{skillId}', [SkillsController::class, 'update'])->name('skills.update');
Route::post('/skills/add', [SkillsController::class, 'store'])->name('skills.store');
Route::delete('/skills/delete/{skillId}', [SkillsController::class, 'delete'])->name('skills.delete');
Route::get('/skills', [SkillsController::class, 'index'])->name('skills.all');
Route::get('/skills/{skillName}', [SkillsController::class, 'show'])->name('skills.show');

Route::post('/skills/change/{jobTitleId}', [JobTitlesController::class, 'update'])->name('jobTitles.update');
Route::post('/jobTitles/add', [JobTitlesController::class, 'store'])->name('jobTitles.store');
Route::delete('/jobTitles/delete/{jobTitleId}', [JobTitlesController::class, 'delete'])->name('jobTitles.delete');
Route::get('/jobTitles', [JobTitlesController::class, 'index'])->name('jobTitles.all');
Route::get('/jobTitles/{jobTitleName}', [JobTitlesController::class, 'show'])->name('jobTitles.show');

Route::get('/openings/match_employees/{openingId}', [OpeningController::class, 'getMatchingEmployees'])->name('openings.match_employees');
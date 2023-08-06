<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
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
use App\Http\Controllers\AccountBasedBookingInquiriesController;
use App\Http\Controllers\AirlineController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::post('/users/login', [UsersController::class, 'login'])->name('users.login');
Route::post('/users/register', [UsersController::class, 'register'])->name('user_register.store');

Route::middleware('auth:api')->group(function () {
    Route::post('/users/logout', [UsersController::class, 'logout'])->name('users.logout');
    Route::get('/users', [UsersController::class, 'listUsers'])->name('users.all');
    Route::get('/users/{userId}', [UsersController::class, 'getUser'])->name('users.show');
    Route::delete('/users/delete/{userId}', [UsersController::class, 'deleteUser'])->name('users.delete');
    Route::put('/users/change/{userId}', [UsersController::class, 'updateUser'])->name('users.update');
    Route::get('/users/search', [UsersController::class, 'searchUsers'])->name('users.search');
    Route::get('/users/profile', [UsersController::class, 'viewUserProfile'])->name('users.profile');
    Route::get('/users/payment_methods', [UsersController::class, 'userPaymentMethods'])->name('users.payment_methods');
    Route::post('/users/payment_methods/add', [UsersController::class, 'addPaymentMethod'])->name('users.payment_methods.add');
    Route::delete('/users/payment_methods/delete/{paymentId}', [UsersController::class, 'deletePaymentMethod'])->name('users.payment_methods.delete');
    Route::get('/users/wallet', [UsersController::class, 'userWallet'])->name('users.wallet');
    Route::post('/users/reward_points', [UsersController::class, 'rewardPointsForBookingFlight'])->name('users.reward_points');
    Route::put('/users/profile/update', [UsersController::class, 'updateCurrentUserProfile'])->name('users.profile.update');
    Route::get('/users/booking_history', [UsersController::class, 'userBookingHistory'])->name('users.booking_history');
});

Route::middleware('auth:api')->group(function () {
    Route::put('/flights/change/{flightId}', [FlightsController::class, 'update'])->name('flights.update');
    Route::post('/flights/add', [FlightsController::class, 'store'])->name('flights.store');
    Route::delete('/flights/delete/{flightId}', [FlightsController::class, 'delete'])->name('flights.delete');
});

Route::get('/flights', [FlightsController::class, 'index'])->name('flights.all');
Route::get('/flights/{flightId}', [FlightsController::class, 'show'])->name('flights.show');
Route::get('/flights/byDepartureCityId/{departureCityId}', [FlightsController::class, 'getFlightsByDepartureCity'])->name('flights.getFlightsByDepartureCity');
Route::get('/flights/byHours/{hours}', [FlightsController::class, 'getFlightsDepartingWithinHours'])->name('flights.getFlightsDepartingWithinHours');
Route::get('/flights/byDepartureDate/{departureDate}', [FlightsController::class, 'getFlightsByDepartureDate'])->name('flights.getFlightsByDepartureDate');

Route::middleware('auth:api')->group(function () {
    Route::put('/flightStatuses/change/{flightStatusId}', [FlightStatusesController::class, 'update'])->name('flightStatuses.update');
    Route::post('/flightStatuses/add', [FlightStatusesController::class, 'store'])->name('flightStatuses.store');
    Route::delete('/flightStatuses/delete/{flightStatusId}', [FlightStatusesController::class, 'delete'])->name('flightStatuses.delete');
});

Route::get('/flightStatuses', [FlightStatusesController::class, 'index'])->name('flightStatuses.all');
Route::get('/flightStatuses/{flightStatusName}', [FlightStatusesController::class, 'show'])->name('flightStatuses.show');

Route::middleware('auth:api')->group(function () {
    Route::put('/flightClasses/change/{flightClassId}', [FlightClassesController::class, 'update'])->name('flightClasses.update');
    Route::post('/flightClasses/add', [FlightClassesController::class, 'store'])->name('flightClasses.store');
    Route::delete('/flightClasses/delete/{flightClassId}', [FlightClassesController::class, 'delete'])->name('flightClasses.delete');
});

Route::get('/flightClasses', [FlightClassesController::class, 'index'])->name('flightClasses.all');
Route::get('/flightClasses/{flightClassName}', [FlightClassesController::class, 'show'])->name('flightClasses.show');

Route::middleware('auth:api')->group(function () {
    Route::put('/planes/change/{planeId}', [PlanesController::class, 'update'])->name('planes.update');
    Route::post('/planes/add', [PlanesController::class, 'store'])->name('planes.store');
    Route::delete('/planes/delete/{planeId}', [PlanesController::class, 'delete'])->name('planes.delete');    
});

Route::get('/planes', [PlanesController::class, 'index'])->name('planes.all');
Route::get('/planes/{planeId}', [PlanesController::class, 'show'])->name('planes.show');


Route::get('/ticket/{ticket_number}', [TicketsController::class, 'show']);
Route::get('/tickets/{ticket_number}/report', [TicketsController::class, 'generateTicketReport'])->name('tickets.report');

Route::middleware('auth:api')->group(function () {
    Route::put('/cities/change/{cityId}', [CitiesController::class, 'update'])->name('cities.update');
    Route::post('/cities/add', [CitiesController::class, 'store'])->name('cities.store');
    Route::delete('/cities/delete/{cityId}', [CitiesController::class, 'delete'])->name('cities.delete');
});

Route::get('/arrival_cities/{departure_city}', [CitiesController::class, 'getArrivalCities'])->name('cities.get_arrival_cities');
Route::get('/cities', [CitiesController::class, 'index'])->name('cities.all');
Route::get('/cities/{cityName}/{cityCountry}', [CitiesController::class, 'show'])->name('cities.show');

Route::middleware('auth:api')->group(function () {
    Route::put('/airlines/change/{airlineId}', [AirlineController::class, 'update'])->name('airlines.update');
    Route::post('/airlines/add', [AirlineController::class, 'store'])->name('airlines.store');
    Route::delete('/airlines/delete/{airlineId}', [AirlineController::class, 'delete'])->name('airlines.delete');
});

Route::get('/airlines', [AirlineController::class, 'index'])->name('airlines.all');
Route::get('/airlines/{airlineCode}', [AirlineController::class, 'show'])->name('airlines.show');

Route::middleware('auth:api')->group(function () {
    Route::put('/seatLocations/change/{seatLocationId}', [SeatLocationsController::class, 'update'])->name('seatLocations.update');
    Route::post('/seatLocations/add', [SeatLocationsController::class, 'store'])->name('seatLocations.store');
    Route::delete('/seatLocations/delete/{seatLocationId}', [SeatLocationsController::class, 'delete'])->name('seatLocations.delete');
});

Route::get('/seatLocations', [SeatLocationsController::class, 'index'])->name('seatLocations.all');
Route::get('/seatLocations/{seatLocationName}', [SeatLocationsController::class, 'show'])->name('seatLocations.show');

Route::middleware('auth:api')->group(function () {
    Route::put('/seats/change/{planeId}/{seatNumber}', [SeatsController::class, 'update'])->name('seats.update');
    Route::post('/seats/add', [SeatsController::class, 'store'])->name('seats.store');
    Route::delete('/seats/delete/{seatId}', [SeatsController::class, 'delete'])->name('seats.delete');
});

Route::get('/seats/{planeId}', [SeatsController::class, 'index'])->name('seats.plane_seats');
Route::get('/seats/{seatNumber}/{planeId}', [SeatsController::class, 'show'])->name('seats.show');

Route::middleware('auth:api')->group(function () {
    Route::post('/employees/add', [EmployeesController::class, 'store'])->name('employees.add');
    Route::delete('/employees/delete/{employeeId}', [EmployeesController::class, 'destroy'])->name('employees.delete');
    Route::put('/employees/change/{employeeId}', [EmployeesController::class, 'update'])->name('employees.update');
});

Route::get('/employees', [EmployeesController::class, 'index'])->name('employees.all');
Route::get('/employees/{employeeId}', [EmployeesController::class, 'show'])->name('employees.fetch_one');

Route::middleware('auth:api')->group(function () {
    Route::put('/qualifications/change/{qualificationId}', [QualificationsController::class, 'update'])->name('qualifications.update');
    Route::post('/qualifications/add', [QualificationsController::class, 'store'])->name('qualifications.store');
    Route::delete('/qualifications/delete/{qualificationId}', [QualificationsController::class, 'delete'])->name('qualifications.delete');
});

Route::get('/qualifications', [QualificationsController::class, 'index'])->name('qualifications.all');
Route::get('/qualifications/{qualificationName}', [QualificationsController::class, 'show'])->name('qualifications.show');

Route::middleware('auth:api')->group(function () {
    Route::put('/skills/change/{skillId}', [SkillsController::class, 'update'])->name('skills.update');
    Route::post('/skills/add', [SkillsController::class, 'store'])->name('skills.store');
    Route::delete('/skills/delete/{skillId}', [SkillsController::class, 'delete'])->name('skills.delete');
});

Route::get('/skills', [SkillsController::class, 'index'])->name('skills.all');
Route::get('/skills/{skillName}', [SkillsController::class, 'show'])->name('skills.show');

Route::middleware('auth:api')->group(function () {
    Route::put('/jobTitles/change/{jobTitleId}', [JobTitlesController::class, 'update'])->name('jobTitles.update');
    Route::post('/jobTitles/add', [JobTitlesController::class, 'store'])->name('jobTitles.store');
    Route::delete('/jobTitles/delete/{jobTitleId}', [JobTitlesController::class, 'delete'])->name('jobTitles.delete');
});

Route::get('/jobTitles', [JobTitlesController::class, 'index'])->name('jobTitles.all');
Route::get('/jobTitles/{jobTitleName}', [JobTitlesController::class, 'show'])->name('jobTitles.show');

Route::middleware('auth:api')->group(function () {
    Route::put('/openings/change/{openingId}', [OpeningController::class, 'update'])->name('openings.update');
    Route::post('/openings/add', [OpeningController::class, 'store'])->name('openings.store');
    Route::delete('/openings/delete/{openingId}', [OpeningController::class, 'delete'])->name('openings.delete');
    Route::get('/openings/match_employees/{openingId}', [OpeningController::class, 'getMatchingEmployees'])->name('openings.match_employees');
});

Route::get('/openings', [OpeningController::class, 'index'])->name('openings.all');
Route::get('/openings/{openingId}', [OpeningController::class, 'show'])->name('openings.show');

Route::post('/bookings', [BookingsController::class, 'store'])->name('bookings.store');
Route::put('/bookings/{bookingReference}', [BookingsController::class, 'update'])->name('bookings.update');
Route::delete('/bookings/{bookingReference}', [BookingsController::class, 'destroy'])->name('bookings.destroy');

Route::post('/booking_inquiry/guest', [GuestBookingInquiryController::class, 'store'])->name('guest_booking_inquiry.store');
Route::post('/booking_inquiry/registered_user', [AccountBasedBookingInquiriesController::class, 'store'])->name('account_based_booking_inquiry.store');

Route::post('/passengers/add/{booking_reference}', [PassengersController::class, 'addPassengers'])->name('passengers.add');
Route::delete('/passengers/delete/{passengerId}', [PassengersController::class, 'deletePassenger'])->name('passengers.delete');
Route::put('/passengers/change/{passengerId}', [PassengersController::class, 'updatePassenger'])->name('passengers.update');

Route::get('/payment/create', [PayPalController::class,'createPayment'])->name('payment.create');
Route::get('/payment/success', [PayPalController::class, 'handlePaymentResponse'])->name('payment.response');
Route::get('/payment/cancel', function () {
    return response()->json(['message' => 'Payment canceled.'], 200);
});


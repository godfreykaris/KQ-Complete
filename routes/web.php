<?php

use App\Http\Controllers\DestinationsController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FlightsController;
use App\Http\Controllers\TicketsController;
use App\Http\Controllers\BookingsController;
use App\Http\Controllers\GuestBookingInquiryController;
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

Route::get('/', function () {
    return view('app');
});

Route::post('/users/register', [UsersController::class, 'store'])->name('user_register.store');

Route::get('/flights', [FlightsController::class, 'index']);

Route::get('/ticket/{ticket_number}', [TicketsController::class, 'show']);

Route::get('/available_destinations/{departure_destination}', [DestinationsController::class, 'show']);

Route::post('/bookings', [BookingsController::class, 'store'])->name('bookings.store');
Route::put('/bookings/{bookingReference}', [BookingsController::class, 'update'])->name('bookings.update');
Route::delete('/bookings/{bookingReference}', [BookingsController::class, 'destroy'])->name('bookings.destroy');

Route::post('/booking_inquiry/guest', [GuestBookingInquiryController::class, 'store'])->name('guest_booking_inquiry.store');


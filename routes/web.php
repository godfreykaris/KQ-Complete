<?php

use App\Http\Controllers\AccountBasedBookingInquiriesController;
use App\Http\Controllers\AirlineController;
use Illuminate\Support\Facades\Route;

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

require __DIR__.'/api.php';

// Define a specific route for your React app (root route)
Route::get('/', function () {
    return view('app');
});

// Catch-all route for other paths that should be handled by React Router
Route::get('/{any}', function () {
    return view('app'); 
})->where('any', '.*');
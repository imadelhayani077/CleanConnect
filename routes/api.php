<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AddresseController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;

// 1. Public Routes (No login required)
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
Route::post('/register', [RegisteredUserController::class, 'store'])->name('register');
// 2. Protected Routes (Must be logged in)
Route::middleware(['auth:sanctum'])->group(function () {

    // A. Shared Routes (Anyone logged in can access)
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);


    // B. CLIENT Routes (Only users with role = 'client')
    Route::middleware(['role:client'])->group(function () {
        // Only clients can add an address
        Route::post('/addresses', [AddresseController::class, 'store']);
        // Only clients can make a booking
        Route::post('/bookings', [BookingController::class, 'store']);
    });


    // C. SWEEPSTAR Routes (Only users with role = 'sweepstar')
    Route::middleware(['role:sweepstar'])->group(function () {
        // Sweepstar specific routes...
        Route::get('/sweepstar/dashboard', [DashboardController::class, 'sweepstarJobs']);
        Route::get('/my-jobs', [BookingController::class, 'assignedJobs']);
    });


    // D. ADMIN Routes (Only users with role = 'admin')
    Route::middleware(['role:admin'])->group(function () {
        // Admin can see everything
        Route::get('/admin/dashboard-stats', [DashboardController::class, 'adminStats']);
        Route::get('/all-users', [UserController::class, 'index']);
    });

});






// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
require __DIR__.'/auth.php';







<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ServiceController; // <--- Import this
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 1. Public Routes
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
Route::post('/register', [RegisteredUserController::class, 'store'])->name('register');

// 2. Protected Routes (Must be logged in)
Route::middleware(['auth:sanctum'])->group(function () {

    // --- A. Core Data ---
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // --- B. Services ---
    // Fetch all services (for the Booking Form)
    Route::get('/services', [ServiceController::class, 'index']);
    // Create service (Admin only - basic check inside controller or add middleware here)
    Route::post('/services', [ServiceController::class, 'store']);

    // --- C. Addresses ---
    Route::apiResource('addresses', AddressController::class);

    // --- D. Bookings ---
    Route::apiResource('bookings', BookingController::class);

    // --- E. Sweepstar Specifics ---
    Route::get('/sweepstar/available-jobs', [BookingController::class, 'availableJobs']);
    Route::get('/sweepstar/my-schedule', [BookingController::class, 'mySchedule']);
    Route::post('/bookings/{id}/accept', [BookingController::class, 'acceptJob']);


    // --- F. ADMIN Routes (Role Middleware) ---
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/admin/dashboard-stats', [DashboardController::class, 'adminStats']);
        Route::get('/admin/users', [UserController::class, 'index']);
        // The main 'index' in BookingController already handles Admin logic,
        // so /bookings is sufficient, but you can keep specific admin routes if preferred.
    });

    // --- G. SWEEPSTAR Routes (Role Middleware) ---
    Route::middleware(['role:sweepstar'])->group(function () {
        Route::get('/sweepstar/dashboard', [DashboardController::class, 'sweepstarJobs']);
    });

});

require __DIR__.'/auth.php';

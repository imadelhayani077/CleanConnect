<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AddressController; // Fixed spelling
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 1. Public Routes (No login required)
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
Route::post('/register', [RegisteredUserController::class, 'store'])->name('register');

// 2. Protected Routes (Must be logged in)
Route::middleware(['auth:sanctum'])->group(function () {

    // --- A. Shared Core Features (Available to authorized users) ---

    // User Profile
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // ADDRESSES: Handles GET, POST, PUT, DELETE
    // The AddressController protects these (only owner can edit/delete)
    Route::apiResource('addresses', AddressController::class);

    // BOOKINGS: Handles GET, POST, PUT, DELETE
    // The BookingController creates specific logic:
    // - Clients see only their bookings.
    // - Admins see all bookings.
    Route::apiResource('bookings', BookingController::class);


    // --- B. ADMIN Routes (Only users with role = 'admin') ---
    Route::middleware(['role:admin'])->group(function () {

        // Dashboard Statistics
        Route::get('/admin/dashboard-stats', [DashboardController::class, 'adminStats']);

        // Manage Users
        Route::get('/admin/users', [UserController::class, 'index']);

        // Admin Booking Manager (Matches your React AdminApi.js)
        // We point this to the same 'index' function, which detects you are an admin and shows everything.
        Route::get('/admin/bookings', [BookingController::class, 'index']);

        // Admin Update Status (Specific route if not using standard PUT)
        Route::put('/admin/bookings/{booking}/status', [BookingController::class, 'updateStatus']);
    });


    // --- C. SWEEPSTAR Routes (Only users with role = 'sweepstar') ---
    Route::middleware(['role:sweepstar'])->group(function () {
        Route::get('/sweepstar/dashboard', [DashboardController::class, 'sweepstarJobs']);

        // View assigned jobs
        Route::get('/my-jobs', [BookingController::class, 'index']);
    });

});

require __DIR__.'/auth.php';

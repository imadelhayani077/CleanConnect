<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SweepstarProfileController;

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
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::get('/user/dashboard-stats', [DashboardController::class, 'clientStats']);
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // --- B. Reviews ---
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    // --- C. General Resources (Accessible by Clients & Sweepstars) ---
    // Services (READ ONLY for standard users)
    Route::get('/services', [ServiceController::class, 'index']);

    // Addresses
    Route::apiResource('addresses', AddressController::class);

    // Bookings (Standard CRUD + Cancel)
    // Note: The 'index' method in BookingController now handles the Admin view too.
    Route::apiResource('bookings', BookingController::class);
    Route::post('/bookings/{id}/cancel', [BookingController::class, 'cancel']);

    // --- D. User Actions ---
    Route::post('/sweepstar/apply', [SweepstarProfileController::class, 'apply']);


    // --- E. ADMIN Routes (Role: Admin) ---
    Route::middleware(['role:admin'])->group(function () {
        // 1. Dashboard & Users
        Route::get('/admin/dashboard-stats', [DashboardController::class, 'adminStats']);
        Route::get('/admin/users', [UserController::class, 'index']);
        Route::get('/admin/users/{id}', [UserController::class, 'show']);

        // 2. Service Management (MOVED HERE FOR SECURITY)
        Route::post('/services', [ServiceController::class, 'store']);
        Route::put('/services/{id}', [ServiceController::class, 'update']);
        Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

        // 3. Sweepstar Applications Management
        Route::get('/admin/applications', [SweepstarProfileController::class, 'pendingApplications']);
        Route::post('/admin/applications/{id}/approve', [SweepstarProfileController::class, 'approve']);
        Route::delete('/admin/applications/{id}/reject', [SweepstarProfileController::class, 'reject']);
    });


    // --- F. SWEEPSTAR Routes (Role: Sweepstar) ---
    Route::middleware(['role:sweepstar'])->group(function () {
        // Dashboard
        Route::get('/sweepstar/dashboard-stats', [DashboardController::class, 'sweepstarJobs']);
        Route::post('/sweepstar/availability', [SweepstarProfileController::class, 'toggleAvailability']);
        // Job Operations
        Route::get('/sweepstar/available-jobs', [BookingController::class, 'availableJobs']);
        Route::get('/sweepstar/my-schedule', [BookingController::class, 'mySchedule']);
        Route::post('/bookings/{id}/accept', [BookingController::class, 'acceptJob']);
        Route::post('/bookings/{id}/complete', [BookingController::class, 'completeJob']);
    });

});

require __DIR__.'/auth.php';

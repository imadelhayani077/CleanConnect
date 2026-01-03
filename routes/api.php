<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\DashboardController;
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
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // --- B. User Actions ---
    // Anyone logged in can apply to be a Sweepstar
    Route::post('/sweepstar/apply', [SweepstarProfileController::class, 'apply']);

    // --- C. General Resources ---
    Route::get('/services', [ServiceController::class, 'index']);
    Route::post('/services', [ServiceController::class, 'store']); // Suggestion: Move to Admin group later
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);
    Route::put('/services/{id}', [ServiceController::class, 'update']);
    Route::apiResource('addresses', AddressController::class);
    Route::apiResource('bookings', BookingController::class);


    // --- D. ADMIN Routes (Role: Admin) ---
    Route::middleware(['role:admin'])->group(function () {
        // Dashboard & Users
        Route::get('/admin/dashboard-stats', [DashboardController::class, 'adminStats']);
        Route::get('/admin/users', [UserController::class, 'index']);

        // Sweepstar Applications Management
        Route::get('/admin/applications', [SweepstarProfileController::class, 'pendingApplications']);
        Route::post('/admin/applications/{id}/approve', [SweepstarProfileController::class, 'approve']);
        Route::delete('/admin/applications/{id}/reject', [SweepstarProfileController::class, 'reject']);
    });


    // --- E. SWEEPSTAR Routes (Role: Sweepstar) ---
    Route::middleware(['role:sweepstar'])->group(function () {
        // Dashboard
        Route::get('/sweepstar/dashboard', [DashboardController::class, 'sweepstarJobs']);

        // Job Management (Moved here for better security/organization)
        Route::get('/sweepstar/available-jobs', [BookingController::class, 'availableJobs']);
        Route::get('/sweepstar/my-schedule', [BookingController::class, 'mySchedule']);
        Route::post('/bookings/{id}/accept', [BookingController::class, 'acceptJob']);
    });

});

require __DIR__.'/auth.php';

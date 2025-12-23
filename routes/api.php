<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Symfony\Contracts\Service\Attribute\Required;

Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
require __DIR__.'/auth.php';

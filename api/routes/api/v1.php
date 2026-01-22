<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\PostController;

/*
|--------------------------------------------------------------------------
| API V1 Routes
|--------------------------------------------------------------------------
|
| Routes for API version 1.
|
*/

// Public routes with auth rate limiter (5/min - brute force protection)
Route::middleware('throttle:auth')->group(function (): void {
    Route::post('register', [AuthController::class, 'register'])->name('api.v1.register');
    Route::post('login', [AuthController::class, 'login'])->name('api.v1.login');
});

// Protected routes with authenticated rate limiter (120/min)
Route::middleware(['auth:sanctum', 'throttle:authenticated'])->group(function (): void {
    Route::post('logout', [AuthController::class, 'logout'])->name('api.v1.logout');
    Route::get('me', [AuthController::class, 'me'])->name('api.v1.me');
});


//? This kind of method can be used if you want to keep public methods (index, show) outside the protected group
// ! Route::get('posts', [PostController::class, 'index']);
// ! Route::get('posts/{post}', [PostController::class, 'show']);

// Protected: resource excluding public methods
Route::middleware('auth:sanctum')->group(function () {
    //? The except(['index', 'show']) method can be used here to exclude the methods that you want to keep public
    Route::apiResource('posts', PostController::class)/* ->except(['index', 'show']) */;
});
`auth:sanctum`: This is Laravel's authentication middleware using Sanctum (a token-based authentication system). It verifies that the request includes a valid API token and rejects unauthorized requests. Only authenticated users can access these routes.

`throttle:auth`: This rate limiter restricts requests to 5 per minute. It's applied to login/register routes to prevent brute force attacks by limiting how many login attempts someone can make in a short time.

`throttle:authenticated`: This is a separate rate limiter for authenticated users, allowing 120 requests per minute. It's more generous than the `throttle:auth` limit because legitimate logged-in users need more access than unauthenticated login attempts.

```
// Public routes (register/login) use throttle:auth for brute force protection
Route::middleware('throttle:auth')->group(function (): void {
    Route::post('register', [AuthController::class, 'register'])->name('api.v1.register');
    Route::post('login', [AuthController::class, 'login'])->name('api.v1.login');
});
```

```
// Protected routes with authenticated rate limiter (120/min)
// Authenticated endpoints (logout/me) use both auth:sanctum (requires login) AND throttle:authenticated (rate limit for logged-in users)
Route::middleware(['auth:sanctum', 'throttle:authenticated'])->group(function (): void {
    Route::post('logout', [AuthController::class, 'logout'])->name('api.v1.logout');
    Route::get('me', [AuthController::class, 'me'])->name('api.v1.me');
});
```

```
// Post CRUD routes use auth:sanctum (requires login, inherits the 120/min rate limit)
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('posts', PostController::class);
});
```
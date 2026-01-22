<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Api\V1\LoginRequest;
use App\Http\Requests\Api\V1\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

final class AuthController extends ApiController
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::query()->create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        /* It creates a token.
        So when the user registers, they are automatically logged in.

        Then you need to do is:
        ?1. Use it to access protected routes - Any route protected by the auth:sanctum middleware will accept that token
        ?2. Route them to the home page - Your frontend can store that token and use it for subsequent requests
        ?3. Skip the login step - They don't need to log in again; they're already authenticated

        How it works:
        ?Route::middleware('auth:sanctum')->group(function () {
        ?Route::get('/home', ...);  //! Accessible with registration token
        ?Route::get('/me', [AuthController::class, 'me']);  //! Accessible
        });

        On frontend:
        *After registration
        ?localStorage.setItem('authToken', response.data.token);

        *Then on subsequent requests
        ?fetch('/api/v1/home', {
        ?    headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        ?});
        */
        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->created([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'User registered successfully');
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()->where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return $this->unauthorized('Invalid credentials');
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Login successful');
    }

    public function logout(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete(); // Deletes the current token only in that session
        // $user->tokens()->delete(); // Delete all tokens and preventing multiple logins

        return $this->success(message: 'Logged out successfully');
    }

    public function me(Request $request): JsonResponse
    {
        return $this->success(new UserResource($request->user()));
    }
}

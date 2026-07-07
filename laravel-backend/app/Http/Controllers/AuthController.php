<?php

namespace App\Http\Controllers;

use App\Models\AuthUser;
use App\Models\AuthToken;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    /**
     * POST /api-token-auth/
     *
     * Replicates Django DRF's obtain_auth_token view exactly.
     * Request:  { "username": "admin", "password": "secret" }
     * Response: { "token": "40charHexToken..." }
     *
     * Uses the SAME authtoken_token table, so existing admin sessions
     * continue to work after the migration (no re-login required).
     */
    public function login(Request $request): JsonResponse
    {
        \Log::info("Login endpoint hit with data: " . json_encode($request->all()));

        $username = $request->input('username', '');
        $password = $request->input('password', '');

        // Validate input (match Django DRF's error format)
        if (! $username || ! $password) {
            return response()->json([
                'non_field_errors' => ['Unable to log in with provided credentials.'],
            ], 400);
        }

        // Look up active user by username
        $user = AuthUser::where('username', $username)
            ->where('is_active', true)
            ->first();

        if (! $user) {
            \Log::error("Login failed: User not found or inactive for $username");
            return response()->json([
                'non_field_errors' => ['Unable to log in with provided credentials.'],
            ], 400);
        }

        if (! $user->verifyPassword($password)) {
            \Log::error("Login failed: Password verification failed for $username. DB Hash: " . $user->password . " Input password: " . $password);
            return response()->json([
                'non_field_errors' => ['Unable to log in with provided credentials.'],
            ], 400);
        }

        // Return existing token or create a new 40-char hex token
        $authToken = AuthToken::where('user_id', $user->id)->first();

        if (! $authToken) {
            $authToken = AuthToken::create([
                'key'     => bin2hex(random_bytes(20)), // 40 hex chars, same as Django
                'user_id' => $user->id,
                'created' => now(),
            ]);
        }

        return response()->json(['token' => $authToken->key]);
    }
}

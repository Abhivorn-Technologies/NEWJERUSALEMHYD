<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Replicates Django's ChangePasswordView.
 * POST /api/change-password/ — requires authentication.
 *
 * Request:  { "old_password": "...", "new_password": "..." }
 * Response: { "message": "Password successfully changed." }
 */
class ChangePasswordController extends Controller
{
    public function change(Request $request): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $user        = $this->getAuthUser($request);
        $oldPassword = $request->input('old_password');
        $newPassword = $request->input('new_password');

        // Match Django's validation: both fields required
        if (! $oldPassword || ! $newPassword) {
            return response()->json(
                ['error' => 'Old and new passwords are required.'],
                400
            );
        }

        // Verify old password using Django-compatible check
        if (! $user->verifyPassword($oldPassword)) {
            return response()->json(
                ['error' => 'Incorrect current password.'],
                400
            );
        }

        // Save new password as Django PBKDF2-SHA256 hash
        // (fully compatible — Django can still read it if needed)
        $user->password = make_django_password($newPassword);
        $user->save();

        return response()->json(['message' => 'Password successfully changed.']);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\AuthUser;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Base controller with shared helpers used by all API controllers.
 */
abstract class Controller
{
    /**
     * Returns the authenticated AuthUser from the request, or null.
     */
    protected function getAuthUser(Request $request): ?AuthUser
    {
        return $request->attributes->get('auth_user');
    }

    /**
     * Returns true if the current request is authenticated.
     */
    protected function isAuthenticated(Request $request): bool
    {
        return $request->attributes->has('auth_user');
    }

    /**
     * Returns a 401 JSON response matching Django DRF's unauthenticated response.
     */
    protected function unauthenticated(): JsonResponse
    {
        return response()->json(
            ['detail' => 'Authentication credentials were not provided.'],
            401
        );
    }

    /**
     * Builds an absolute /media/ URL for a stored file path.
     * Returns null if path is null or empty (matching Django's null file field behavior).
     *
     * Django: http://127.0.0.1:8000/media/songs/audio/file.mp3
     * Laravel: http://127.0.0.1:8000/media/songs/audio/file.mp3 ← identical
     */
    protected function fileUrl(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }
        return url('/media/' . ltrim($path, '/'));
    }

    /**
     * Formats a datetime value to Django DRF's ISO 8601 format with microseconds.
     * Django format: 2024-01-07T10:30:45.123456Z
     */
    protected function formatDate(mixed $date): ?string
    {
        if ($date === null) {
            return null;
        }

        if ($date instanceof \Carbon\Carbon) {
            return $date->setTimezone('UTC')->format('Y-m-d\TH:i:s.u\Z');
        }

        if (is_string($date)) {
            try {
                return \Carbon\Carbon::parse($date)->setTimezone('UTC')->format('Y-m-d\TH:i:s.u\Z');
            } catch (\Exception) {
                return $date;
            }
        }

        return null;
    }

    /**
     * Returns a 404 JSON response matching Django DRF's not-found response.
     */
    protected function notFound(): JsonResponse
    {
        return response()->json(['detail' => 'Not found.'], 404);
    }
}

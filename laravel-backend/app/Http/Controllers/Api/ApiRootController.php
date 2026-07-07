<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Replicates Django DRF DefaultRouter's root view.
 * GET /api/ returns a JSON map of all registered resource endpoints.
 *
 * Django response example:
 * {
 *   "songs": "http://127.0.0.1:8000/api/songs/",
 *   "categories": "http://127.0.0.1:8000/api/categories/",
 *   ...
 * }
 */
class ApiRootController extends Controller
{
    public function root(Request $request): JsonResponse
    {
        $base = rtrim(url('/api'), '/');

        return response()->json([
            'songs'                  => "{$base}/songs/",
            'categories'             => "{$base}/categories/",
            'pages'                  => "{$base}/pages/",
            'site-settings'          => "{$base}/site-settings/",
            'nav-menu'               => "{$base}/nav-menu/",
            'hero-items'             => "{$base}/hero-items/",
            'beliefs'                => "{$base}/beliefs/",
            'bible-resources'        => "{$base}/bible-resources/",
            'story-categories'       => "{$base}/story-categories/",
            'activities'             => "{$base}/activities/",
            'content-items'          => "{$base}/content-items/",
            'contact-submissions'    => "{$base}/contact-submissions/",
            'prayer-requests'        => "{$base}/prayer-requests/",
            'magazine-subscriptions' => "{$base}/magazine-subscriptions/",
            'reviews'                => "{$base}/reviews/",
            'resource-downloads'     => "{$base}/resource-downloads/",
            'magazines'              => "{$base}/magazines/",
        ]);
    }
}

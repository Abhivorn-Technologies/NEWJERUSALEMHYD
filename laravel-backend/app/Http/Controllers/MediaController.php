<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Serves files from the media disk (d:\NEWJERUSALEMHYD\media).
 *
 * Replicates Django's:
 *   urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
 *
 * URL pattern: GET /media/{path}
 * Serves: d:\NEWJERUSALEMHYD\media\{path}
 */
class MediaController extends Controller
{
    public function serve(Request $request, string $path): Response
    {
        $disk     = Storage::disk('media');
        $fullPath = $disk->path($path);

        if (! $disk->exists($path)) {
            abort(404);
        }

        return response()->file($fullPath, [
            'Access-Control-Allow-Origin' => '*',
        ]);
    }
}

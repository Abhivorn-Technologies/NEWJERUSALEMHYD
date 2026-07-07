<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RemoveTrailingSlash
{
    /**
     * Django's DRF generates URLs with trailing slashes: /api/songs/, /api/songs/1/
     * Laravel routes do not have trailing slashes by default.
     *
     * This middleware rewrites the request PATH_INFO before routing,
     * so both /api/songs/ and /api/songs resolve to the same route.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $uri  = $request->server('REQUEST_URI', '/');
        $path = parse_url($uri, PHP_URL_PATH) ?? '/';
        $qs   = $request->server('QUERY_STRING', '');

        // Strip trailing slash (but not the root /)
        if ($path !== '/' && str_ends_with($path, '/')) {
            $newPath = rtrim($path, '/');
            $newUri  = $newPath . ($qs !== '' ? '?' . $qs : '');

            $request->server->set('REQUEST_URI', $newUri);
            $request->server->set('PATH_INFO', $newPath);
        }

        return $next($request);
    }
}

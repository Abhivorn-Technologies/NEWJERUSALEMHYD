<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\AuthToken;
use Symfony\Component\HttpFoundation\Response;

class TokenAuthentication
{
    /**
     * Reads the "Authorization: Token <key>" header (Django DRF format).
     * If the token is valid, attaches the AuthUser to the request attributes.
     * Continues the request regardless — auth enforcement is done in controllers.
     *
     * This uses the existing Django authtoken_token table directly, meaning
     * all currently logged-in admin sessions continue to work after migration.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $header = $request->header('Authorization', '');

        if (str_starts_with($header, 'Token ')) {
            $tokenKey = trim(substr($header, 6));

            if ($tokenKey !== '') {
                $authToken = AuthToken::with('user')
                    ->where('key', $tokenKey)
                    ->first();

                if ($authToken && $authToken->user && $authToken->user->is_active) {
                    // Store the authenticated user on the request for controller use
                    $request->attributes->set('auth_user', $authToken->user);
                }
            }
        }

        return $next($request);
    }
}

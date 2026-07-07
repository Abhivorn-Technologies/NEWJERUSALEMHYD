<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Strip trailing slashes BEFORE routing (Django uses trailing slashes, Laravel doesn't)
        $middleware->prepend(\App\Http\Middleware\RemoveTrailingSlash::class);

        // Apply token authentication to all API requests (middleware reads the token,
        // sets user if valid, continues regardless — auth checks are in controllers)
        $middleware->appendToGroup('api', \App\Http\Middleware\TokenAuthentication::class);

        // Alias for explicit use in routes if needed
        $middleware->alias([
            'token.auth' => \App\Http\Middleware\TokenAuthentication::class,
        ]);

        // Disable CSRF for the token auth endpoint (since it's a stateless API 
        // endpoint, but defined in web.php to avoid the /api/ prefix)
        $middleware->validateCsrfTokens(except: [
            'api-token-auth',
            'api-token-auth/*'
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Return consistent Django-compatible JSON error responses for API routes
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*') || $request->is('api-token-auth*') || $request->expectsJson()) {
                if ($e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
                    return response()->json(['detail' => 'Not found.'], 404);
                }

                if ($e instanceof \Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException) {
                    return response()->json(['detail' => 'Method not allowed.'], 405);
                }

                if ($e instanceof \Illuminate\Validation\ValidationException) {
                    return response()->json($e->errors(), 400);
                }

                if ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpException) {
                    return response()->json(['detail' => $e->getMessage() ?: 'Error.'], $e->getStatusCode());
                }

                if (config('app.debug')) {
                    return response()->json([
                        'detail' => $e->getMessage(),
                        'trace'  => collect($e->getTrace())->take(5)->toArray(),
                    ], 500);
                }

                return response()->json(['detail' => 'Internal server error.'], 500);
            }
        });
    })->create();

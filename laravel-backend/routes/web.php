<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MediaController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Two non-API routes that must live outside the /api prefix:
|
|   POST /api-token-auth/ — Django DRF's obtain_auth_token endpoint
|   GET  /media/{path}    — Django's MEDIA_URL serving endpoint
|
*/

// ── Token Login (/api-token-auth/) ───────────────────────────
// Frontend calls: POST http://127.0.0.1:8000/api-token-auth/
// This is at root level (NOT under /api/) — must be in web.php
Route::post('/api-token-auth', [AuthController::class, 'login']);

// ── Media Files (/media/{path}) ──────────────────────────────
// Serves uploaded files from d:\NEWJERUSALEMHYD\media\
// Replicates Django's:
//   urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
Route::get('/media/{path}', [MediaController::class, 'serve'])
    ->where('path', '.*');

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiRootController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ChangePasswordController;
use App\Http\Controllers\Api\SongController;
use App\Http\Controllers\Api\SongCategoryController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\SiteSettingsController;
use App\Http\Controllers\Api\NavMenuController;
use App\Http\Controllers\Api\HeroItemController;
use App\Http\Controllers\Api\BeliefController;
use App\Http\Controllers\Api\BibleResourceController;
use App\Http\Controllers\Api\StoryCategoryController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\ContentItemController;
use App\Http\Controllers\Api\ContactSubmissionController;
use App\Http\Controllers\Api\PrayerRequestController;
use App\Http\Controllers\Api\MagazineSubscriptionController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ResourceDownloadController;
use App\Http\Controllers\Api\MagazineController;

/*
|--------------------------------------------------------------------------
| API Routes — New Jerusalem Ministries Laravel Backend
|--------------------------------------------------------------------------
|
| Exact replication of Django DRF DefaultRouter-generated routes.
| All URLs match the Django backend 1:1 (the frontend is never modified).
|
| NOTE: Trailing slashes are handled by RemoveTrailingSlash middleware,
| so /api/songs/ and /api/songs are both routed identically.
|
| Route file is loaded with /api prefix by bootstrap/app.php.
| Final URLs: /api/songs, /api/songs/{id}, etc.
|
*/

// ── DRF Root (/api/) ──────────────────────────────────────────
Route::get('/', [ApiRootController::class, 'root']);

// ── Dashboard (/api/summary/) ─────────────────────────────────
Route::get('/summary', [DashboardController::class, 'summary']);

// ── Change Password (/api/change-password/) ───────────────────
Route::post('/change-password', [ChangePasswordController::class, 'change']);

// ── Songs (/api/songs/, /api/songs/{id}/) ────────────────────
Route::get('/songs', [SongController::class, 'index']);
Route::post('/songs', [SongController::class, 'store']);
Route::post('/songs/bulk-upload', [SongController::class, 'bulkUpload']);
Route::get('/songs/{id}', [SongController::class, 'show']);
Route::put('/songs/{id}', [SongController::class, 'update']);
Route::patch('/songs/{id}', [SongController::class, 'update']);
Route::delete('/songs/{id}', [SongController::class, 'destroy']);

// ── Song Categories (/api/categories/, /api/categories/{id}/) ─
Route::get('/categories', [SongCategoryController::class, 'index']);
Route::post('/categories', [SongCategoryController::class, 'store']);
Route::get('/categories/{id}', [SongCategoryController::class, 'show']);
Route::put('/categories/{id}', [SongCategoryController::class, 'update']);
Route::patch('/categories/{id}', [SongCategoryController::class, 'update']);
Route::delete('/categories/{id}', [SongCategoryController::class, 'destroy']);

// ── Pages (/api/pages/, /api/pages/{slug}/) ──────────────────
// IMPORTANT: lookup by SLUG not ID — matches Django's lookup_field='slug'
Route::get('/pages', [PageController::class, 'index']);
Route::post('/pages', [PageController::class, 'store']);
Route::get('/pages/{slug}', [PageController::class, 'show']);
Route::put('/pages/{slug}', [PageController::class, 'update']);
Route::patch('/pages/{slug}', [PageController::class, 'update']);
Route::delete('/pages/{slug}', [PageController::class, 'destroy']);

// ── Site Settings (/api/site-settings/, /api/site-settings/{id}/)
Route::get('/site-settings', [SiteSettingsController::class, 'index']);
Route::post('/site-settings', [SiteSettingsController::class, 'store']);
Route::get('/site-settings/{id}', [SiteSettingsController::class, 'show']);
Route::put('/site-settings/{id}', [SiteSettingsController::class, 'update']);
Route::patch('/site-settings/{id}', [SiteSettingsController::class, 'update']);
Route::delete('/site-settings/{id}', [SiteSettingsController::class, 'destroy']);

// ── Nav Menu (/api/nav-menu/, /api/nav-menu/{id}/) ───────────
Route::get('/nav-menu', [NavMenuController::class, 'index']);
Route::post('/nav-menu', [NavMenuController::class, 'store']);
Route::get('/nav-menu/{id}', [NavMenuController::class, 'show']);
Route::put('/nav-menu/{id}', [NavMenuController::class, 'update']);
Route::patch('/nav-menu/{id}', [NavMenuController::class, 'update']);
Route::delete('/nav-menu/{id}', [NavMenuController::class, 'destroy']);

// ── Hero Items (/api/hero-items/) ────────────────────────────
Route::get('/hero-items', [HeroItemController::class, 'index']);
Route::post('/hero-items', [HeroItemController::class, 'store']);
Route::get('/hero-items/{id}', [HeroItemController::class, 'show']);
Route::put('/hero-items/{id}', [HeroItemController::class, 'update']);
Route::patch('/hero-items/{id}', [HeroItemController::class, 'update']);
Route::delete('/hero-items/{id}', [HeroItemController::class, 'destroy']);

// ── Beliefs (/api/beliefs/) ──────────────────────────────────
Route::get('/beliefs', [BeliefController::class, 'index']);
Route::post('/beliefs', [BeliefController::class, 'store']);
Route::get('/beliefs/{id}', [BeliefController::class, 'show']);
Route::put('/beliefs/{id}', [BeliefController::class, 'update']);
Route::patch('/beliefs/{id}', [BeliefController::class, 'update']);
Route::delete('/beliefs/{id}', [BeliefController::class, 'destroy']);

// ── Bible Resources (/api/bible-resources/) ──────────────────
Route::get('/bible-resources', [BibleResourceController::class, 'index']);
Route::post('/bible-resources', [BibleResourceController::class, 'store']);
Route::get('/bible-resources/{id}', [BibleResourceController::class, 'show']);
Route::put('/bible-resources/{id}', [BibleResourceController::class, 'update']);
Route::patch('/bible-resources/{id}', [BibleResourceController::class, 'update']);
Route::delete('/bible-resources/{id}', [BibleResourceController::class, 'destroy']);

// ── Story Categories (/api/story-categories/) ────────────────
Route::get('/story-categories', [StoryCategoryController::class, 'index']);
Route::post('/story-categories', [StoryCategoryController::class, 'store']);
Route::get('/story-categories/{id}', [StoryCategoryController::class, 'show']);
Route::put('/story-categories/{id}', [StoryCategoryController::class, 'update']);
Route::patch('/story-categories/{id}', [StoryCategoryController::class, 'update']);
Route::delete('/story-categories/{id}', [StoryCategoryController::class, 'destroy']);

// ── Activities (/api/activities/) ────────────────────────────
Route::get('/activities', [ActivityController::class, 'index']);
Route::post('/activities', [ActivityController::class, 'store']);
Route::get('/activities/{id}', [ActivityController::class, 'show']);
Route::put('/activities/{id}', [ActivityController::class, 'update']);
Route::patch('/activities/{id}', [ActivityController::class, 'update']);
Route::delete('/activities/{id}', [ActivityController::class, 'destroy']);

// ── Content Items (/api/content-items/) ──────────────────────
Route::get('/content-items', [ContentItemController::class, 'index']);
Route::post('/content-items', [ContentItemController::class, 'store']);
Route::get('/content-items/{id}', [ContentItemController::class, 'show']);
Route::put('/content-items/{id}', [ContentItemController::class, 'update']);
Route::patch('/content-items/{id}', [ContentItemController::class, 'update']);
Route::delete('/content-items/{id}', [ContentItemController::class, 'destroy']);

// ── Contact Submissions (/api/contact-submissions/) ──────────
Route::get('/contact-submissions', [ContactSubmissionController::class, 'index']);
Route::post('/contact-submissions', [ContactSubmissionController::class, 'store']);
Route::get('/contact-submissions/{id}', [ContactSubmissionController::class, 'show']);
Route::put('/contact-submissions/{id}', [ContactSubmissionController::class, 'update']);
Route::patch('/contact-submissions/{id}', [ContactSubmissionController::class, 'update']);
Route::delete('/contact-submissions/{id}', [ContactSubmissionController::class, 'destroy']);

// ── Prayer Requests (/api/prayer-requests/) ──────────────────
Route::get('/prayer-requests', [PrayerRequestController::class, 'index']);
Route::post('/prayer-requests', [PrayerRequestController::class, 'store']);
Route::get('/prayer-requests/{id}', [PrayerRequestController::class, 'show']);
Route::put('/prayer-requests/{id}', [PrayerRequestController::class, 'update']);
Route::patch('/prayer-requests/{id}', [PrayerRequestController::class, 'update']);
Route::delete('/prayer-requests/{id}', [PrayerRequestController::class, 'destroy']);

// ── Magazine Subscriptions (/api/magazine-subscriptions/) ─────
Route::get('/magazine-subscriptions', [MagazineSubscriptionController::class, 'index']);
Route::post('/magazine-subscriptions', [MagazineSubscriptionController::class, 'store']);
Route::get('/magazine-subscriptions/{id}', [MagazineSubscriptionController::class, 'show']);
Route::put('/magazine-subscriptions/{id}', [MagazineSubscriptionController::class, 'update']);
Route::patch('/magazine-subscriptions/{id}', [MagazineSubscriptionController::class, 'update']);
Route::delete('/magazine-subscriptions/{id}', [MagazineSubscriptionController::class, 'destroy']);

// ── Reviews (/api/reviews/) ──────────────────────────────────
Route::get('/reviews', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'store']);
Route::get('/reviews/{id}', [ReviewController::class, 'show']);
Route::put('/reviews/{id}', [ReviewController::class, 'update']);
Route::patch('/reviews/{id}', [ReviewController::class, 'update']);
Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

// ── Resource Downloads (/api/resource-downloads/) — read-only ─
Route::get('/resource-downloads', [ResourceDownloadController::class, 'index']);
Route::get('/resource-downloads/{id}', [ResourceDownloadController::class, 'show']);

// ── Magazines (/api/magazines/) ──────────────────────────────
Route::get('/magazines', [MagazineController::class, 'index']);
Route::post('/magazines', [MagazineController::class, 'store']);
Route::get('/magazines/{id}', [MagazineController::class, 'show']);
Route::put('/magazines/{id}', [MagazineController::class, 'update']);
Route::patch('/magazines/{id}', [MagazineController::class, 'update']);
Route::delete('/magazines/{id}', [MagazineController::class, 'destroy']);

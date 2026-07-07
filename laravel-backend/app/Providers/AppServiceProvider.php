<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Storage;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Ensure the media disk root directory exists at startup
        $mediaRoot = base_path('../media');
        if (! is_dir($mediaRoot)) {
            mkdir($mediaRoot, 0775, true);
        }
    }
}

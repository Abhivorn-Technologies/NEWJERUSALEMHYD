<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSettings;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Replicates Django's SiteSettingsViewSet.
 * There is always exactly one SiteSettings row (pk=1, singleton).
 * Django enforces this by overriding save() to always set pk=1.
 */
class SiteSettingsController extends Controller
{
    private function transform(SiteSettings $s): array
    {
        return [
            'id'             => $s->id,
            'site_name'      => $s->site_name      ?? 'New Jerusalem Ministries',
            'phone1'         => $s->phone1          ?? '',
            'phone2'         => $s->phone2          ?? '',
            'email'          => $s->email           ?? '',
            'address'        => $s->address         ?? '',
            'footer_tagline' => $s->footer_tagline  ?? '',
        ];
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json([SiteSettings::load()
            ->tap(fn ($s) => null)]
            ->map(fn ($s) => $this->transform($s))
            ->values()
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $s = SiteSettings::find($id);
        return $s ? response()->json($this->transform($s)) : $this->notFound();
    }

    public function store(Request $request): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        // Singleton: always upsert pk=1
        $s = SiteSettings::updateOrCreate(['id' => 1], $request->only([
            'site_name', 'phone1', 'phone2', 'email', 'address', 'footer_tagline',
        ]));

        return response()->json($this->transform($s), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $s = SiteSettings::findOrFail($id);
        $s->fill($request->only([
            'site_name', 'phone1', 'phone2', 'email', 'address', 'footer_tagline',
        ]))->save();

        return response()->json($this->transform($s));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        // Match Django: the singleton cannot be deleted
        return response()->json(['detail' => 'Cannot delete site settings.'], 405);
    }
}

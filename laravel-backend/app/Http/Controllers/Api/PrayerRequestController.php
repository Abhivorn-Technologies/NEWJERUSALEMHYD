<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrayerRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Replicates Django's PrayerRequestViewSet with AllowPostOrIsAuthenticated.
 * POST is public. GET/PUT/PATCH/DELETE require authentication.
 * Ordered by: -submitted_at
 */
class PrayerRequestController extends Controller
{
    private function transform(PrayerRequest $p): array
    {
        return [
            'id'           => $p->id,
            'name'         => $p->name,
            'phone'        => $p->phone        ?? '',
            'request_text' => $p->request_text,
            'is_read'      => (bool) $p->is_read,
            'submitted_at' => $this->formatDate($p->submitted_at),
        ];
    }

    public function index(Request $request): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        return response()->json(
            PrayerRequest::orderByDesc('submitted_at')
                ->get()->map(fn ($p) => $this->transform($p))->values()
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $p = PrayerRequest::find($id);
        return $p ? response()->json($this->transform($p)) : $this->notFound();
    }

    /** POST is public — no auth required */
    public function store(Request $request): JsonResponse
    {
        $p = PrayerRequest::create($request->only(['name', 'phone', 'request_text']));

        return response()->json($this->transform($p), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $p = PrayerRequest::find($id);
        if (! $p) {
            return $this->notFound();
        }

        $p->fill($request->only(['name', 'phone', 'request_text', 'is_read']))->save();

        return response()->json($this->transform($p));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $p = PrayerRequest::find($id);
        if (! $p) {
            return $this->notFound();
        }

        $p->delete();

        return response()->json(null, 204);
    }
}

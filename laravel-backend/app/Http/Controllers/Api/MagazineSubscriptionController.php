<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MagazineSubscription;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Replicates Django's MagazineSubscriptionViewSet with AllowPostOrIsAuthenticated.
 * POST is public. GET/PUT/PATCH/DELETE require authentication.
 * Ordered by: -subscribed_at
 */
class MagazineSubscriptionController extends Controller
{
    private function transform(MagazineSubscription $m): array
    {
        return [
            'id'            => $m->id,
            'name'          => $m->name,
            'phone'         => $m->phone         ?? '',
            'email'         => $m->email          ?? '',
            'address'       => $m->address,
            'is_active'     => (bool) $m->is_active,
            'subscribed_at' => $this->formatDate($m->subscribed_at),
        ];
    }

    public function index(Request $request): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        return response()->json(
            MagazineSubscription::orderByDesc('subscribed_at')
                ->get()->map(fn ($m) => $this->transform($m))->values()
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $m = MagazineSubscription::find($id);
        return $m ? response()->json($this->transform($m)) : $this->notFound();
    }

    /** POST is public — no auth required */
    public function store(Request $request): JsonResponse
    {
        $m = MagazineSubscription::create($request->only(['name', 'phone', 'email', 'address']));

        return response()->json($this->transform($m), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $m = MagazineSubscription::find($id);
        if (! $m) {
            return $this->notFound();
        }

        $m->fill($request->only(['name', 'phone', 'email', 'address', 'is_active']))->save();

        return response()->json($this->transform($m));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $m = MagazineSubscription::find($id);
        if (! $m) {
            return $this->notFound();
        }

        $m->delete();

        return response()->json(null, 204);
    }
}

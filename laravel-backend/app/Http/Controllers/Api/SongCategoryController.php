<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SongCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/** Replicates Django's SongCategoryViewSet (standard CRUD, no filters). */
class SongCategoryController extends Controller
{
    private function transform(SongCategory $cat): array
    {
        return [
            'id'        => $cat->id,
            'name'      => $cat->name,
            'slug'      => $cat->slug,
            'is_active' => (bool) $cat->is_active,
        ];
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            SongCategory::all()->map(fn ($c) => $this->transform($c))->values()
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $cat = SongCategory::find($id);
        return $cat ? response()->json($this->transform($cat)) : $this->notFound();
    }

    public function store(Request $request): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $cat = SongCategory::create($request->only(['name', 'slug', 'is_active']));

        return response()->json($this->transform($cat), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $cat = SongCategory::find($id);
        if (! $cat) {
            return $this->notFound();
        }

        $cat->fill($request->only(['name', 'slug', 'is_active']))->save();

        return response()->json($this->transform($cat));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $cat = SongCategory::find($id);
        if (! $cat) {
            return $this->notFound();
        }

        $cat->delete();

        return response()->json(null, 204);
    }
}

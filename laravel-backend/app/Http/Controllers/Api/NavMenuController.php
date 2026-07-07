<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NavMenuItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Replicates Django's NavMenuViewSet with recursive children serialization.
 *
 * Django logic:
 *   - Public: top-level items WHERE is_active=true; children filtered to is_active=true
 *   - Admin:  ALL top-level items; ALL children included
 *   - Always: only top-level (parent=null) returned at root; children nested inside
 */
class NavMenuController extends Controller
{
    /**
     * Recursively serialize a menu item with its children.
     * Matches Django's NavMenuItemSerializer.get_children() exactly.
     */
    private function transform(NavMenuItem $item, bool $isAuthenticated): array
    {
        $childQuery = $isAuthenticated
            ? $item->children
            : $item->children->filter(fn ($c) => $c->is_active);

        return [
            'id'        => $item->id,
            'label'     => $item->label,
            'url'       => $item->url,
            'order'     => $item->order,
            'is_active' => (bool) $item->is_active,
            'parent'    => $item->parent_id,
            'children'  => $childQuery
                ->map(fn ($c) => $this->transform($c, $isAuthenticated))
                ->values()
                ->toArray(),
        ];
    }

    public function index(Request $request): JsonResponse
    {
        $isAuth = $this->isAuthenticated($request);

        $query = NavMenuItem::with(['children.children']) // eager-load 2 levels deep
            ->whereNull('parent_id')
            ->orderBy('order');

        if (! $isAuth) {
            $query->where('is_active', true);
        }

        $items = $query->get();

        return response()->json(
            $items->map(fn ($item) => $this->transform($item, $isAuth))->values()
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $item = NavMenuItem::with(['children.children'])->find($id);
        if (! $item) {
            return $this->notFound();
        }

        return response()->json($this->transform($item, $this->isAuthenticated($request)));
    }

    public function store(Request $request): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $item = NavMenuItem::create($request->only([
            'label', 'url', 'parent_id', 'order', 'is_active',
        ]));

        $item->load(['children.children']);

        return response()->json($this->transform($item, true), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $item = NavMenuItem::find($id);
        if (! $item) {
            return $this->notFound();
        }

        $item->fill($request->only(['label', 'url', 'parent_id', 'order', 'is_active']))->save();
        $item->load(['children.children']);

        return response()->json($this->transform($item, true));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $item = NavMenuItem::find($id);
        if (! $item) {
            return $this->notFound();
        }

        $item->delete();

        return response()->json(null, 204);
    }
}

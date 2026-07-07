<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/** Replicates Django's HeroItemViewSet — ordered by order ASC. */
class HeroItemController extends Controller
{
    private function transform(HeroItem $item): array
    {
        return [
            'id'    => $item->id,
            'icon'  => $item->icon,
            'text'  => $item->text,
            'order' => $item->order,
        ];
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            HeroItem::orderBy('order')->get()->map(fn ($i) => $this->transform($i))->values()
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $item = HeroItem::find($id);
        return $item ? response()->json($this->transform($item)) : $this->notFound();
    }

    public function store(Request $request): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $item = HeroItem::create($request->only(['icon', 'text', 'order']));

        return response()->json($this->transform($item), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $item = HeroItem::find($id);
        if (! $item) {
            return $this->notFound();
        }

        $item->fill($request->only(['icon', 'text', 'order']))->save();

        return response()->json($this->transform($item));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $item = HeroItem::find($id);
        if (! $item) {
            return $this->notFound();
        }

        $item->delete();

        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BibleResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/** Replicates Django's BibleResourceViewSet — ordered by order ASC. */
class BibleResourceController extends Controller
{
    private function transform(BibleResource $r): array
    {
        return [
            'id'    => $r->id,
            'title' => $r->title,
            'image' => $r->image,
            'link'  => $r->link,
            'order' => $r->order,
        ];
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            BibleResource::orderBy('order')->get()->map(fn ($r) => $this->transform($r))->values()
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $r = BibleResource::find($id);
        return $r ? response()->json($this->transform($r)) : $this->notFound();
    }

    public function store(Request $request): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $r = BibleResource::create($request->only(['title', 'image', 'link', 'order']));

        return response()->json($this->transform($r), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $r = BibleResource::find($id);
        if (! $r) {
            return $this->notFound();
        }

        $r->fill($request->only(['title', 'image', 'link', 'order']))->save();

        return response()->json($this->transform($r));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $r = BibleResource::find($id);
        if (! $r) {
            return $this->notFound();
        }

        $r->delete();

        return response()->json(null, 204);
    }
}

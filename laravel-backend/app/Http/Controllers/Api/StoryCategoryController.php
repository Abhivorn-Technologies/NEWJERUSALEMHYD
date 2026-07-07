<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StoryCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/** Replicates Django's StoryCategoryViewSet — ordered by order ASC. */
class StoryCategoryController extends Controller
{
    private function transform(StoryCategory $s): array
    {
        return [
            'id'    => $s->id,
            'title' => $s->title,
            'link'  => $s->link,
            'order' => $s->order,
        ];
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            StoryCategory::orderBy('order')->get()->map(fn ($s) => $this->transform($s))->values()
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $s = StoryCategory::find($id);
        return $s ? response()->json($this->transform($s)) : $this->notFound();
    }

    public function store(Request $request): JsonResponse
    {
        if (! $this->isAuthenticated($request)) return $this->unauthenticated();
        $s = StoryCategory::create($request->only(['title', 'link', 'order']));
        return response()->json($this->transform($s), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) return $this->unauthenticated();
        $s = StoryCategory::find($id);
        if (! $s) return $this->notFound();
        $s->fill($request->only(['title', 'link', 'order']))->save();
        return response()->json($this->transform($s));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) return $this->unauthenticated();
        $s = StoryCategory::find($id);
        if (! $s) return $this->notFound();
        $s->delete();
        return response()->json(null, 204);
    }
}

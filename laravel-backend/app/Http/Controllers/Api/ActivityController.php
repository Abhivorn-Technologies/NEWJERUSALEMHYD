<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/** Replicates Django's ActivityViewSet — ordered by order ASC. */
class ActivityController extends Controller
{
    private function transform(Activity $a): array
    {
        return [
            'id'    => $a->id,
            'title' => $a->title,
            'icon'  => $a->icon,
            'link'  => $a->link,
            'order' => $a->order,
        ];
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Activity::orderBy('order')->get()->map(fn ($a) => $this->transform($a))->values()
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $a = Activity::find($id);
        return $a ? response()->json($this->transform($a)) : $this->notFound();
    }

    public function store(Request $request): JsonResponse
    {
        if (! $this->isAuthenticated($request)) return $this->unauthenticated();
        $a = Activity::create($request->only(['title', 'icon', 'link', 'order']));
        return response()->json($this->transform($a), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) return $this->unauthenticated();
        $a = Activity::find($id);
        if (! $a) return $this->notFound();
        $a->fill($request->only(['title', 'icon', 'link', 'order']))->save();
        return response()->json($this->transform($a));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) return $this->unauthenticated();
        $a = Activity::find($id);
        if (! $a) return $this->notFound();
        $a->delete();
        return response()->json(null, 204);
    }
}

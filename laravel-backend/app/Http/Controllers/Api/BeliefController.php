<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Belief;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/** Replicates Django's BeliefViewSet — ordered by order ASC. */
class BeliefController extends Controller
{
    private function transform(Belief $b): array
    {
        return [
            'id'      => $b->id,
            'icon'    => $b->icon,
            'title'   => $b->title,
            'content' => $b->content,
            'order'   => $b->order,
        ];
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Belief::orderBy('order')->get()->map(fn ($b) => $this->transform($b))->values()
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $b = Belief::find($id);
        return $b ? response()->json($this->transform($b)) : $this->notFound();
    }

    public function store(Request $request): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $b = Belief::create($request->only(['icon', 'title', 'content', 'order']));

        return response()->json($this->transform($b), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $b = Belief::find($id);
        if (! $b) {
            return $this->notFound();
        }

        $b->fill($request->only(['icon', 'title', 'content', 'order']))->save();

        return response()->json($this->transform($b));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $b = Belief::find($id);
        if (! $b) {
            return $this->notFound();
        }

        $b->delete();

        return response()->json(null, 204);
    }
}

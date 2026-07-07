<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/** Replicates Django's ReviewViewSet — ordered by -created_at. */
class ReviewController extends Controller
{
    private function transform(Review $r): array
    {
        return [
            'id'          => $r->id,
            'name'        => $r->name,
            'designation' => $r->designation ?? '',
            'rating'      => $r->rating,
            'review_text' => $r->review_text,
            'avatar'      => $this->fileUrl($r->avatar),
            'is_approved' => (bool) $r->is_approved,
            'created_at'  => $this->formatDate($r->created_at),
        ];
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Review::orderByDesc('created_at')
                ->get()->map(fn ($r) => $this->transform($r))->values()
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $r = Review::find($id);
        return $r ? response()->json($this->transform($r)) : $this->notFound();
    }

    public function store(Request $request): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $r = Review::create($request->only([
            'name', 'designation', 'rating', 'review_text', 'is_approved',
        ]));

        if ($request->hasFile('avatar')) {
            $f = $request->file('avatar');
            $r->avatar = $f->storeAs('reviews', $f->getClientOriginalName(), 'media');
            $r->save();
        }

        return response()->json($this->transform($r), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $r = Review::find($id);
        if (! $r) {
            return $this->notFound();
        }

        $r->fill($request->only([
            'name', 'designation', 'rating', 'review_text', 'is_approved',
        ]))->save();

        if ($request->hasFile('avatar')) {
            $f = $request->file('avatar');
            $r->avatar = $f->storeAs('reviews', $f->getClientOriginalName(), 'media');
            $r->save();
        }

        return response()->json($this->transform($r));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $r = Review::find($id);
        if (! $r) {
            return $this->notFound();
        }

        $r->delete();

        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Replicates Django's PageViewSet.
 * IMPORTANT: Pages are looked up by SLUG, not by numeric ID.
 * Django: lookup_field = 'slug'
 */
class PageController extends Controller
{
    private function transform(Page $page): array
    {
        return [
            'id'               => $page->id,
            'title'            => $page->title,
            'slug'             => $page->slug,
            'content'          => $page->content          ?? '',
            'meta_description' => $page->meta_description ?? '',
            'is_published'     => (bool) $page->is_published,
            'created_at'       => $this->formatDate($page->created_at),
            'updated_at'       => $this->formatDate($page->updated_at),
            'wp_post_id'       => $page->wp_post_id,
        ];
    }

    public function index(Request $request): JsonResponse
    {
        $query = $this->isAuthenticated($request)
            ? Page::query()
            : Page::where('is_published', true);

        return response()->json(
            $query->get()->map(fn ($p) => $this->transform($p))->values()
        );
    }

    /** Lookup by slug, not ID — matches Django's lookup_field = 'slug' */
    public function show(Request $request, string $slug): JsonResponse
    {
        $query = $this->isAuthenticated($request)
            ? Page::query()
            : Page::where('is_published', true);

        $page = $query->where('slug', $slug)->first();

        return $page ? response()->json($this->transform($page)) : $this->notFound();
    }

    public function store(Request $request): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $page = Page::create($request->only([
            'title', 'slug', 'content', 'meta_description', 'is_published', 'wp_post_id',
        ]));

        return response()->json($this->transform($page), 201);
    }

    public function update(Request $request, string $slug): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $page = Page::where('slug', $slug)->first();
        if (! $page) {
            return $this->notFound();
        }

        $page->fill($request->only([
            'title', 'slug', 'content', 'meta_description', 'is_published', 'wp_post_id',
        ]))->save();

        return response()->json($this->transform($page));
    }

    public function destroy(Request $request, string $slug): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $page = Page::where('slug', $slug)->first();
        if (! $page) {
            return $this->notFound();
        }

        $page->delete();

        return response()->json(null, 204);
    }
}

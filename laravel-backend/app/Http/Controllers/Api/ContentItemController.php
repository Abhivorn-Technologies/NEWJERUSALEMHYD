<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContentItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Replicates Django's ContentItemViewSet.
 *
 * Django serializer fields:
 *   id, title, subtitle, page_category, section, image_url, cover_image,
 *   links, is_active, created_at
 *
 * Query params:
 *   section       — filter by section (skip if 'all')
 *   page_category — filter by page_category (skip if 'all')
 *
 * Ordered by: -created_at (newest first)
 */
class ContentItemController extends Controller
{
    private function transform(ContentItem $item): array
    {
        return [
            'id'            => $item->id,
            'title'         => $item->title,
            'subtitle'      => $item->subtitle      ?? '',
            'page_category' => $item->page_category,
            'section'       => $item->section,
            'image_url'     => $item->image_url      ?? '',
            'cover_image'   => $this->fileUrl($item->cover_image),
            'links'         => $item->links ?? [],
            'is_active'     => (bool) $item->is_active,
            'created_at'    => $this->formatDate($item->created_at),
        ];
    }

    public function index(Request $request): JsonResponse
    {
        $query = ContentItem::orderByDesc('created_at');

        $section      = $request->query('section');
        $pageCategory = $request->query('page_category');

        if ($section && $section !== 'all') {
            $query->where('section', $section);
        }

        if ($pageCategory && $pageCategory !== 'all') {
            $query->where('page_category', $pageCategory);
        }

        return response()->json(
            $query->get()->map(fn ($i) => $this->transform($i))->values()
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $item = ContentItem::find($id);
        return $item ? response()->json($this->transform($item)) : $this->notFound();
    }

    public function store(Request $request): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $data = $request->all();
        $item = ContentItem::create([
            'title'         => $data['title']         ?? '',
            'subtitle'      => $data['subtitle']       ?? '',
            'page_category' => $data['page_category']  ?? null,
            'section'       => $data['section']        ?? '',
            'image_url'     => $data['image_url']      ?? '',
            'links'         => isset($data['links']) ? (is_string($data['links']) ? json_decode($data['links'], true) : $data['links']) : [],
            'is_active'     => $data['is_active']      ?? true,
        ]);

        if ($request->hasFile('cover_image')) {
            $f = $request->file('cover_image');
            $item->cover_image = $f->storeAs('resources/covers', $f->getClientOriginalName(), 'media');
            $item->save();
        }

        return response()->json($this->transform($item), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $item = ContentItem::find($id);
        if (! $item) {
            return $this->notFound();
        }

        $data = $request->all();

        if (isset($data['title']))         $item->title         = $data['title'];
        if (isset($data['subtitle']))      $item->subtitle      = $data['subtitle'];
        if (array_key_exists('page_category', $data)) $item->page_category = $data['page_category'];
        if (isset($data['section']))       $item->section       = $data['section'];
        if (isset($data['image_url']))     $item->image_url     = $data['image_url'];
        if (isset($data['is_active']))     $item->is_active     = $data['is_active'];
        if (isset($data['links'])) {
            $item->links = is_string($data['links']) ? json_decode($data['links'], true) : $data['links'];
        }

        if ($request->hasFile('cover_image')) {
            $f = $request->file('cover_image');
            $item->cover_image = $f->storeAs('resources/covers', $f->getClientOriginalName(), 'media');
        }

        $item->save();

        return response()->json($this->transform($item));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $item = ContentItem::find($id);
        if (! $item) {
            return $this->notFound();
        }

        $item->delete();

        return response()->json(null, 204);
    }
}

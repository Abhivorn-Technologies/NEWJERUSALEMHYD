<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Magazine;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Replicates Django's MagazineViewSet.
 * Ordered by: order ASC, -created_at
 * Both cover_image and file are FileField (stored in media disk).
 */
class MagazineController extends Controller
{
    private function transform(Magazine $m): array
    {
        return [
            'id'          => $m->id,
            'title'       => $m->title,
            'month_year'  => $m->month_year,
            'language'    => $m->language     ?? 'Telugu',
            'cover_image' => $this->fileUrl($m->cover_image),
            'file'        => $this->fileUrl($m->file),
            'order'       => $m->order,
            'is_active'   => (bool) $m->is_active,
            'created_at'  => $this->formatDate($m->created_at),
        ];
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Magazine::orderBy('order')->orderByDesc('created_at')
                ->get()->map(fn ($m) => $this->transform($m))->values()
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $m = Magazine::find($id);
        return $m ? response()->json($this->transform($m)) : $this->notFound();
    }

    public function store(Request $request): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $data = $request->all();
        $m = Magazine::create([
            'title'      => $data['title']      ?? '',
            'month_year' => $data['month_year']  ?? '',
            'language'   => $data['language']    ?? 'Telugu',
            'order'      => $data['order']       ?? 0,
            'is_active'  => $data['is_active']   ?? true,
        ]);

        if ($request->hasFile('cover_image')) {
            $f = $request->file('cover_image');
            $m->cover_image = $f->storeAs('magazines/covers', $f->getClientOriginalName(), 'media');
        }

        if ($request->hasFile('file')) {
            $f = $request->file('file');
            $m->file = $f->storeAs('magazines/files', $f->getClientOriginalName(), 'media');
        }

        $m->save();

        return response()->json($this->transform($m), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $m = Magazine::find($id);
        if (! $m) {
            return $this->notFound();
        }

        $data = $request->all();

        $m->fill(array_filter([
            'title'      => $data['title']      ?? null,
            'month_year' => $data['month_year']  ?? null,
            'language'   => $data['language']    ?? null,
            'order'      => $data['order']       ?? null,
            'is_active'  => isset($data['is_active']) ? $data['is_active'] : null,
        ], fn ($v) => $v !== null));

        if (array_key_exists('is_active', $data)) {
            $m->is_active = $data['is_active'];
        }

        if ($request->hasFile('cover_image')) {
            $f = $request->file('cover_image');
            $m->cover_image = $f->storeAs('magazines/covers', $f->getClientOriginalName(), 'media');
        }

        if ($request->hasFile('file')) {
            $f = $request->file('file');
            $m->file = $f->storeAs('magazines/files', $f->getClientOriginalName(), 'media');
        }

        $m->save();

        return response()->json($this->transform($m));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $m = Magazine::find($id);
        if (! $m) {
            return $this->notFound();
        }

        $m->delete();

        return response()->json(null, 204);
    }
}

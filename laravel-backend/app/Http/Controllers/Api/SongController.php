<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

/**
 * Replicates Django's SongViewSet exactly.
 *
 * Auth logic:
 *   GET (list/detail): authenticated → all; public → is_published=true only
 *   POST/PUT/PATCH/DELETE: requires authentication
 *
 * Query params (list):
 *   language  — filter by language (skip if 'all')
 *   category  — filter by SongCategory slug
 *   letter    — filter by first_letter
 */
class SongController extends Controller
{
    // ── Serialization ─────────────────────────────────────────

    private function transform(Song $song): array
    {
        $song->loadMissing('categories');

        return [
            'id'                => $song->id,
            'title'             => $song->title,
            'slug'              => $song->slug,
            'language'          => $song->language,
            'first_letter'      => $song->first_letter,
            'categories'        => $song->categories->map(fn ($c) => [
                'id'        => $c->id,
                'name'      => $c->name,
                'slug'      => $c->slug,
                'is_active' => (bool) $c->is_active,
            ])->values()->toArray(),
            'telugu_lyrics'     => $song->telugu_lyrics    ?? '',
            'hindi_lyrics'      => $song->hindi_lyrics     ?? '',
            'english_lyrics'    => $song->english_lyrics   ?? '',
            'powerpoint_slides' => $song->powerpoint_slides ?? '',
            'audio_video'       => $song->audio_video      ?? '',
            'audio_file'        => $this->fileUrl($song->audio_file),
            'chords'            => $song->chords           ?? '',
            'thumbnail'         => $this->fileUrl($song->thumbnail),
            'is_published'      => (bool) $song->is_published,
            'created_at'        => $this->formatDate($song->created_at),
            'wp_post_id'        => $song->wp_post_id,
        ];
    }

    // ── Actions ───────────────────────────────────────────────

    public function index(Request $request): JsonResponse
    {
        $query = $this->isAuthenticated($request)
            ? Song::query()
            : Song::where('is_published', true);

        $query->with('categories');

        $language = $request->query('language');
        $category = $request->query('category');
        $letter   = $request->query('letter');

        if ($language && $language !== 'all') {
            $query->where('language', $language);
        }

        if ($category) {
            $query->whereHas('categories', fn ($q) => $q->where('slug', $category));
        }

        if ($letter) {
            $query->where('first_letter', $letter);
        }

        return response()->json(
            $query->get()->map(fn ($s) => $this->transform($s))->values()
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $query = $this->isAuthenticated($request)
            ? Song::query()
            : Song::where('is_published', true);

        $song = $query->with('categories')->find($id);

        return $song ? response()->json($this->transform($song)) : $this->notFound();
    }

    public function store(Request $request): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $data = $request->all();

        $song = Song::create([
            'title'             => $data['title']             ?? '',
            'slug'              => $data['slug']              ?? '',
            'language'          => $data['language']          ?? 'telugu',
            'first_letter'      => $data['first_letter']      ?? '',
            'telugu_lyrics'     => $data['telugu_lyrics']     ?? '',
            'hindi_lyrics'      => $data['hindi_lyrics']      ?? '',
            'english_lyrics'    => $data['english_lyrics']    ?? '',
            'powerpoint_slides' => $data['powerpoint_slides'] ?? '',
            'audio_video'       => $data['audio_video']       ?? '',
            'chords'            => $data['chords']            ?? '',
            'is_published'      => $data['is_published']      ?? true,
            'wp_post_id'        => $data['wp_post_id']        ?? null,
        ]);

        if ($request->hasFile('audio_file')) {
            $f = $request->file('audio_file');
            $song->audio_file = $f->storeAs('songs/audio', $f->getClientOriginalName(), 'media');
            $song->save();
        }

        if ($request->hasFile('thumbnail')) {
            $f = $request->file('thumbnail');
            $song->thumbnail = $f->storeAs('songs', $f->getClientOriginalName(), 'media');
            $song->save();
        }

        if (! empty($data['categories'])) {
            $song->categories()->sync($data['categories']);
        }

        $song->load('categories');

        return response()->json($this->transform($song), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $song = Song::find($id);
        if (! $song) {
            return $this->notFound();
        }

        $data = $request->all();

        // PATCH (partial) and PUT (full) handled identically
        $song->fill(array_filter([
            'title'             => $data['title']             ?? null,
            'slug'              => $data['slug']              ?? null,
            'language'          => $data['language']          ?? null,
            'first_letter'      => $data['first_letter']      ?? null,
            'telugu_lyrics'     => $data['telugu_lyrics']     ?? null,
            'hindi_lyrics'      => $data['hindi_lyrics']      ?? null,
            'english_lyrics'    => $data['english_lyrics']    ?? null,
            'powerpoint_slides' => $data['powerpoint_slides'] ?? null,
            'audio_video'       => $data['audio_video']       ?? null,
            'chords'            => $data['chords']            ?? null,
            'is_published'      => isset($data['is_published']) ? $data['is_published'] : null,
            'wp_post_id'        => array_key_exists('wp_post_id', $data) ? $data['wp_post_id'] : null,
        ], fn ($v) => $v !== null));

        if (array_key_exists('is_published', $data)) {
            $song->is_published = $data['is_published'];
        }

        if ($request->hasFile('audio_file')) {
            $f = $request->file('audio_file');
            $song->audio_file = $f->storeAs('songs/audio', $f->getClientOriginalName(), 'media');
        }

        if ($request->hasFile('thumbnail')) {
            $f = $request->file('thumbnail');
            $song->thumbnail = $f->storeAs('songs', $f->getClientOriginalName(), 'media');
        }

        $song->save();

        if (isset($data['categories'])) {
            $song->categories()->sync($data['categories']);
        }

        $song->load('categories');

        return response()->json($this->transform($song));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $song = Song::find($id);
        if (! $song) {
            return $this->notFound();
        }

        $song->categories()->detach();
        $song->delete();

        return response()->json(null, 204);
    }
}

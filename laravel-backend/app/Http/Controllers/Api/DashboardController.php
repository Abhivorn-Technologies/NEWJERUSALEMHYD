<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Song;
use App\Models\SongCategory;
use App\Models\ContentItem;
use App\Models\ResourceDownload;
use App\Models\PrayerRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Replicates Django's DashboardSummaryView exactly.
 * GET /api/summary/ — requires authentication.
 *
 * Response JSON structure (must be identical to Django):
 * {
 *   "global_counts": { total_songs, active_songs, inactive_songs, audio_songs,
 *                      total_categories, total_content, active_content, unread_prayer_requests },
 *   "content_breakdown": [ {section, total, active}, ... ],
 *   "category_breakdown_content": [ {page_category, total, active}, ... ],
 *   "language_breakdown": [ {language, total, active, inactive}, ... ],
 *   "category_breakdown": [ {name, total, active, inactive}, ... ],
 *   "letter_breakdown": [ {language, first_letter, total}, ... ]
 * }
 */
class DashboardController extends Controller
{
    public function summary(Request $request): JsonResponse
    {
        // ── Global Counts ──────────────────────────────────────────────
        $totalSongs   = Song::count();
        $activeSongs  = Song::where('is_published', true)->count();
        $inactiveSongs = $totalSongs - $activeSongs;

        // audio_songs: songs where audio_video is not empty/null
        $audioSongs = Song::where('audio_video', '!=', '')
            ->whereNotNull('audio_video')
            ->count();

        $totalCategories     = SongCategory::count();
        $totalContent        = ContentItem::count();
        $activeContent       = ContentItem::where('is_active', true)->count();
        $unreadPrayerRequests = PrayerRequest::where('is_read', false)->count();

        // ── Content Breakdown by Section ───────────────────────────────
        // Replicates: ContentItem.objects.values('section').annotate(total=Count('id'), active=Count('id', filter=Q(is_active=True)))
        $contentBySection = DB::table('pages_contentitem')
            ->selectRaw("section, COUNT(*) as total, SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active")
            ->groupBy('section')
            ->get()
            ->map(fn ($row) => [
                'section' => $row->section,
                'total'   => (int) $row->total,
                'active'  => (int) $row->active,
            ])
            ->values()
            ->toArray();

        // ── Content Breakdown by Page Category ─────────────────────────
        $contentByCategory = DB::table('pages_contentitem')
            ->selectRaw("page_category, COUNT(*) as total, SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active")
            ->groupBy('page_category')
            ->get()
            ->map(fn ($row) => [
                'page_category' => $row->page_category,
                'total'         => (int) $row->total,
                'active'        => (int) $row->active,
            ])
            ->values()
            ->toArray();

        // Append Bible Downloads (ResourceDownload count) — matches Django exactly
        $totalDownloads = ResourceDownload::count();
        if ($totalDownloads > 0) {
            $contentByCategory[] = [
                'page_category' => 'Bible Downloads',
                'total'         => $totalDownloads,
                'active'        => $totalDownloads,
            ];
        }

        // ── Language Breakdown ─────────────────────────────────────────
        // Replicates: Song.objects.values('language').annotate(total, active, inactive)
        $languageBreakdown = DB::table('songs_song')
            ->selectRaw(
                "language, " .
                "COUNT(*) as total, " .
                "SUM(CASE WHEN is_published = true THEN 1 ELSE 0 END) as active, " .
                "SUM(CASE WHEN is_published = false THEN 1 ELSE 0 END) as inactive"
            )
            ->groupBy('language')
            ->get()
            ->map(fn ($row) => [
                'language' => $row->language,
                'total'    => (int) $row->total,
                'active'   => (int) $row->active,
                'inactive' => (int) $row->inactive,
            ])
            ->values()
            ->toArray();

        // ── Category Breakdown ─────────────────────────────────────────
        // Replicates: SongCategory.objects.values('name').annotate(
        //     total=Count('song'), active=Count('song', filter=Q(song__is_published=True)),
        //     inactive=Count('song', filter=Q(song__is_published=False))
        // )
        $categoryBreakdown = DB::table('songs_songcategory as sc')
            ->selectRaw(
                "sc.name, " .
                "COUNT(DISTINCT pivot.song_id) as total, " .
                "SUM(CASE WHEN s.is_published = true THEN 1 ELSE 0 END) as active, " .
                "SUM(CASE WHEN s.is_published = false THEN 1 ELSE 0 END) as inactive"
            )
            ->leftJoin('songs_song_categories as pivot', 'sc.id', '=', 'pivot.songcategory_id')
            ->leftJoin('songs_song as s', 'pivot.song_id', '=', 's.id')
            ->groupBy('sc.name')
            ->get()
            ->map(fn ($row) => [
                'name'     => $row->name,
                'total'    => (int) $row->total,
                'active'   => (int) $row->active,
                'inactive' => (int) $row->inactive,
            ])
            ->values()
            ->toArray();

        // ── Letter-Wise Breakdown ──────────────────────────────────────
        // Replicates: Song.objects.values('language', 'first_letter').annotate(total=Count('id'))
        //             .order_by('language', 'first_letter')
        $letterBreakdown = DB::table('songs_song')
            ->selectRaw("language, first_letter, COUNT(*) as total")
            ->groupBy('language', 'first_letter')
            ->orderBy('language')
            ->orderBy('first_letter')
            ->get()
            ->map(fn ($row) => [
                'language'     => $row->language,
                'first_letter' => $row->first_letter,
                'total'        => (int) $row->total,
            ])
            ->values()
            ->toArray();

        // ── Response — identical structure to Django's DashboardSummaryView ──
        return response()->json([
            'global_counts' => [
                'total_songs'             => $totalSongs,
                'active_songs'            => $activeSongs,
                'inactive_songs'          => $inactiveSongs,
                'audio_songs'             => $audioSongs,
                'total_categories'        => $totalCategories,
                'total_content'           => $totalContent,
                'active_content'          => $activeContent,
                'unread_prayer_requests'  => $unreadPrayerRequests,
            ],
            'content_breakdown'          => $contentBySection,
            'category_breakdown_content' => $contentByCategory,
            'language_breakdown'         => $languageBreakdown,
            'category_breakdown'         => $categoryBreakdown,
            'letter_breakdown'           => $letterBreakdown,
        ]);
    }
}

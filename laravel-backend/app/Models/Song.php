<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Django table: songs_song
 * Fields match Django's Song model exactly.
 */
class Song extends Model
{
    protected $table = 'songs_song';

    // Django has created_at (auto_now_add) only — no updated_at
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;
    public $timestamps = false;

    protected $fillable = [
        'title', 'slug', 'language', 'first_letter',
        'telugu_lyrics', 'hindi_lyrics', 'english_lyrics',
        'powerpoint_slides', 'audio_video', 'audio_file',
        'chords', 'thumbnail', 'is_published', 'wp_post_id',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'created_at'   => 'datetime',
    ];

    /**
     * Many-to-many with SongCategory.
     * Django pivot table: songs_song_categories
     * Columns: song_id, songcategory_id
     */
    public function categories(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            SongCategory::class,
            'songs_song_categories',
            'song_id',
            'songcategory_id'
        );
    }
}

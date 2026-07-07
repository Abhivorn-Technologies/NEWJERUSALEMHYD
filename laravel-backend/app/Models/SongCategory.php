<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Django table: songs_songcategory
 */
class SongCategory extends Model
{
    protected $table = 'songs_songcategory';

    public $timestamps = false;

    protected $fillable = ['name', 'slug', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function songs(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            Song::class,
            'songs_song_categories',
            'songcategory_id',
            'song_id'
        );
    }
}

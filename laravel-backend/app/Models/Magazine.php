<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Django table: pages_magazine
 * Has cover_image and file (both FileField stored in media disk).
 * Ordered by: order ASC, -created_at
 */
class Magazine extends Model
{
    protected $table = 'pages_magazine';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;
    public $timestamps = false;

    protected $fillable = [
        'title', 'month_year', 'language',
        'cover_image', 'file', 'order', 'is_active',
    ];

    protected $casts = [
        'is_active'  => 'boolean',
        'order'      => 'integer',
        'created_at' => 'datetime',
    ];
}

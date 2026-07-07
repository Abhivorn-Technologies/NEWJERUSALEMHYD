<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Django table: pages_contentitem
 * JSONField 'links' stores arrays like: [{"text": "PDF", "url": "/path"}]
 * Ordered by: -created_at
 */
class ContentItem extends Model
{
    protected $table = 'pages_contentitem';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;
    public $timestamps = false;

    protected $fillable = [
        'title', 'subtitle', 'page_category', 'section',
        'image_url', 'cover_image', 'links', 'is_active',
    ];

    protected $casts = [
        'links'      => 'array',   // PostgreSQL JSON → PHP array
        'is_active'  => 'boolean',
        'created_at' => 'datetime',
    ];
}

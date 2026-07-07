<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Django table: pages_page
 * Has both created_at (auto_now_add) and updated_at (auto_now).
 */
class Page extends Model
{
    protected $table = 'pages_page';

    // Django uses created_at / updated_at — matches Laravel defaults
    public $timestamps = true;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'title', 'slug', 'content', 'meta_description',
        'is_published', 'wp_post_id',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'created_at'   => 'datetime',
        'updated_at'   => 'datetime',
    ];
}

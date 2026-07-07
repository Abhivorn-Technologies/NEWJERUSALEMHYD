<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Django table: pages_bibleresource — ordered by order ASC */
class BibleResource extends Model
{
    protected $table = 'pages_bibleresource';
    public $timestamps = false;
    protected $fillable = ['title', 'image', 'link', 'order'];
    protected $casts = ['order' => 'integer'];
}

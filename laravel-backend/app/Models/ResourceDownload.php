<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Django table: pages_resourcedownload — ordered by order ASC */
class ResourceDownload extends Model
{
    protected $table = 'pages_resourcedownload';
    public $timestamps = false;
    protected $fillable = ['title', 'category', 'file', 'order'];
    protected $casts = ['order' => 'integer'];
}

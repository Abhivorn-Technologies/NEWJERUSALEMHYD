<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Django table: pages_storycategory — ordered by order ASC */
class StoryCategory extends Model
{
    protected $table = 'pages_storycategory';
    public $timestamps = false;
    protected $fillable = ['title', 'link', 'order'];
    protected $casts = ['order' => 'integer'];
}

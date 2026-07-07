<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Django table: pages_activity — ordered by order ASC */
class Activity extends Model
{
    protected $table = 'pages_activity';
    public $timestamps = false;
    protected $fillable = ['title', 'icon', 'link', 'order'];
    protected $casts = ['order' => 'integer'];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Django table: pages_heroitem — ordered by order ASC */
class HeroItem extends Model
{
    protected $table = 'pages_heroitem';
    public $timestamps = false;
    protected $fillable = ['icon', 'text', 'order'];
    protected $casts = ['order' => 'integer'];
}

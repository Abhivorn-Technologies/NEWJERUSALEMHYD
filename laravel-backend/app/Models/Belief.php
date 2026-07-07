<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Django table: pages_belief — ordered by order ASC */
class Belief extends Model
{
    protected $table = 'pages_belief';
    public $timestamps = false;
    protected $fillable = ['icon', 'title', 'content', 'order'];
    protected $casts = ['order' => 'integer'];
}

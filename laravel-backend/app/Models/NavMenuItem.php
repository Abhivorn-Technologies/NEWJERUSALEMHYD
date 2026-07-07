<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Django table: pages_navmenuitem
 * Self-referential: parent_id → own primary key (nullable).
 * ordered by: order ASC
 */
class NavMenuItem extends Model
{
    protected $table = 'pages_navmenuitem';

    public $timestamps = false;

    protected $fillable = [
        'label', 'url', 'parent_id', 'order', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order'     => 'integer',
    ];

    /**
     * Children of this menu item (sub-menu dropdown items).
     */
    public function children(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(NavMenuItem::class, 'parent_id')
            ->orderBy('order');
    }

    /**
     * Parent menu item (null if top-level).
     */
    public function parent(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(NavMenuItem::class, 'parent_id');
    }
}

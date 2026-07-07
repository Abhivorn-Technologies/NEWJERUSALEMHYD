<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Django table: contact_magazinesubscription
 * Note: timestamp column is 'subscribed_at' (not created_at)
 * Ordered by: -subscribed_at
 */
class MagazineSubscription extends Model
{
    protected $table = 'contact_magazinesubscription';

    public $timestamps = false;

    protected $fillable = [
        'name', 'phone', 'email', 'address', 'is_active',
    ];

    protected $casts = [
        'is_active'     => 'boolean',
        'subscribed_at' => 'datetime',
    ];
}

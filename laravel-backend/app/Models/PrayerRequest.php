<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Django table: contact_prayerrequest
 * Note: timestamp column is 'submitted_at' (not created_at)
 * Ordered by: -submitted_at
 */
class PrayerRequest extends Model
{
    protected $table = 'contact_prayerrequest';

    public $timestamps = false;

    protected $fillable = [
        'name', 'phone', 'request_text', 'is_read',
    ];

    protected $casts = [
        'is_read'      => 'boolean',
        'submitted_at' => 'datetime',
    ];
}

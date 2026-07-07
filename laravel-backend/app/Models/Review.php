<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Django table: reviews_review
 * avatar is an ImageField (stored in media disk).
 * Ordered by: -created_at
 */
class Review extends Model
{
    protected $table = 'reviews_review';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;
    public $timestamps = false;

    protected $fillable = [
        'name', 'designation', 'rating', 'review_text', 'avatar', 'is_approved',
    ];

    protected $casts = [
        'rating'      => 'integer',
        'is_approved' => 'boolean',
        'created_at'  => 'datetime',
    ];
}

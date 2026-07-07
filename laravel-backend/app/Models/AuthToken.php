<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Maps to Django REST Framework's authtoken_token table.
 *
 * Schema:
 *   key     VARCHAR(40) PRIMARY KEY  — 40-char hex token
 *   created TIMESTAMP
 *   user_id INTEGER FK → auth_user
 */
class AuthToken extends Model
{
    protected $table      = 'authtoken_token';
    protected $primaryKey = 'key';
    public $incrementing  = false;
    protected $keyType    = 'string';

    /**
     * The 'created' column serves as the timestamp; no updated_at exists.
     */
    public $timestamps = false;

    protected $fillable = [
        'key',
        'user_id',
        'created',
    ];

    protected $casts = [
        'created' => 'datetime',
    ];

    /**
     * The user this token belongs to.
     */
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(AuthUser::class, 'user_id');
    }
}

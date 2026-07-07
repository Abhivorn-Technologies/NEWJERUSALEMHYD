<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Maps to Django's built-in auth_user table.
 * Django hashes passwords as PBKDF2-SHA256; verified via DjangoPasswordHelper.
 */
class AuthUser extends Authenticatable
{
    protected $table = 'auth_user';

    /**
     * Django uses date_joined, not created_at/updated_at.
     * Disable Eloquent's automatic timestamps.
     */
    public $timestamps = false;

    protected $fillable = [
        'username',
        'password',
        'email',
        'first_name',
        'last_name',
        'is_active',
        'is_staff',
        'is_superuser',
        'date_joined',
        'last_login',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'is_active'      => 'boolean',
        'is_staff'       => 'boolean',
        'is_superuser'   => 'boolean',
        'date_joined'    => 'datetime',
        'last_login'     => 'datetime',
    ];

    /**
     * Relationship to the Django DRF token.
     */
    public function authToken(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(AuthToken::class, 'user_id');
    }

    /**
     * Override the default password check to support Django's PBKDF2 hashes.
     */
    public function verifyPassword(string $password): bool
    {
        return verify_django_password($password, $this->password);
    }
}

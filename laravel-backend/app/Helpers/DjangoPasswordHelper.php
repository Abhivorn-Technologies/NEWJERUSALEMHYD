<?php

/*
|--------------------------------------------------------------------------
| Django Password Helper
|--------------------------------------------------------------------------
| These global functions verify and generate Django-compatible PBKDF2-SHA256
| password hashes. This allows us to authenticate against the existing
| auth_user table without any data migration.
|
| Django PBKDF2-SHA256 format:
|   pbkdf2_sha256$<iterations>$<salt>$<base64-hash>
|
| Example:
|   pbkdf2_sha256$870000$abcdefghij$<base64...>
*/

if (! function_exists('verify_django_password')) {
    /**
     * Verify a plain-text password against a Django PBKDF2-SHA256 hash.
     * Also supports bcrypt (for passwords changed via the Laravel backend).
     */
    function verify_django_password(string $password, string $encoded): bool
    {
        // bcrypt (Laravel-generated after migration)
        if (str_starts_with($encoded, '$2y$') || str_starts_with($encoded, '$2b$')) {
            return password_verify($password, $encoded);
        }

        // Django PBKDF2-SHA256
        $parts = explode('$', $encoded, 4);
        if (count($parts) !== 4) {
            return false;
        }

        [$algorithm, $iterations, $salt, $hash] = $parts;

        if ($algorithm !== 'pbkdf2_sha256') {
            return false;
        }

        $derived  = hash_pbkdf2('sha256', $password, $salt, (int) $iterations, 32, true);
        $computed = base64_encode($derived);

        return hash_equals($hash, $computed);
    }
}

if (! function_exists('make_django_password')) {
    /**
     * Create a Django-compatible PBKDF2-SHA256 password hash.
     * Used when changing the admin password via the change-password endpoint.
     */
    function make_django_password(string $password, ?string $salt = null, int $iterations = 870000): string
    {
        if ($salt === null) {
            $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            $salt  = '';
            for ($i = 0; $i < 22; $i++) {
                $salt .= $chars[random_int(0, strlen($chars) - 1)];
            }
        }

        $derived = hash_pbkdf2('sha256', $password, $salt, $iterations, 32, true);
        $hash    = base64_encode($derived);

        return "pbkdf2_sha256\${$iterations}\${$salt}\${$hash}";
    }
}

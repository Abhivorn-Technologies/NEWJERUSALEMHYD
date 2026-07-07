<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Django table: pages_sitesettings
 * Singleton — Django enforces pk=1; only one row ever exists.
 */
class SiteSettings extends Model
{
    protected $table = 'pages_sitesettings';

    public $timestamps = false;

    protected $fillable = [
        'site_name', 'phone1', 'phone2', 'email',
        'address', 'footer_tagline',
    ];

    /**
     * Mimic Django's SiteSettings.load() class method.
     * Returns the singleton instance, creating it if it doesn't exist.
     */
    public static function load(): self
    {
        return static::firstOrCreate(['id' => 1], [
            'site_name'      => 'New Jerusalem Ministries',
            'phone1'         => '',
            'phone2'         => '',
            'email'          => '',
            'address'        => '',
            'footer_tagline' => '',
        ]);
    }
}

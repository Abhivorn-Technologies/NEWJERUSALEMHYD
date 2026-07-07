<?php

return [
    'default' => env('FILESYSTEM_DISK', 'local'),

    'disks' => [
        'local' => [
            'driver' => 'local',
            'root'   => storage_path('app/private'),
            'serve'  => true,
            'throw'  => false,
        ],

        'public' => [
            'driver'     => 'local',
            'root'       => storage_path('app/public'),
            'url'        => env('APP_URL').'/storage',
            'visibility' => 'public',
            'throw'      => false,
        ],

        /*
        |----------------------------------------------------------------------
        | Media Disk — points to the SAME directory Django uses.
        | Django: MEDIA_ROOT = d:\NEWJERUSALEMHYD\media
        | Laravel: base_path('../media') = d:\NEWJERUSALEMHYD\media
        |
        | All existing uploaded files (songs, covers, magazines, reviews)
        | are served at /media/{path} exactly as before.
        |----------------------------------------------------------------------
        */
        'media' => [
            'driver'     => 'local',
            'root'       => base_path('../media'),
            'url'        => env('APP_URL').'/media',
            'visibility' => 'public',
            'throw'      => false,
        ],
    ],

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],
];

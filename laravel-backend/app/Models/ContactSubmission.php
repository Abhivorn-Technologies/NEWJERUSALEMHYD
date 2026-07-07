<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Django table: contact_contactsubmission
 * Note: timestamp column is 'submitted_at' (not created_at)
 */
class ContactSubmission extends Model
{
    protected $table = 'contact_contactsubmission';

    public $timestamps = false;

    protected $fillable = [
        'name', 'email', 'phone', 'subject', 'message', 'is_read',
    ];

    protected $casts = [
        'is_read'      => 'boolean',
        'submitted_at' => 'datetime',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SweepstarProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sweepstar_profiles';

    protected $fillable = [
        'user_id',
        'bio',
        'id_number',
        'hourly_rate',
        'is_verified',
        'total_jobs_completed',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'hourly_rate' => 'decimal:2',
        'total_jobs_completed' => 'integer',
    ];

    // Link back to the User (Login account)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

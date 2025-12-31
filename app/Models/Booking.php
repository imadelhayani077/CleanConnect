<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',        // client
        'sweepstar_id',   // assigned cleaner (nullable)
        'address_id',
        'scheduled_at',
        'duration_hours',
        'total_price',
        'status',
        'notes',          // Added this based on your Controller validation
    ];

    protected $casts = [
        'scheduled_at'   => 'datetime',
        'total_price'    => 'decimal:2',
        'duration_hours' => 'integer',
        'status'         => 'string',
    ];

    // --- Relationships ---

    /** * FIX: Renamed from 'client' to 'user' so Controller can call ->with('user')
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** Sweepstar assigned to the job (nullable) */
    public function sweepstar()
    {
        return $this->belongsTo(User::class, 'sweepstar_id');
    }

    /** Address where the service will be performed */
    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'booking_service')
            ->withPivot('price_at_booking')
            ->withTimestamps();
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }
}

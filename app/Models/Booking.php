<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

  protected $fillable = [
    'user_id',
    'sweepstar_id',
    'address_id',
    'scheduled_at',
    'duration_minutes',
    'total_price',
    'original_price',
    'status',
    'notes',
    'cancellation_reason',
];

    protected $casts = [
        'scheduled_at'     => 'datetime',
        'total_price'      => 'decimal:2',
        'duration_minutes' => 'integer',
        'status'           => 'string',
    ];

    public function user() { return $this->belongsTo(User::class, 'user_id'); }
    public function sweepstar() { return $this->belongsTo(User::class, 'sweepstar_id'); }
    public function address() { return $this->belongsTo(Address::class); }
    public function review() { return $this->hasOne(Review::class); }

public function bookingServices() // Ensure this is PLURAL if controller uses plural
{
    return $this->hasMany(BookingService::class);
}


    public function service()
{
    return $this->hasOneThrough(
        Service::class,
        BookingService::class,
        'booking_id', // Foreign key on booking_service table
        'id',         // Foreign key on services table
        'id',         // Local key on bookings table
        'service_id'  // Local key on booking_service table
    );
}
}

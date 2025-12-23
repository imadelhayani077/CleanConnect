<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class BookingService extends Model
{
    protected $table = 'booking_service';

    protected $fillable = [
        'booking_id',
        'service_id',
        'price_at_booking',
    ];

    protected $casts = [
        'price_at_booking' => 'decimal:2',
    ];

    // Relationships (if you need to access from the pivot)
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}

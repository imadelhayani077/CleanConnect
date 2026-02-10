<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingService extends Model
{
    protected $table = 'booking_service';

 protected $fillable = [
        'booking_id',
        'service_id',
        'total_price',            // Matches database
        'total_duration_minutes', // Matches database
    ];

    protected $casts = [
        // REMOVE: 'base_price_at_booking' => 'decimal:2',
        'total_price'            => 'decimal:2',
        'total_duration_minutes' => 'integer',
    ];

    public function booking() { return $this->belongsTo(Booking::class); }
    public function service() { return $this->belongsTo(Service::class); }

    public function selectedOptions()
    {
        return $this->hasMany(BookingServiceOption::class, 'booking_service_id');
    }

    public function selectedExtras()
    {
        return $this->hasMany(BookingServiceExtra::class, 'booking_service_id');
    }
}

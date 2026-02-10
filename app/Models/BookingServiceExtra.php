<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingServiceExtra extends Model
{
    protected $fillable = ['booking_service_id', 'service_extra_id'];
    public $timestamps = false;
    public function bookingService()
    {
        return $this->belongsTo(BookingService::class);
    }

    public function extra()
    {
        return $this->belongsTo(ServiceExtra::class, 'service_extra_id');
    }
}

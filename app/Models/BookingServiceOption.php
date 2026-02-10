<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingServiceOption extends Model
{
    protected $fillable = ['booking_service_id', 'service_option_id'];
    public $timestamps = false;

    public function bookingService()
    {
        return $this->belongsTo(BookingService::class);
    }

    public function option()
    {
        return $this->belongsTo(ServiceOption::class, 'service_option_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'services'; // Optional but good practice

    protected $fillable = [
        'name',
        'description',
        'base_price',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
    ];


public function bookings()
{
    return $this->belongsToMany(Booking::class, 'booking_service')
                ->withPivot('price_at_booking')
                ->withTimestamps();
}

}

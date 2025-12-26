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
    ];

    protected $casts = [
        'scheduled_at'   => 'datetime',
        'total_price'    => 'decimal:2',
        'duration_hours' => 'integer',
        'status'         => 'string',
    ];

    // Relationships

    /** Client who made the booking */
    public function client()
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
                ->withPivot('price_at_booking')  // Access the snapshot price
                ->withTimestamps();              // If you want created_at/updated_at on pivot
}
  public function review()
    {
        return $this->hasOne(Review::class);
    }

    //    // Scopes for filtering
    // public function scopePending($query)
    // {
    //     return $query->where('status', 'pending');
    // }

    // public function scopeCompleted($query)
    // {
    //     return $query->where('status', 'completed');
    // }

}

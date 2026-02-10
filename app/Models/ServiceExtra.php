<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceExtra extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'name',
        'description',
        'extra_price',
        'duration_minutes'
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}

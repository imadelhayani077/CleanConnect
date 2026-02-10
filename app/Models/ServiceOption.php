<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'option_group',
        'name',
        'option_price',
        'duration_minutes',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}

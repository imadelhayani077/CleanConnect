<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('booking_service_extras', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_service_id')->constrained('booking_service')->onDelete('cascade');
            $table->foreignId('service_extra_id')->constrained()->onDelete('cascade');
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_service_extras');
    }
};

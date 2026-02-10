<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            // Relationships
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // The Client
            $table->foreignId('sweepstar_id')->nullable()->constrained('users')->onDelete('set null'); // The Cleaner
            $table->foreignId('address_id')->constrained()->onDelete('cascade');

            // Booking Details
            $table->dateTime('scheduled_at');
            $table->integer('duration_minutes')->default(120);
            $table->decimal('total_price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
             $table->text('cancellation_reason')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};

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
        Schema::create('bookings', function (Blueprint $table) {
    $table->id();
    // The Client
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    // The SweepStar (Nullable initially)
    $table->foreignId('sweepstar_id')->nullable()->constrained('users')->onDelete('set null');
    // The Address
    $table->foreignId('address_id')->constrained();

    $table->dateTime('scheduled_at');
    $table->integer('duration_hours')->default(2);
    $table->decimal('total_price', 10, 2);
    $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');

    $table->timestamps();
    $table->softDeletes(); // <--- Soft Delete
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};

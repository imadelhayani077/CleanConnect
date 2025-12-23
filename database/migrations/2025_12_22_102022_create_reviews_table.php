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
      Schema::create('reviews', function (Blueprint $table) {
    $table->id();
    $table->foreignId('booking_id')->constrained()->onDelete('cascade');
    // Who wrote the review
    $table->foreignId('reviewer_id')->constrained('users');
    // Who is being reviewed
    $table->foreignId('target_id')->constrained('users');

    $table->integer('rating'); // 1 to 5
    $table->text('comment')->nullable();

    $table->timestamps();
    $table->softDeletes(); // <--- Soft Delete
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};

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
        Schema::create('services', function (Blueprint $table) {
    $table->id();
    $table->string('name'); // e.g., 'Indoor Cleaning'
    $table->text('description')->nullable();
    $table->decimal('base_price', 8, 2);

    $table->timestamps();
    $table->softDeletes(); // <--- Soft Delete
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};

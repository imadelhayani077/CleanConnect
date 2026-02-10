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
       Schema::create('sweepstar_profiles', function (Blueprint $table) {
    $table->id();
    // Links to Users table
    $table->foreignId('user_id')->constrained()->onDelete('cascade');

    $table->text('bio')->nullable();
    $table->string('id_number')->nullable();
    $table->decimal('hourly_rate', 8, 2)->default(25.00);
    $table->boolean('is_verified')->default(false);
     $table->boolean('is_available')->default(false);
    $table->integer('total_jobs_completed')->default(0);

    $table->timestamps();
    $table->softDeletes(); // <--- Soft Delete
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sweepstar_profiles');
    }
};

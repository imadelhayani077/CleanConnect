<?php

use Illuminate\Database\Migrations\Migration;

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sweepstar_profiles', function (Blueprint $table) {
            // Default to 'true' (Online) or 'false' (Offline) as you prefer
            $table->boolean('is_available')->default(false)->after('is_verified');
        });
    }

    public function down(): void
    {
        Schema::table('sweepstar_profiles', function (Blueprint $table) {
            $table->dropColumn('is_available');
        });
    }
};

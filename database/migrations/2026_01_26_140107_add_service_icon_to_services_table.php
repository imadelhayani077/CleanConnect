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
    Schema::table('services', function (Blueprint $table) {
        // We make it nullable in case they create a service without an icon initially
        $table->string('service_icon')->nullable()->after('base_price');
    });
}

public function down(): void
{
    Schema::table('services', function (Blueprint $table) {
        $table->dropColumn('service_icon');
    });
}
};

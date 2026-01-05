<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::table('bookings', function (Blueprint $table) {
        // Add a nullable text column for the reason
        $table->text('cancellation_reason')->nullable()->after('notes');
    });
}

public function down()
{
    Schema::table('bookings', function (Blueprint $table) {
        $table->dropColumn('cancellation_reason');
    });
}
};

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
        Schema::table('seats', function (Blueprint $table) {
            // Add index to the 'plane_id' column
            $table->index('plane_id');

            // Add index to the 'flight_class_id' column
            $table->index('flight_id');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('seats', function (Blueprint $table) {
            $table->dropIndex('seats_plane_id_index');
            $table->dropIndex('seats_flight_id_index');
        });
    }
};

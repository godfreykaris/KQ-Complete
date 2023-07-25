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
        Schema::create('seats', function (Blueprint $table) {
            $table->id();
            $table->string('seat_number');
            $table->float('price');
            $table->boolean('is_available')->default(true);
            $table->foreignId('plane_id')->nullable()->constrained('planes')->onDelete('cascade');
            $table->foreignId('flight_id')->nullable()->constrained('flights')->onDelete('cascade');
            $table->foreignId('flight_class_id')->nullable()->constrained('flight_classes')->onDelete('cascade');
            $table->foreignId('location_id')->constrained('seat_locations')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seats');
    }
};

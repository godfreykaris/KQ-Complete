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
        Schema::create('passengers', function (Blueprint $table) {
            $table->id();
            $table->string('passenger_id')->unique();
            $table->string('name');
            $table->date('date_of_birth');

            /* Add the identification_number column for doemstic travels. This can be ID number for
              adults  and birth certificate number for children*/
            $table->string('identification_number')->nullable();
            
            // Add the passport_number column for international travel (both adults and children)
            $table->string('passport_number')->nullable();
            
            $table->foreignId('seat_id')->constrained('seats')->onDelete('cascade');
            $table->foreignId('booking_id')->constrained('bookings')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('passengers');
    }
};

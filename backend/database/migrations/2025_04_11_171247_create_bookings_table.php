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
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('car_id');
            $table->string('car_name');
            $table->decimal('car_price', 10, 2);
            $table->string('car_category')->nullable();
            $table->string('car_image')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('total_days');
            $table->string('pickup_location');
            $table->string('dropoff_location');
            $table->json('options')->nullable();
            $table->decimal('options_price', 10, 2)->default(0);
            $table->decimal('total_price', 10, 2);
            $table->string('status')->default('pending');
            $table->timestamps();
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

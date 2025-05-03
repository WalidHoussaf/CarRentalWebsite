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
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('brand');
            $table->string('model');
            $table->year('year');
            $table->string('color');
            $table->string('license_plate')->unique();
            $table->decimal('daily_rate', 8, 2);
            $table->text('description')->nullable();
            $table->enum('category', ['economy', 'compact', 'midsize', 'suv', 'luxury', 'sport', 'sports'])->default('economy');
            $table->string('transmission');
            $table->integer('seats');
            $table->integer('doors');
            $table->boolean('air_conditioning')->default(false);
            $table->boolean('gps')->default(false);
            $table->boolean('bluetooth')->default(false);
            $table->boolean('usb')->default(false);
            $table->string('fuel_type');
            $table->boolean('is_available')->default(true);
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};

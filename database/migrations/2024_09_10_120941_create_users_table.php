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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('company')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->unique();
            $table->string('country_code')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('deactivated_until')->nullable();
            $table->string('password');
            $table->integer('plan_id')->nullable();
            $table->foreign('plan_id')->references('plan_no')->on('plans')->onDelete('cascade');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

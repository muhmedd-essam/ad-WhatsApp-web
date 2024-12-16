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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
        $table->string('name');
        $table->string('job_title');
        $table->string('password');
        $table->string('email')->unique();
        $table->string('phone_number');
        $table->unsignedBigInteger('user_id');
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        $table->enum('permissions', [
            'المراسلة الفردية',
            'المراسلة الجماعية',
            'الرد التلقائي والروبوت الذكي',
            'جمل الاتصال',
            'إدارة الملفات',
            'المنصات المرتبطة',
            'المطورين'
        ]);
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};

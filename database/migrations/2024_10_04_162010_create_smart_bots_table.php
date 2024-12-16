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
        Schema::create('smart_bots', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // العلاقة مع جدول المستخدمين
            $table->string('name'); // اسم الروبوت
            $table->string('whatsapp_number'); // رقم واتساب الروبوت
            $table->string('keyword'); // الكلمة المفتاحية
            $table->string('custom_navigation_message')->nullable(); // رسالة التنقل المخصصة
            $table->json('tree'); // تخزين شجرة الخيارات كـ JSON
            $table->timestamps();

            // إعداد علاقة مع جدول المستخدمين
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('smart_bots');
    }
};

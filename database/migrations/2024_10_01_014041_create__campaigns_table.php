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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // اسم الحملة
            $table->unsignedBigInteger('whatsapp_account'); // حساب الواتساب
            $table->json('contact_list');
            $table->date('start_date'); // تاريخ بدء الحملة
            $table->date('end_date')->nullable(); // تاريخ نهاية الحملة (اختياري)
            $table->time('start_time'); // وقت بدء الإرسال
            $table->time('end_time'); // وقت نهاية الإرسال
            $table->integer('min_delay')->default(1); // الفاصل الأدنى بين الرسائل بالثواني
            $table->integer('max_delay')->default(5); // الفاصل الأقصى بين الرسائل بالثواني
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps(); // تاريخ الإنشاء والتعديل
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_campaigns');
    }
};

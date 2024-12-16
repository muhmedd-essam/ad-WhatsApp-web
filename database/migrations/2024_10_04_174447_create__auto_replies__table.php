<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * تشغيل الميجرايشن.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('auto_replies', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('smart_bot_id'); // العلاقة مع جدول الروبوتات الذكية
            $table->boolean('include_ai_map'); // هل يشمل خريطة الذكاء الاصطناعي
            $table->boolean('include_group_message_intro'); // هل يشمل مقدمة الرسالة الجماعية
            $table->boolean('include_buttons'); // هل يشمل الأزرار
            $table->json('messages'); // قائمة الرسائل
            $table->timestamps();

            // إعداد علاقة مع جدول الروبوتات الذكية
            $table->foreign('smart_bot_id')->references('id')->on('smart_bots')->onDelete('cascade');
        });
    }

    /**
     * التراجع عن الميجرايشن.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('auto_replies');
    }
};

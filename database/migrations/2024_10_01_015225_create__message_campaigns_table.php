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
        Schema::create('message_campaigns', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('campaign_id'); // الحملة المرتبطة
            $table->unsignedBigInteger('user_id'); // المستخدم الذي أرسل الرسالة
            $table->string('receive_number'); // رقم المستقبل
            $table->text('body'); // محتوى الرسالة
            $table->timestamp('sent_at'); // وقت الإرسال
            $table->timestamps();

            // العلاقات
            $table->foreign('campaign_id')->references('id')->on('campaigns')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('message_campaigns');
    }
};

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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->integer('plan_no')->unique();
            $table->string('name'); // اسم الخطة
            $table->integer('whatsapp_accounts_limit'); // عدد حسابات الواتساب
            $table->integer('daily_message_limit'); // الحد الأقصى للإرسال اليومي
            $table->integer('monthly_message_limit'); // الحد الأقصى للإرسال الشهري
            $table->text('supported_message_types'); // أنواع الرسائل المدعومة
            $table->integer('active_sessions_per_account'); // عدد الجلسات النشطة لكل حساب
            $table->integer('contact_lists_count'); // عدد قوائم الاتصال
            $table->integer('max_contacts_per_list'); // الحد الأقصى لجهات الاتصال بكل قائمة
            $table->boolean('auto_reply')->default(false); // الرد التلقائي
            $table->integer('smart_sessions_per_account'); // الجلسات الذكية لكل حساب
            $table->boolean('individual_messaging')->default(false); // المراسلة الفردية
            $table->boolean('employees')->default(false); // الموظفين (إذا كان يوجد دعم للموظفين)
            $table->integer('max_file_size_mb'); // الحد الأقصى لحجم الملفات
            $table->integer('storage_size_mb'); // مساحة التخزين
            $table->text('supported_platforms'); // المنصات المدعومة
            $table->boolean('developer_access')->default(false); // الوصول للمطورين
            $table->decimal('monthly_price', 8, 2); // السعر الشهري
            $table->decimal('yearly_price', 8, 2); // السعر السنوي
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};

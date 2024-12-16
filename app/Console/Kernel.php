<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly();

        // تشغيل الـ Job كل دقيقة
    $schedule->call(function () {
        // حدد التوقيت الحالي بالثواني
        $currentSecond = now()->format('s');

        // تحقق إذا كانت الثواني مقسومة على 3 دون باقي
        if ($currentSecond % 3 == 0) {
            // استدعاء الـ Job لإرسال الرسائل
            dispatch(new \App\Jobs\SendCampaignMessageJob());
        }
    })->everyMinute();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}

<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\Campaign;
use App\Models\CampaignContact;
use App\Models\Contact;
use App\Models\MessageCampaign;

class SendCampaignMessages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'campaign:send-messages'; // تعريف اسم الأمر


    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send messages for active campaigns'; // وصف الأمر

    // public function __construct()
    // {
    //     parent::__construct();
    // }
    /**
     * Execute the console command.
     */
    public function handle()
    {
        // جلب الحملة النشطة مع جهات الاتصال التي لم يتم إرسال رسائل إليها
        $activeCampaigns = Campaign::with(['user', 'contacts'])->where('status', 0)
        ->where('start_time', '<=', now())
        ->where('end_time', '>=', now())
        ->whereRaw('UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(last_message_delay) > delay')
        ->get();


            // return response()->json($activeCampaigns);


        // مصفوفة لتخزين الرسائل التي سيتم إنشاؤها
        $messagesToCreate = [];
        $campaignsToUpdate = [];

        foreach($activeCampaigns as $campaign) {
            $contact = $campaign->contacts->first(); // احصل على أول جهة اتصال لم يتم إرسال رسالة لها

            if ($contact) {
                // $alreadySent = MessageCampaign::where('campaign_id', $campaign->id)
                //     ->where('receive_number', $contact->phone_number)
                //     ->exists();

                // if (!$alreadySent) {
                    // إذا لم يتم إرسال الرسالة، قم بإنشاء الرسالة
                    $messagesToCreate[] = [
                        'campaign_id' => $campaign->id,
                        'user_id' => $campaign->user->id,
                        'receive_name' => $contact->name,
                        'receive_number' => $contact->phone_number,
                        'sender_number' => $campaign->user->phone,
                        'body' => $campaign->body,
                    ];

                    // تحديث حالة sent_message لجهة الاتصال
                    $campaignsToUpdate[] = [
                        'campaign_id' => $campaign->id,
                        'contact_id' => $contact->id,
                    ];

                }
            
        }
            // dd($campaignsToUpdate);
            // return response()->json($campaignsToUpdate);

                    // إدخال الرسائل دفعة واحدة
                    MessageCampaign::insert($messagesToCreate);

                    // تحديث حالة sent_message للجهات الاتصال دفعة واحدة
                    foreach ($campaignsToUpdate as $update) {
                        CampaignContact::where('campaign_id', $update['campaign_id'])
                            ->where('contact_id', $update['contact_id'])
                            ->update(['sent_message' => 1]);
                            // dd();
                    }

                    // // تحديث آخر وقت للإرسال والحد الزمني للحملة دفعة واحدة
                    foreach ($activeCampaigns as $campaign) {
                        $campaign->update([
                            'last_message_delay' => now(),
                            'delay' => rand($campaign->min_delay, $campaign->max_delay),
                        ]);
                    }
                            $this->info('Messages sent successfully!');
    }
}

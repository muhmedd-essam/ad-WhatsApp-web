<?php

namespace App\Jobs;

use App\Models\Campaign;
use App\Models\Contact;
use App\Models\MessageCampaign;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendCampaignMessageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $activeCampaigns = Campaign::with('user')->where('start_time', '<=', now())
                            ->where('end_time', '>=', now())
                            ->whereRaw('UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(last_message_delay) > delay')
                            ->get();
                            foreach($activeCampaigns as $campaign){

                                $contacts = Contact::where('list_name', $campaign->contact_list)->get();

                                foreach($contacts as $contact){
                                    $alreadySent = MessageCampaign::where('campaign_id', $campaign->id)
                                    ->where('receive_number', $contact->phone_number)->where('body', $campaign->body)
                                    ->exists();


                                    if (!$alreadySent) {

                                        // إذا لم يتم إرسال الرسالة لهذا الرقم، قم بإنشاء الرسالة
                                        $message = MessageCampaign::create([
                                            'campaign_id' => $campaign->id,
                                            'user_id' => $campaign->user->id,
                                            'receive_name' => $contact->name,
                                            'receive_number' => $contact->phone_number,
                                            'sender_number' => $campaign->user->phone,
                                            'body' => $campaign->body,
                                        ]);

                                        // تحديث وقت التأخير الأخير للحملة
                                        $campaign->update(['last_message_delay' => now()]);
                                        $campaign->update(['delay' => rand($campaign->min_delay, $campaign->max_delay)]);

                                        // رجوع بالاستجابة بعد إرسال الرسالة
                                        // return response()->json($contact);
                                    }

                                    break;
                                }



                            }
    }
}

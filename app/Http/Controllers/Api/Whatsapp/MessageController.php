<?php

namespace App\Http\Controllers\Api\Whatsapp;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\CampaignContact;
use App\Models\Contact;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\MessageCampaign;
use App\Models\Plan;
use App\Models\User;
use App\Models\UserState;
use App\Models\SmartBot;
use App\Models\Number;
use App\Models\AutoReply;

use Illuminate\Http\Request;
use App\Traits\WebTrait;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    use WebTrait;

    public function index()
    {
        try {
            $userId = auth()->user()->id;
            // Retrieve all messages
            $messages = Message::where('user_id', $userId)->with('conversation','user', 'employee')->get();
            return $this->data($messages, 'Successfully retrieved data.');
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
{
    try {
        
        // Validate input including images, videos, and URLs
        $request->validate([
            'conversation_id' => 'nullable',
            'sender_number' => 'required|string|max:255',
            'receive_number' => 'required|string|max:255',
            'body' => 'nullable|string',
            'user_id' => 'required',
            'employee_id' => 'nullable',
            'receiver_name' => 'required|string|max:255',
            'type' => 'required|string|max:255',  // Can be 'text', 'image', 'video', 'url'
            'type_message' => 'required|string|max:255',  // Can be 'text', 'image', 'video', 'url'
            'file_path' => 'nullable',

        ]);
// dd('ss');
        $user = auth()->user();
        $planId = $user->plan_id;
        $plan = Plan::where('plan_no', $planId)->first();
        $supportedMessageTypes = array_map('trim', explode(',', $plan->supported_message_types));

        // Check if type_message is supported by the plan
        if (!in_array($request->input('type_message'), $supportedMessageTypes)) {
            return response()->json([
                'success' => false,
                'error' => 'نوع الرسالة غير مدعوم في خطتك: ' . $request->input('type_message')
            ], 400);
        }
        $count = Message::countMessagesBetween($user->plan_time_starts, $user->plan_time_ends);

        if ($count > $plan->monthly_message_limit) {
            return response()->json(['success' => false, 'error' => 'عدد الرسائل المتاح ليك في الشهر خلص'], 500);
        }

        $startOfDay = Carbon::now()->startOfDay();
        $endOfDay = Carbon::now()->endOfDay();

        // Count daily messages
        $countInDay = Message::countMessagesBetween($startOfDay, $endOfDay);
        if ($countInDay >= $plan->daily_message_limit) {
            return response()->json(['success' => false, 'error' => 'عدد الرسائل المتاح ليك في اليوم خلص'], 500);
        }

        // Store file if uploaded
        // $filePath = null;

        // if ($request->hasFile('file_path') && $request->file('file_path')->isValid()) {
        //         $filePath = $request->file('file_path')->store('uploads', 'public');
        //     }


        // Create the message object
        $messageData = $request->only([
            'conversation_id', 'sender_number', 'receive_number',
            'body', 'user_id', 'employee_id', 'receiver_name', 'type','type_message','url', 'file_path'
        ]);

        // Add file path if file is uploaded
        // if ($filePath) {
        //     $messageData['file_path'] = $filePath;
        // }

        // dd($messageData);

        // Add URL if provided
        // if ($request->has('url')) {
        //     $messageData['url'] = $request->input('url');
        // }

        // Create the message
        $message = Message::create($messageData);

        // Update counts
        $message->yourMessagesCountInMonth = $count + 1;
        $message->yourFreeMessagesCountInMonth = $plan->monthly_message_limit - ($count + 1);
        $message->yourMessagesCountInDay = $countInDay + 1;
        $message->yourFreeMessagesCountInDay = $plan->daily_message_limit - ($countInDay + 1);

        return $this->data($message, 'Successfully created and sent message.');
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    public function receive(Request $request)
    {
        try {

            // Validate input
            $request->validate([
                // 'conversation_id' => '',
                'sender_number' => 'required|string|max:255',
                'receive_number' => 'required|string|max:255',
                'body' => 'required|string',
                // 'user_id' => 'required',
                // 'employee_id' => 'nullable',
                // 'receiver_name' => 'required|string|max:255',
                
                'type_message' => 'required|string|max:255',  // 'text', 'image', 'video', 'url'
                'file' => 'nullable|file|mimes:jpg,jpeg,png,mp4,avi|max:20480', // دعم رفع الصور والفيديوهات
            ]);
            
// return $this->error(404, msg: 'User not found');


            try {
               
                $number = Number::with('user')->where('phone_number', $request->receive_number)->first();
                $conversation = Conversation::with('messages')->where('phone', $request->receive_number )->where('phone_sender', $request->sender_number)->first();
                // return $this->data(
                //                         [
                //                             'autoReply' => 'on',
                //                             'details' => $conversation
                //                         ],
                //                         'Message matched bot keyword, bot interaction triggered.'
                //                     );
//  dd('ss');
                $user= $number->user;
                $autoReply =AutoReply::where('number',$request->receive_number)->first();
                $userState = UserState::where('phone_number', $request->sender_number)->where('phone_reciever',$request->receive_number )->first();
               
                $bots = SmartBot::where('user_id', $user->id)->where('status', 'on')->get();
                
                
                 if ($userState !== null && $userState->current_node == "stop") {
                        // التحقق إذا كانت الرسالة body تطابق أي كلمة مفتاحية لأي بوت
                        if ($bots->isNotEmpty()) {
                            foreach ($bots as $bot) {
                                if ($request->body == $bot->keyword ) {
                                    $autoReply= null;
                                    // السماح بالتفاعل مع الروبوت إذا كانت body مطابقة للـ keyword
                                    return $this->data(
                                        [
                                            'autoReply' => 'on',
                                            'details' => $this->handleUserInteraction($user->id, $request->sender_number, $request->body,$autoReply, $request->receive_number )['response']
                                        ],
                                        'Message matched bot keyword, bot interaction triggered.'
                                    );
                                }
                            }
                        }
                        // إذا لم تكن body مطابقة لأي keyword
                        return $this->data(
                            [
                                'autoReply' => 'off',
                                'details' => 'User is in stop state and message does not match any bot keyword.'
                            ],
                            'User state is stop, no further action taken.'
                        );
                    }
                    
                    
                    
                                 
                
                if($autoReply !== null && $autoReply->status == "on" && $autoReply->include_ai_map == 1 && $conversation == null){
                    
        
                    
                    return $this->data(
                            [
                                'autoReply' => 'on',
                                'details' => $this->handleUserInteraction( $user->id ,$request->sender_number, $request->body, $autoReply, $request->receive_number)['response']
                            ],
                            'Successfully created and sent message.'
                        );                    
                }elseif($autoReply !== null && $autoReply->status == "on" && $autoReply->include_ai_map == 0 && $conversation == null){
                    
                    // dd($autoReply->messages);
                    return $this->data(
                                    [
                                        'autoReply' => 'on',
                                        'details' => $autoReply->messages
                                    ],
                                    'Successfully created and sent message.'
                                );
                    
                }elseif($bots->isNotEmpty() && $conversation == null){
                    $autoReply= null;
                    foreach ($bots as $bot){
                        
                            if( $request->body == $bot->keyword || $userState == null || $userState->current_node == 'stop' || $conversation == null ){
                                    return $this->data(
                                        [
                                            'autoReply' => 'on',
                                            'details' => $this->handleUserInteraction( $user->id ,$request->sender_number, $request->body, $autoReply, $request->receive_number)['response']
                                        ],
                                        'Successfully created and sent message.'
                                    );
                                }
                        
                    }
                    
                    
                    
                    
                }
        


            } catch (ModelNotFoundException $e) {
                return $this->error(404, 'User not found');
            }



            $conversation = Conversation::with('messages')->where('phone', $request->sender_number)->where('phone_sender', $request->receive_number)->first();
            // dd($conversation);
        //     dd($conversation);
        //     if (!$conversation) {
        //     return $this->error(404, 'Conversation not found');
        // }
            
            $filePath = null;
if ($request->hasFile('file')) {
    $filePath = $request->file('file')->store('uploads', 'public');
}
            // dd($conversation);

            // return $this->data($conversation, 'Successfully created and sent message.');

// dd($conversation);

            // return $this->data($conversation, 'Successfully created and sent message.');
            
            
            

            $messageData = [
                'conversation_id' => $conversation->id, // استخدام المعرف الخاص بالمحادثة
                'sender_number' => $request->sender_number, // رقم المرسل من المحادثة
                'receive_number' => $request->receive_number, // الرقم الذي استقبل الرسالة
                'body' => $request->body, // محتوى الرسالة
                'user_id' => $user->id, // معرف المستخدم المرتبط
                'type' => 'received',
                // 'employee_id' => $request->input('employee_id'), // معرف الموظف، إذا كان موجودًا
                'receiver_name' => $user->name, // اسم المستلم
                'type_message' => $request->input('type_message'),  // نوع الرسالة
            ];

            if ($request->input('type_message') == 'Text') {
                $messageData['body'] = $request->input('body');
            } elseif ($request->input('type_message') == 'Image' || $request->input('type_message') == 'Video') {
                if ($filePath) {
                    $messageData['file_path'] = $filePath;  // حفظ مسار الملف
                } else {
                    return $this->error(400, 'File is required for Image/Video type');
                }
            }

            // Create the message in the database
            $message = Message::create($messageData);
            return $this->data(
        [
            'autoReply' => 'off',
            'details' => $message
        ],
        'Successfully created and sent message.'
    );
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
function handleUserInteraction($id ,$userId, $input = null, $autoReply, $receive_number) {
    
    // dd('ss');
    
    // 1. Fetch user state
    $userState = UserState::where('phone_number', $userId)->where('phone_reciever', $receive_number )->first();
    
    $bots = SmartBot::where('user_id', $id)->where('status', 'on')->get();
    


    // 2. إذا كان المستخدم جديدًا
    if (!$userState || !is_numeric($input) || $userState->current_node == "start" ) {
        // Fetch all available bots
        

        // إذا لم يتم إدخال أي مدخل أو المدخل ليس رقمًا
        if ($input === null) {
            if ($autoReply !== null){
                $response = $autoReply->messages;
                
                 $response .= "مرحبًا بك! اختر أحد الروبوتات التالية:\n";
                    foreach ($bots as $index => $bot) {
                        $response .= ($index + 1) . ". " . $bot->name . "\n";
                    }
                    
                    return ['response' => $response];
                
            }
            $response = "مرحبًا بك! اختر أحد الروبوتات التالية:\n";
            foreach ($bots as $index => $bot) {
                $response .= ($index + 1) . ". " . $bot->name . "\n";
            }
            
            return ['response' => $response];
        } 
       

        // إذا تم إدخال رقم
        
        if ($input === null || !is_numeric($input)) {
            if ($autoReply !== null){
                $response = $autoReply->messages;
                
                 $response .= "\n مرحبًا بك! اختر أحد الروبوتات التالية  :\n";
                    foreach ($bots as $index => $bot) {
                        $response .= ($index + 1) . ". " . $bot->name . "\n";
                    }
                    
                    return ['response' => $response];
                
            }
            $response = "مرحبًا بك! اختر أحد الروبوتات التالية:\n";
            foreach ($bots as $index => $bot) {
                $response .= ($index + 1) . ". " . $bot->name . "\n";
            }
            if(!is_null($userState)){
                $userState->current_node = 'root';
                $userState->previous_node = null ;
                $userState->update();
            }
            
            
            return ['response' => $response];
        }
        
        
        $botIndex = $input - 1;
        if (!isset($bots[$botIndex])) {
            return ['response' => "اختيار غير صحيح. الرجاء المحاولة مرة أخرى."];
        }

        $selectedBot = $bots[$botIndex];
        

    UserState::create([
            'phone_number' => $userId,
            'current_bot' => $selectedBot->id,
            'current_node' => 'root',
            'previous_node' => null, 
            'phone_reciever' => $receive_number
    
        ]);

        // Create new user state
        

        // Fetch the bot tree
        $tree = $selectedBot->tree;

        // Check the root node
        if (!isset($tree['root'])) {
            return ['response' => "لا توجد عقدة جذرية مهيأة للروبوت المختار. الرجاء مراجعة إعدادات الروبوت."];
        }

        $rootNode = $tree['root'];
        $response = "تم اختيار الروبوت: {$selectedBot->name}.\n";

        // Handle the root node based on its type
        if ($rootNode['type'] === 'buttons') {
            $response .= "اختر أحد الخيارات التالية:\n";
            foreach ($rootNode['buttons'] as $index => $button) {
                $response .= ($index + 1) . ". " . $button['name'] . "\n";
            }
        } elseif ($rootNode['type'] === 'list') {
            foreach ($rootNode['sections'] as $section) {
                $response .= $section['name'] . ":\n";
                foreach ($section['options'] as $index => $option) {
                    $response .= ($index + 1) . ". " . $option['name'] . "\n";
                }
            }
        } else {
            $response .= "نوع العقدة غير معروف أو غير مدعوم.";
        }

        $response .= "\n0. العودة للخلف\n00. إنهاء الجلسة";
        return ['response' => $response];
    }

    // 3. إذا كان المستخدم موجودًا بالفعل
    $bot = SmartBot::find($userState->current_bot);
    
    if (!$bot) {
        return ['error' => 'Bot not found'];
    }

    $tree = $bot->tree;
    $currentNode = $userState->current_node;
// $input = trim($input);
    // التحقق من إدخال المستخدم
    if ($input === "00") {
        // إء الجلسة وحذف الحالة
        $userState->current_node = "stop";
        $userState->update();
        return ['response' => "تم إنهاء الجلسة. شكرًا لتفاعلك معنا!"];
    }

    // if ($input === "0") {
        
    //     // العودة للخلف
    //     if ($userState->previous_node) {
            
    //         // العودة إلى العقدة السابقة
    //         $userState->update(['current_node' => $userState->previous_node]);

    //         // // إرسال رد مع خيارات العقدة السابقة
    //         // $previousNode = $tree[$userState->previous_node];
            
    //         // $response = "تم الرجوع للخلف إلى: " . "\n";
    //         // if (isset($previousNode['buttons'])) {
    //         //     $response .= "اختر أحد الخيارات التالية:\n";
    //         //     foreach ($previousNode['buttons'] as $index => $button) {
    //         //         $response .= ($index + 1) . ". " . $button['name'] . "\n";
    //         //     }
    //         // }
    //         // return ['response' => $response];
    //     // } else {
    //     //     return ['response' => "لا يمكنك الرجوع أكثر. أنت بالفعل في البداية."];
    //     // } }
    //     }
    // }

    // Validate current node
    if (!isset($tree[$currentNode])) {
        return ['error' => 'Invalid current node'];
    }

    $node = $tree[$currentNode];
    $response = '';

    // Handle node type
    switch ($node['type']) {
        case 'buttons':
            $response .= "اختر أحد الخيارات التالية:\n";
            foreach ($node['buttons'] as $index => $button) {
                $response .= ($index + 1) . ". " . $button['name'] . "\n";
            }
            

            // Update state if input matches
            if (isset($node['buttons'][$input - 1])) {
                $nextNode = $node['buttons'][$input - 1]['next'];
                $userState->update([
                    'previous_node' => $currentNode,
                    'current_node' => $nextNode,
                ]);
            } else {
                return ['response' => "الاختيار غير متاح. الرجاء المحاولة مرة أخرى."];
            }
            break;

        case 'list':
            foreach ($node['sections'] as $section) {
                $response .= $section['name'] . ":\n";
                foreach ($section['options'] as $index => $option) {
                    $response .= ($index + 1) . ". " . $option['name'] . "\n";
                }
            }

            // Update state if input matches
            if (isset($node['sections'][0]['options'][$input - 1])) {
                $nextNode = $node['sections'][0]['options'][$input - 1]['next'];
                $userState->update([
                    'previous_node' => $currentNode,
                    'current_node' => $nextNode,
                ]);
            } else {
                return ['response' => "الاختيار غير متاح. الرجاء المحاولة مرة أخرى."];
            }
            break;

        case 'result':
            $response .= implode("\n", $node['messages']);
            $userState->update(['current_node' => 'root', 'previous_node' => null]); // Return to root
            break;

        default:
            $response .= "نوع غير معروف.";
    }

    $response .="\n00. إنهاء الجلسة";
    return ['response' => $response];
}



    public function show($id)
    {
        try {
            // Find the message
            $message = Message::with('user', 'employee','conversation')->findOrFail($id);
            return $this->data($message, 'Successfully retrieved message.');
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            // Find the message
            $message = Message::findOrFail($id);

            // Validate input
            $request->validate([
                'conversation_id' => 'sometimes',
                'sender_number' => 'sometimes|string|max:255',
                'receive_number' => 'sometimes|string|max:255',
                'body' => 'sometimes|string',
                'user_id' => 'sometimes',
                'employee_id' => 'sometimes|nullable',
                'receiver_name' => 'sometimes|string|max:255',
            ]);

            // Update only the fields that are present in the request
            $message->update($request->only(['conversation_id', 'sender_number', 'receive_number', 'body', 'user_id', 'employee_id', 'receiver_name']));

            return $this->data($message, 'Successfully updated message.');
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            // Find the message
            $message = Message::findOrFail($id);

            // Delete the message
            $message->delete();

            return $this->data(200, 'Successfully deleted message.');
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }



        // إرجاع جميع الرسائل لحملة معينة
        public function indexMessageCampaign($campaignId)
        {
            $messages = MessageCampaign::where('campaign_id', $campaignId)->get();
            return response()->json($messages);
        }

        // إنشاء رسالة جديدة لحملة
        public function storeMessageCampaign(Request $request, $campaignId)
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
                        // return response()->json($contact);

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

            return response()->json('messages sent');

            // try {
            //     // Validate input
            //     $request->validate([
            //         'receive_number' => 'required|string|max:255',
            //         'body' => 'required|string',
            //         'receive_name' => 'required|string',

            //     ]);

            //     $user = auth()->user();
            //     $planId = $user->plan_id;

            //     // تحقق من عدد الرسائل المتاحة في خطة المستخدم
            //     $plan = Plan::where('plan_no', $planId)->first();
            //     $count = Message::countMessagesBetween($user->plan_time_starts, $user->plan_time_ends);

            //     if ($count >= $plan->monthly_message_limit) {
            //         return response()->json(['success' => false, 'error' => 'عدد الرسائل المتاح ليك في الشهر خلص'], 500);
            //     }

            //     // تحميل الحملة
            //     $campaign = Campaign::findOrFail($campaignId);


            //     $contacts = Contact::where('list_name', $campaign->contact_list)->get();

                // // التحقق من سرعة الإرسال
                // $minDelay = $campaign->min_delay; // الفاصل الأدنى بين الرسائل بالثواني
                // $maxDelay = $campaign->max_delay; // الفاصل الأقصى بين الرسائل بالثواني
                // $delay = rand($minDelay, $maxDelay); // تحديد التأخير العشوائي بين الرسائل
                // dd($contacts);

                // إرسال الرسالة باستخدام API
                // $response = Http::post('http://localhost:3000/send-message', [
                //     'number' => $request->input('receive_number'),
                //     'message' => $request->input('body'),
                // ]);

                // // تحقق من استجابة الـ API
                // if ($response->failed()) {
                //     return response()->json(['success' => false, 'error' => 'Failed to send message via API.'], 500);
                // }

                // تأخير إرسال الرسالة بناءً على سرعة الإرسال
                    // dd($contact->phone_number);
                    // $response = Http::post('http://localhost:3000/send-message', [
                    //     'number' => $contact->phone_number,
                    //     'message' => $request->input('body'),
                    // ]);

                    // // تحقق من استجابة الـ API
                    // if ($response->failed()) {
                    //     return response()->json(['success' => false, 'error' => 'Failed to send message via API.'], 500);
                    // }

                    // تسجيل الرسالة في قاعدة البيانات
            //         $message = MessageCampaign::create([
            //             'campaign_id' => $campaignId,
            //             'user_id' => $user->id,
            //             'receive_name' => $request->receive_name,
            //             'receive_number' => $request->receive_number,
            //             'sender_number' => $campaign->whatsapp_account,
            //             'body' => $request->input('body'),
            //         ]);

            //     // return response()->json($contacts);






            //     return response()->json(['success' => true, 'message' => $message], 201);
            // } catch (\Exception $e) {
            //     return response()->json(['error' => $e->getMessage()], 500);
            // }
        }

        // إرجاع رسالة معينة لحملة
        public function showMessageCampaign($campaignId, $messageId)
        {
            $message = MessageCampaign::where('campaign_id', $campaignId)->findOrFail($messageId);
            return response()->json($message);
        }

        // حذف رسالة من الحملة
        public function destroyMessageCampaign($campaignId, $messageId)
        {
            $message = MessageCampaign::where('campaign_id', $campaignId)->findOrFail($messageId);
            $message->delete();

            return response()->json(['success' => true, 'message' => 'Message deleted successfully']);
        }

}

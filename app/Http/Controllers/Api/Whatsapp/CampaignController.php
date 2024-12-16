<?php

namespace App\Http\Controllers\Api\Whatsapp;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Contact;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
     // إرجاع جميع الحملات للمستخدم الحالي
     public function index()
     {
         try {
             $user = auth()->user();
             $campaigns = Campaign::where('user_id', $user->id)->get();
             return response()->json($campaigns);
         } catch (\Exception $e) {
             return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
         }
     }

     // إنشاء حملة جديدة
    public function store(Request $request)
    {
        try {
            // التحقق من صحة البيانات المدخلة
            $request->validate([
                'name' => 'required|string|max:255',
                'whatsapp_account' => 'required|integer',
                'contact_list' => 'required|string|max:255',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date',
                'start_time' => 'required',
                'end_time' => 'required',
                // 'body' => 'required',
                'min_delay' => 'required|integer|between:10,100', // بالثواني بين 10 و 100
                'max_delay' => 'required|integer|between:15,200', // بالثواني بين 15 و 200

                'messages' => 'required|array', // إضافة تحقق للرسائل
                'messages.*.type' => 'nullable|string',
                'messages.*.content' => 'nullable|string',
                'messages.*.url' => 'nullable|string',
                'messages.*.filePath' => 'nullable|string',
                'messages.*.fileType' => 'nullable|string',
            ]);

            $userId = auth()->user()->id;

            // return response()->json(['success' => true, 'campaign' => $request->messages], 201);

            // تحديد الفاصل الزمني العشوائي بين الرسائل
            $minDelay = $request->min_delay;
            $maxDelay = $request->max_delay;
            $delay = rand($minDelay, $maxDelay);

            // جلب الأرقام من قائمة الأرقام المحددة
            $contacts = Contact::where('list_name', $request->contact_list)->get();

            // إنشاء الحملة وربطها بالمستخدم
            $campaign = Campaign::create(array_merge($request->all(), [
                'user_id' => $userId,
                'delay' => $delay,
                // 'body' => $request->body,
            'messages' => json_encode($request->messages) // تحويل الرسائل إلى JSON قبل التخزين
            ]));

            // ربط الحملة بقائمة الأرقام
            $contactIds = $contacts->pluck('id');
            $campaign->contacts()->attach($contactIds);

            // الاستجابة في حال نجاح العملية
            return response()->json(['success' => true, 'campaign' => $campaign, 'contacts' => $contacts], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['success' => false, 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
     // إرجاع حملة واحدة
     public function show($id)
     {
         try {
             $campaign = Campaign::with('contacts')->findOrFail($id);
             $campaign->messages = json_decode($campaign->messages);
             return response()->json($campaign);
         } catch (\Exception $e) {
             return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
         }
     }

     // تحديث حملة
     public function update(Request $request, $id)
     {
         try {
             $campaign = Campaign::findOrFail($id);

             $request->validate([
                 'name' => 'required|string|max:255',
                 'whatsapp_account_id' => 'required|integer',
                 'contact_list_id' => 'required|integer',
                 'start_date' => 'required|date',
                 'end_date' => 'nullable|date',
                 'start_time' => 'required',
                 'end_time' => 'required',
                 'min_delay' => 'required|integer|between:10,100', // بالثواني بين 10 و 100
                 'max_delay' => 'required|integer|between:15,200', // بالثواني بين 15 و 200
             ]);

             $campaign->update($request->all());

             return response()->json(['success' => true, 'campaign' => $campaign]);
         } catch (\Illuminate\Validation\ValidationException $e) {
             return response()->json(['success' => false, 'errors' => $e->errors()], 422);
         } catch (\Exception $e) {
             return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
         }
     }

     // حذف حملة
          public function destroy($id)
     {
         try {
            $contacts = CampaignContact::where('campaign_id', $id)->get();
            if($contacts->isEmpty()){
                $campaign = Campaign::findOrFail($id);
                $campaign->delete();

                return response()->json(['success' => true, 'message' => 'Campaign deleted successfully']);
            }
            foreach($contacts as $contact){
                $contact->delete();
            }
             $campaign = Campaign::findOrFail($id);
             $campaign->delete();

             return response()->json(['success' => true, 'message' => 'Campaign deleted successfully']);
         } catch (\Exception $e) {
             return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
         }
     }
}

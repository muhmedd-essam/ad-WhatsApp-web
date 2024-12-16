<?php

namespace App\Http\Controllers\Api\Whatsapp;

use App\Http\Controllers\Controller;
use App\Models\AutoReply;
use App\Models\SmartBot;
use Illuminate\Http\Request;
use App\Traits\WebTrait;

class AutoReplyController extends Controller
{
    use WebTrait;
    // تخزين رد آلي جديد لروبوت معين
    public function store(Request $request)
    {
        // $smartBot = SmartBot::findOrFail($smartBotId);

        $validatedData = $request->validate([
            'include_ai_map' => 'required|boolean',
            'custom_message' => 'nullable|string',
            'messages' => 'required',
            'number'=> 'required',
            'status' => 'nullable'
        ]);
        $id = auth()->user()->id;
        // dd($id);
// dd($request->number);
        // إنشاء رد آلي جديد
        $autoReply = new AutoReply([
            'include_ai_map' => $validatedData['include_ai_map'],
            'custom_message' => $validatedData['custom_message'] ?? null,
            'messages' => $validatedData['messages'],
            'number' => $validatedData['number'],
             'status' =>$validatedData['status'],
             'user_id' => $id,
        ]);

        // إذا كانت include_ai_map = true نضيف smart_bot_id
        // if ($validatedData['include_ai_map']) {
        //     $autoReply->smart_bot_id = $smartBot->id;
        // }

        $autoReply->save();

        return response()->json(['message' => 'Auto reply created successfully', 'auto_reply' => $autoReply]);
    }

    // تحديث الرد الآلي لروبوت معين
    public function update(Request $request,$smartBotId)
    {
        $smartBot = $autoReply::findOrFail($smartBotId);

        $validatedData = $request->validate([
            'include_ai_map' => 'required|boolean',
            'messages' => 'required',
            'number'=> 'required',
            'custom_message' => 'nullable|string', // إضافة التحقق للرسالة المخصصة
            
        ]);

        // جلب الرد الآلي المرتبط بالروبوت
        // $autoReply = $smartBot->autoReply;

        // if (!$autoReply) {
        //     return response()->json(['message' => 'No auto reply found for this smart bot'], 404);
        // }

        // تحديث البيانات
        $id = auth()->user()->id;
        $autoReply->update([
            'include_ai_map' => $validatedData['include_ai_map'],
            'custom_message' => $validatedData['custom_message'] ?? null,
            'messages' => $validatedData['messages'],
            'number' => $validatedData['number'],
            'status' =>$validatedData['status'],
           'user_id' => $id, 
        ]);

        // إذا كانت include_ai_map = true نضيف smart_bot_id
        // if ($validatedData['include_ai_map']) {
        //     $autoReply->smart_bot_id = $smartBot->id;
        // }

        $autoReply->save();

        return response()->json(['message' => 'Auto reply updated successfully', 'auto_reply' => $autoReply]);
    }

    // جلب بيانات الرد الآلي لروبوت معين
    public function show($smartBotId)
    {
        $autoReply = AutoReply::findOrFail($smartBotId);
        // $autoReply = $smartBot->autoReply;

        if (!$autoReply) {
            return response()->json(['message' => 'No auto reply found for this smart bot'], 404);
        }

        return response()->json($autoReply);
    }
    
        // جلب بيانات الرد الآلي لروبوت معين
    public function index()
    {
        $id = auth()->user()->id;
        // dd('ss');
        $autoReply = AutoReply::where('user_id', $id)->get();
        // $autoReply = $smartBot->autoReply;

        if (!$autoReply) {
            return response()->json(['message' => 'No auto reply found for this smart bot'], 404);
        }

        return response()->json($autoReply);
    }
    
    public function changeStatus($autoReplyId){
        
        $autoReply = AutoReply::findOrFail($autoReplyId);
        
        if($autoReply->status == "off"){
            $autoReply->status = 'on';
            $autoReply->save();
        return $this->success('تم التفعيل');
        }else{
            
            $autoReply->status = 'off';
            $autoReply->save();
        return $this->success("تم التعطيل");
        }
        
        
    }
    
    public function destroy($autoReplyId){
        try{
            $autoReply = AutoReply::findOrFail($autoReplyId);
        
        $autoReply->delete();
        return $this->success("تم الحذف");
        }catch (\Exception $e) {
            return $this->error("هناك خطأ",$e->getMessage());
        }
        
        
        
    }
    
    
}

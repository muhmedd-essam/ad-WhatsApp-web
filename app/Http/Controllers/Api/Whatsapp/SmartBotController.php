<?php

namespace App\Http\Controllers\Api\Whatsapp;

use App\Http\Controllers\Controller;
use App\Models\SmartBot;
use Illuminate\Http\Request;
use App\Traits\WebTrait;


class SmartBotController extends Controller
{
    
    use WebTrait;
   public function store(Request $request)
{
    try {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'whatsapp_number' => 'required|string|max:20',
            'keyword' => 'required|string|max:255',
            'custom_navigation_message' => 'nullable|string|max:255',
            'tree' => 'required|array',
            'status' => 'nullable'
        ]);

        // إنشاء روبوت جديد
        $smartBot = SmartBot::create([
            'user_id' => auth()->user()->id,
            'name' => $validatedData['name'],
            'whatsapp_number' => $validatedData['whatsapp_number'],
            'keyword' => $validatedData['keyword'],
            'custom_navigation_message' => $validatedData['custom_navigation_message'],
            'tree' => $validatedData['tree'],
            'status' =>$validatedData['status'],
        ]);

        return response()->json(['message' => 'Smart Bot created successfully', 'smart_bot' => $smartBot], 201);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'message' => 'Validation error',
            'errors' => $e->errors(),
            'required_fields' => [
                'user_id' => 'User ID (required, must exist in users table)',
                'name' => 'Bot Name (required, string, max: 255)',
                'whatsapp_number' => 'WhatsApp Number (required, string, max: 20)',
                'keyword' => 'Keyword (required, string, max: 255)',
                'custom_navigation_message' => 'Custom Navigation Message (optional, string, max: 255)',
                'tree' => 'Tree Structure (required, array)',
            ],
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'An error occurred while creating the Smart Bot',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    public function index()
    {
        
        $user = auth()->user();
// dd($user->id);
        $smartBot = SmartBot::where('user_id',$user->id)->get();
        
        return response()->json($smartBot);
    }

    // عرض روبوت معين
    public function show($id)
    {
        $smartBot = SmartBot::findOrFail($id);
        return response()->json($smartBot);
    }

    // تحديث روبوت معين
   public function update(Request $request, $id)
{
    try {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'whatsapp_number' => 'required|string|max:20',
            'keyword' => 'required|string|max:255',
            'custom_navigation_message' => 'nullable|string|max:255',
            'tree' => 'required|array',
        ]);

        // العثور على الروبوت
        $smartBot = SmartBot::findOrFail($id);

        // تحديث البيانات
        $smartBot->update([
            'name' => $validatedData['name'],
            'whatsapp_number' => $validatedData['whatsapp_number'],
            'keyword' => $validatedData['keyword'],
            'custom_navigation_message' => $validatedData['custom_navigation_message'],
            'tree' => $validatedData['tree'],
        ]);

        return response()->json(['message' => 'Smart Bot updated successfully', 'smart_bot' => $smartBot], 200);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'message' => 'Validation error',
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'An error occurred while updating the Smart Bot',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    // حذف روبوت معين
    public function destroy($id)
    {
        

        
        try{
          $smartBot = SmartBot::findOrFail($id);
        $smartBot->delete();
        return $this->success("تم الحذف");
        }catch (\Exception $e) {
            return $this->error("هناك خطأ",$e->getMessage());
            
        }
    }
    
    
    public function changeStatus($smartBotId){
    
        $smartBotId = SmartBot::findOrFail($smartBotId);
        
        
        if($smartBotId->status == "on"){
            

        $smartBotId->update([
            'status' => 'off',
        ]);
        return $this->success("تم التعطيل");
         
        }else{
                        $smartBotId->update([
            'status' => 'on',
        ]);
            
         return $this->success('تم التفعيل');
        }
        
        
    }

}

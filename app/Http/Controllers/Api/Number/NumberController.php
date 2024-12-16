<?php

namespace App\Http\Controllers\Api\Number;

use App\Http\Controllers\Controller;
use App\Models\Number;
use App\Models\User;
use App\Traits\WebTrait;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
class NumberController extends Controller
{
    use WebTrait;

    public function show($id){
        $planOfNumber = Number::with('user')->find($id);
        
        if(is_null($planOfNumber)){
            return $this->error('الرقم مش موجود', 404);
        }

        return $this->data($planOfNumber);

    }

    public function store(request $request){
        $rules = [
            "name" => ['nullable','min:3','max:20'],
            "user_id" => ['required'],
            "phone_number" => ['required', 'unique:numbers,phone_number'],
        ];
        
            // رسائل مخصصة للتحقق
        $messages = [
            // رسائل مخصصة لحقل name
            'name.min' => 'يجب أن يحتوي الاسم على 3 أحرف على الأقل.',
            'name.max' => 'لا يمكن أن يتجاوز الاسم 20 حرفًا.',
    
            // رسائل مخصصة لحقل user_id
            'user_id.required' => 'معرف المستخدم مطلوب.',
    
            // رسائل مخصصة لحقل phone_number
            'phone_number.required' => 'رقم الهاتف مطلوب.',
            'phone_number.unique' => 'رقم الهاتف موجود بالفعل.',
            
        ];
    
        // إنشاء Validator مع الرسائل المخصصة       
        $validator = Validator::make($request->all(), $rules, $messages);

        $validator = Validator::make($request->all(), $rules);
        
        if($validator->fails()) {
            return $this->validationError(422, $validator->errors()->first());
        }
        
        $allNumbers = Number::pluck('phone_number')->toArray();

        // التحقق إذا كان الرقم موجودًا
        
        if (in_array($request->phone_number, $allNumbers)) {
            
            return $this->error(422, 'رقم الهاتف مستخدم بالفعل.');
            
        }
        
        
           $user = User::where('id',$request->user_id)->first();
           
           if(is_null($user)){
               
               return $this->error( 404 ,'المستخدم غير موجود او خطأ في ال id');
               
           }
           

        try{
            $number = Number::firstOrCreate(
            [
                'name' => $request->name,
                'user_id' => $request->user_id,
                'phone_number' => $request->phone_number,
                
            ], );
            
        }catch(QueryException $e){
            // return $e;
            return $this->error($e, 'هناك خطأ');
        }
        return $this->success();
    }

    public function update(Request $request, $id)
    {

        $rules = [
            "name" => ['nullable', 'min:3', 'max:20'],
            "user_id" => ['required'],
"phone_number" => ['required', 'unique:numbers,phone_number,'],        ];


        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->validationError(422, 'The given data was invalid.', $validator);
        }
        
         $allNumbers = Number::pluck('phone_number')->toArray();

        // التحقق إذا كان الرقم موجودًا
        
        if (in_array($request->phone_number, $allNumbers)) {
            
            return $this->error(422, 'رقم الهاتف مستخدم بالفعل.');
            
        }
        
        
           $user = User::where('id',$request->user_id)->first();
           
           if(is_null($user)){
               
               return $this->error( 404 ,'المستخدم غير موجود او خطأ في ال id');
               
           }

        try {

            $number = Number::findOrFail($id);


            $number->update([
                'name' => $request->name,
                'user_id' => $request->user_id,
                'phone_number' => $request->phone_number,
            ]);

        } catch (QueryException $e) {
            return $this->error($e, 'هناك خطأ');
        } catch (ModelNotFoundException $e) {
            return $this->error(404, 'Record not found');
        }

    return $this->success();
}

}

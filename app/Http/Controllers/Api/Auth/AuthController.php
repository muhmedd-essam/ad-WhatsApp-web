<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use App\Traits\WebTrait;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator as ValidationValidator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Password;
use Tymon\JWTAuth\Providers\Auth\Illuminate;

class AuthController extends Controller
{
    use WebTrait;

    public function login(Request $request)
    {
        $rules = [
            "email" => ['required'],
            "password" => ['required'],
        ];

        $credentials = request(['email', 'password']);

        $validator = Validator::make($request->all(), $rules);

        if($validator->fails()) {
            return $this->validationError(422, 'The given data was invalid.', $validator);
        }
        $token = JWTAuth::attempt([
            "email" => $request->email,
            "password" => $request->password
        ]);

        if (!$token = auth()->attempt($credentials)) {
            return $this->error('Invalid Phone or Password', 422);
        }

        if(!empty($token)){
            $user = User::where('email', $credentials['email'])->first();
        return $this->data($token);
        }

        $today = Carbon::today();


        // $user = auth()->user();
        // if (is_null($user->deactivated_until)) {
        //     dd('xx');
        //     $today = Carbon::today();

        //     if ($user->deactivated_until >= $today) {
        //         if ($user->deactivated_until === '1-1-3099') {
        //             return $this->error('عفوا، هذا الحساب محظور بشكل دائم.', 401);
        //         }
        //         return $this->error('عفوا، هذا الحساب محظور حتى تاريخ: ' . $user->deactivated_until, 401);
        //     }
        // }

        return $this->data($token);
    }

    public function loginEmployee(Request $request)
    {
        $rules = [
            "email" => ['required'],
            "password" => ['required'],
        ];

        $credentials = request(['email', 'password']);



        $validator = Validator::make($request->all(), $rules);

        if($validator->fails()) {
            return $this->validationError(422, 'The given data was invalid.', $validator);
        }

        $employee = Employee::with( 'user')->where('email', $request->email)->first();
        $user = $employee->user;
        // return $this->data($user);
        // dd($user->password);
        $token = JWTAuth::fromUser($user);

        if($employee){
            // جميع الصلاحيات المتاحة
            $permissionsList = [
                'individual_messaging',
                'group_messaging',
                'auto_reply_and_smart_bot',
                'contact_phrases',
                'file_management',
                'linked_platforms',
                'developers'
            ];

            // صلاحية الموظف الحالية (فك تشفير JSON)
            $employeePermission = json_decode($employee->permissions, true); // true للحصول على مصفوفة

            // قائمة النتائج مع true أو false
            $permissionsStatus = [];
            foreach ($permissionsList as $permission) {
                // التحقق إذا كانت الصلاحية موجودة في صلاحيات الموظف
                $permissionsStatus[$permission] = in_array($permission, $employeePermission);
            }
        }



        if (!$token) {
            return $this->error('Invalid Phone or Password', 422);
        }

        // if(!empty($token)){
        //     $user = User::where('email', $credentials['email'])->first();
        // return $this->data($token);
        // }

        $today = Carbon::today();


        // $user = auth()->user();
        // if (is_null($user->deactivated_until)) {
        //     dd('xx');
        //     $today = Carbon::today();

        //     if ($user->deactivated_until >= $today) {
        //         if ($user->deactivated_until === '1-1-3099') {
        //             return $this->error('عفوا، هذا الحساب محظور بشكل دائم.', 401);
        //         }
        //         return $this->error('عفوا، هذا الحساب محظور حتى تاريخ: ' . $user->deactivated_until, 401);
        //     }
        // }

        return response()->json([
            'token' => $token,
            'employee' => $employee,
            'permissions' => $permissionsStatus
        ], 200);
    }


    public function store(Request $request)
    {

        $rules = [
            "name" => ['min:3','max:20'],
            "company" => ['nullable'],
            "email" => ['required', 'email', 'unique:users,email'],
            "password" => ['required','min:8'],
            "phone" => ['nullable','min:9'],
        ];


        $validator = Validator::make($request->all(), $rules, $this->messagesError());

        if ($validator->fails()) {
            $errors = $validator->errors();

            return response()->json([
                'message' => 'البيانات المدخلة غير صحيحة. | The given data was invalid.',
                'errors' =>  $this->conditionError($errors)
            ], 422);
        }


        try{

            $user = User::firstOrCreate(

            [
                'name' => $request->name,
                'email' => $request->email,
                'company' => $request->company,
                'phone' => $request->phone,
                'password'=>Hash::make($request->password),
                'plan_id'=> 1,
                'plan_time_starts'=> now(),
                'plan_time_ends'=> now()->addDays(30),

            ],);
        }catch(QueryException $e){
            // return $e;
            return $this->error($e, 'هناك خطأ');
        }



        /* Check if user is blocked */
        $today = Carbon::today();
        if($user->deactivated_until >= $today){
            if($user->deactivated_until === '1-1-3099'){
                return $this->error('عفوا، هذا الحساب محظور بشكل دائم.', 401);
            }
            return $this->error('عفوا، هذا الحساب محظور حتى تاريخ: '.$user->deactivated_until, 401);
        }

        $token = JWTAuth::attempt([
            "email" => $request->email,
            "password" => $request->password
        ]);

        $data = ['token' => $token];
        return $this->success();
    }

    public function changePassword(Request $request)
    {
        $rules = [
            'current_password' => ['required'],
            'new_password' => ['required', 'min:8'],
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'The given data was invalid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'كلمة المرور الحالية غير صحيحة.',
            ], 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'تم تغيير كلمة المرور بنجاح.',
        ]);
    }






}

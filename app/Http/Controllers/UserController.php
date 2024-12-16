<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Traits\WebTrait;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;


class UserController extends Controller
{
    use WebTrait;

    public function index(){
        $user = User::with('plan', 'numbers')->find(auth()->user()->id);
        $count = Message::countMessagesBetween($user->plan_time_starts, $user->plan_time_ends);

            $startOfDay = Carbon::now()->startOfDay();
            $endOfDay = Carbon::now()->endOfDay();

            // حساب عدد الرسائل التي أرسلها المستخدم خلال اليوم
            $countInDay = Message::countMessagesBetween($startOfDay, $endOfDay);

            $user->plan->yourMessagesCountInMonth = $count ;
            $user->plan->yourFreeMessagesCountInMonth = $user->plan->monthly_message_limit - $count ;

            $user->plan->yourMessagesCountInDay = $countInDay;

            $user->plan->yourFreeMessagesCountInDay = $user->plan->daily_message_limit - $countInDay ;
        return $this->data($user);
    }

    public function show()
    {
        try {
            $currentUser = auth()->user();

            $user = User::with('plan', 'numbers')->findOrFail($currentUser->id);
            if($currentUser->id != $user->id){
                return $this->error(404, 'User is not for you');
            }
            
            $count = Message::countMessagesBetween($user->plan_time_starts, $user->plan_time_ends);

            $startOfDay = Carbon::now()->startOfDay();
            $endOfDay = Carbon::now()->endOfDay();

            // حساب عدد الرسائل التي أرسلها المستخدم خلال اليوم
            $countInDay = Message::countMessagesBetween($startOfDay, $endOfDay);

            $user->plan->yourMessagesCountInMonth = $count ;
            $user->plan->yourFreeMessagesCountInMonth = $user->plan->monthly_message_limit - $count ;

            $user->plan->yourMessagesCountInDay = $countInDay;

            $user->plan->yourFreeMessagesCountInDay = $user->plan->daily_message_limit - $countInDay ;

        } catch (ModelNotFoundException $e) {
            return $this->error(404, 'User not found');
        }


        return $this->data($user, 'User retrieved successfully!');
    }


    public function update(Request $request)
    {
        try {
            // Find the user by ID
            $user = auth()->user();

            // Validation rules
            $rules = [
                "name" => ['min:3', 'max:20'],
            ];

            // Validate input
            $validator = Validator::make($request->all(), $rules, $this->messagesError());

            if ($validator->fails()) {
                $errors = $validator->errors();
                return response()->json([
                    'message' => 'البيانات المدخلة غير صحيحة. | The given data was invalid.',
                    'errors' => $this->conditionError($errors)
                ], 422);
            }

            // Update only the fields that are present in the request
            $user->update($request->only(['name', 'company', 'plan_no', 'tax_number']));

            $today = Carbon::today();
            if ($user->deactivated_until >= $today) {
                if ($user->deactivated_until === '1-1-3099') {
                    return $this->error('عفوا، هذا الحساب محظور بشكل دائم.', 401);
                }
                return $this->error('عفوا، هذا الحساب محظور حتى تاريخ: ' . $user->deactivated_until, 401);
            }

            return $this->data($user, 'User updated successfully!');

        } catch (QueryException $e) {
            return $this->error($e, 'هناك خطأ');
        } catch (ModelNotFoundException $e) {
            return $this->error(404, 'Record not found');
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}

<?php

namespace App\Traits;

trait WebTrait
{

    public function messagesError(){

        $messages = [
        'name.min' => 'يجب أن يكون الاسم 3 أحرف على الأقل. | The name must be at least 3 characters.',
        'name.max' => 'يجب ألا يزيد الاسم عن 20 حرفًا. | The name must not exceed 20 characters.',
        'company.required' => 'الشركة مطلوبة. | Company is required.',
        'email.required' => 'البريد الإلكتروني مطلوب. | Email is required.',
        'email.email' => 'الرجاء إدخال بريد إلكتروني صالح. | Please enter a valid email address.',
        'email.unique' => 'هذا البريد الإلكتروني مستخدم بالفعل. | This email is already in use.',
        'password.required' => 'كلمة المرور مطلوبة. | Password is required.',
        'password.min' => 'يجب أن تكون كلمة المرور 8 أحرف على الأقل. | The password must be at least 8 characters.',
        'password.max' => 'يجب ألا تزيد كلمة المرور عن 20 حرفًا. | The password must not exceed 20 characters.',
        'phone.required' => 'رقم الهاتف مطلوب. | Phone number is required.',
        'phone.min' => 'يجب أن يكون رقم الهاتف 11 رقماً على الأقل. | The phone number must be at least 11 digits.',
        'country_code.required' => 'رمز الدولة مطلوب. | Country code is required.',
        'country_code.min' => 'يجب أن يكون رمز الدولة مكونًا من حرفين. | The country code must be 2 characters.',
        'country_code.max' => 'يجب أن يكون رمز الدولة مكونًا من حرفين فقط. | The country code must be 2 characters.',
    ];
        return  $messages;

    }

    public function conditionError($errors){

        $errorMessages = [];

        if ($errors->has('name')) {
            $errorMessages['name'] = $errors->get('name');
        }
        if ($errors->has('company')) {
            $errorMessages['company'] = $errors->get('company');
        }
        if ($errors->has('email')) {
            $errorMessages['email'] = $errors->get('email');
        }
        if ($errors->has('password')) {
            $errorMessages['password'] = $errors->get('password');
        }
        if ($errors->has('phone')) {
            $errorMessages['phone'] = $errors->get('phone');
        }
        if ($errors->has('country_code')) {
            $errorMessages['country_code'] = $errors->get('country_code');
        }
        return $errorMessages;
    }

    public function error($errorNum, $msg, $code = 500){

        return response()->json([
          'status' => false,
          'errNum' => $errorNum,
          'msg' => $msg,
        ], $code);

      }

      public function success($errorNum = "S000", $msg = "success"){

        return response()->json([
          'status' => true,
          'errNum' => $errorNum,
          'msg' => $msg,
        ]);

      }

      public function data($data, $msg = ""){

        return response()->json([
          'status' => true,
          'errNum' => 'S000',
          'msg' => $msg,
          'data' => $data,
        ]);

      }

      public function validationError($code, $validator){

        return $this->error($code, $validator, 422);

      }

      public function returnCodeAccordingToInput($validator)
        {
            $inputs = array_keys($validator->errors()->toArray());
            $errCodes = $this->getErrorCode($inputs);
            return $errCodes;
        }

        public function getErrorCode($inputs)
        {
          $errors = array();
          foreach ($inputs as $input){

            if ($input == "name")
                $errors[] = 'E004';

            else if ($input == "password")
                $errors[] = 'E002';

            else if ($input == "phone")
                $errors[] = 'E003';

            else if ($input == "id_number")
                $errors[] = 'E0011';

            else if ($input == "birth_date")
                $errors[] = 'E005';

            else if ($input == "agreement")
                $errors[] = 'E006';

            else if ($input == "email")
                $errors[] = 'E007';

            else if ($input == "country")
                $errors[] = 'E008';

            else if ($input == "company")
               $errors[] = 'E009';

            else if ($input == "activation_code")
               $errors[] = 'E010';

            else if ($input == "longitude")
                $errors[] = 'E011';

            else if ($input == "latitude")
               $errors[] = 'E012';

            else if ($input == "id")
               $errors[] = 'E013';

            else if ($input == "promocode")
               $errors[] = 'E014';

            else if ($input == "doctor_id")
               $errors[] = 'E015';

            else if ($input == "payment_method" || $input == "payment_method_id")
               $errors[] =  'E016';

            else if ($input == "day_date")
               $errors[] = 'E017';

            else if ($input == "specification_id")
               $errors[] = 'E018';

            else if ($input == "importance")
               $errors[] = 'E019';

            else if ($input == "type")
               $errors[] = 'E020';

            else if ($input == "message")
                $errors[] = 'E021';

            else if ($input == "reservation_no")
                $errors[] = 'E022';

            else if ($input == "reason")
                $errors[] = 'E023';

            else if ($input == "branch_no")
               $errors[] =  'E024';

            else if ($input == "name_en")
               $errors[] =  'E025';

            else if ($input == "name_ar")
               $errors[] = 'E026';

            else if ($input == "gender")
                $errors[] = 'E027';

            else if ($input == "nickname_en")
                $errors[] =  'E028';

            else if ($input == "nickname_ar")
                $errors[] = 'E029';

            else if ($input == "rate")
                $errors[] = 'E030';

            else if ($input == "price")
                $errors[] = 'E031';

            else if ($input == "information_en")
                $errors[] = 'E032';

            else if ($input == "information_ar")
                $errors[] = 'E033';

            else if ($input == "street")
                $errors[] = 'E034';

            else if ($input == "branch_id")
                $errors[] = 'E035';

            else if ($input == "insurance_companies")
                $errors[] = 'E036';

            else if ($input == "photo")
                $errors[] = 'E037';

            else if ($input == "logo")
                $errors[] = 'E038';

            else if ($input == "working_days")
                $errors[] = 'E039';

            else if ($input == "insurance_companies")
                $errors[] = 'E040';

            else if ($input == "reservation_period")
                $errors[] = 'E041';

            else if ($input == "nationality_id")
                $errors[] = 'E042';

            else if ($input == "commercial_no")
                $errors[] = 'E043';

            else if ($input == "nickname_id")
                $errors[] = 'E044';

            else if ($input == "reservation_id")
                $errors[] = 'E045';

            else if ($input == "attachments")
                $errors[] = 'E046';

            else if ($input == "summary")
                $errors[] = 'E047';

            else if ($input == "user_id")
                $errors[] = 'E048';

            else if ($input == "mobile_id")
                $errors[] = 'E049';

            else if ($input == "paid")
                $errors[] = 'E050';

            else if ($input == "use_insurance")
                $errors[] = 'E051';

            else if ($input == "doctor_rate")
                $errors[] = 'E052';

            else if ($input == "provider_rate")
                $errors[] = 'E053';

            else if ($input == "message_id")
                $errors[] = 'E054';

            else if ($input == "hide")
                $errors[] = 'E055';

            else if ($input == "checkoutId")
                $errors[] = 'E056';

            else
                $errors[] = 'Err Code not defined';
            }
            return $errors;
        }
}

<?php

namespace App\Http\Controllers\Api\Number;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class WhatsAppController extends Controller
{
    public function handleIncomingMessage(Request $request)
    {
        // Your Twilio credentials from .env file
        $sid = env('TWILIO_SID');
        $token = env('TWILIO_TOKEN');
        $twilioFrom = env('TWILIO_FROM');

        // Initialize Twilio client
        $client = new Client($sid, $token);

        // Incoming message details from request
        $from = $request->input('From'); // The sender's WhatsApp number
        $body = $request->input('Body'); // The message body

        // Log the incoming message (for debugging)
        log::info("Message received from $from: $body");

        // Respond with "روح نام" automatically
        $message = "روح نام";

        // Send the message back to the sender
        $client->messages->create(
            $from, // Send to the same number that sent the message
            [
                'from' => $twilioFrom, // Your Twilio WhatsApp number
                'body' => $message
            ]
        );

        return response()->json(['status' => 'Message sent']);
    }

    public function sendMessage(Request $request)
    {
        // التحقق من صحة البيانات المستلمة
        $validated = $request->validate([
            'message' => 'required|string',
            'number' => 'required|string',
        ]);

        // الحصول على بيانات الاعتماد من .env
        $sid = env('TWILIO_SID');
        $token = env('TWILIO_TOKEN');
        $from = env('TWILIO_FROM');
        $twilio = new Client($sid, $token);

        // إرسال الرسالة عبر WhatsApp
        $twilio->messages->create(
            "whatsapp:" . $validated['number'], // رقم المرسل إليه
            [
                'from' => $from,                // رقم واتساب الخاص بك
                'body' => $validated['message'] // نص الرسالة
            ]
        );

        return response()->json(['message' => 'Message sent successfully']);
    }

    public function sendMessageToNumbers(Request $request)
        {
            // التحقق من صحة البيانات المستلمة
            $validated = $request->validate([
                'message' => 'required|string',
                'numbers' => 'required|array', // تغيير الرقم إلى مصفوفة
                'numbers.*' => 'required|string', // كل عنصر في المصفوفة يجب أن يكون سلسلة نصية
            ]);

            // الحصول على بيانات الاعتماد من .env
            $sid = env('TWILIO_SID');
            $token = env('TWILIO_TOKEN');
            $from = env('TWILIO_FROM');
            $twilio = new Client($sid, $token);

            // إرسال الرسالة عبر WhatsApp لكل رقم في المصفوفة
            foreach ($validated['numbers'] as $number) {
                $twilio->messages->create(
                    "whatsapp:" . $number, // رقم المرسل إليه
                    [
                        'from' => $from,                // رقم واتساب الخاص بك
                        'body' => $validated['message'] // نص الرسالة
                    ]
                );
            }

            return response()->json(['message' => 'Messages sent successfully']);
        }


}

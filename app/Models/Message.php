<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = ['conversation_id', 'sender_number', 'receive_number', 'body', 'user_id', 'employee_id', 'receiver_name','type','file_path','type_message','url'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public static function countMessagesBetween($start, $end)
    {
        // عدد الرسائل في المدة المحددة
        $messageCount = self::whereBetween('created_at', [$start, $end])->count();

        // استرجاع الحملات التي تحتوي على رسائل في نفس المدة
        $campaigns = Campaign::whereBetween('created_at', [$start, $end])->with('contacts')->get();

        $totalMessages = $messageCount;

        foreach ($campaigns as $campaign) {
            // عدد الأرقام التي سيتم الإرسال لها (بناءً على قائمة الاتصال في الحملة)
            $decodedMessages = json_decode($campaign->messages, true);
            
            $contactCount = $campaign->contacts()->count();
            
            // عدد الرسائل في الحملة
            $campaignMessageCount =  count($decodedMessages);
 
            // إضافة عدد الرسائل للحملة مضروبة في عدد الأرقام
            $totalMessages += $campaignMessageCount * $contactCount;
        }

        return $totalMessages;
    }


   
}

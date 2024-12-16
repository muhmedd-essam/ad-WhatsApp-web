<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserState extends Model
{
    use HasFactory;
    /**
     * الجدول المرتبط بالنموذج
     */
    protected $table = 'user_states';

    /**
     * الأعمدة التي يمكن تعبئتها
     */
    protected $fillable = [
        'phone_number',
        'current_bot',
        'current_node',
        'previous_node',
        'phone_reciever'
    ];

    /**
     * العلاقات
     */

    // العلاقة مع المستخدم
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // العلاقة مع الروبوت الذكي
    public function smartBot()
    {
        return $this->belongsTo(SmartBot::class);
    }
}

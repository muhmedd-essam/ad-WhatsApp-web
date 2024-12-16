<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AutoReply extends Model
{
    use HasFactory;

    protected $fillable = [
        'smart_bot_id', // علاقة مع الروبوت الذكي
        'include_ai_map',
        'include_group_message_intro',
        'include_buttons',
        'messages',
        'number',
        'status',
        'user_id'
    ];

    // العلاقة مع الروبوت الذكي
    public function smartBot()
    {
        return $this->belongsTo(SmartBot::class);
    }

    // التعامل مع البيانات التي يتم تخزينها في الحقل messages على شكل JSON
    // protected $casts = [
    //     'messages' => 'array',
    // ];
}

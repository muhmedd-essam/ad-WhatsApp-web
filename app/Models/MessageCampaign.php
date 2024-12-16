<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessageCampaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'user_id',
        'receive_number',
        'receive_name',
        'sender_number',
        'body',
        'sent_at',
    ];

    // ربط الرسالة بالحملة
    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    // ربط الرسالة بالمستخدم
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

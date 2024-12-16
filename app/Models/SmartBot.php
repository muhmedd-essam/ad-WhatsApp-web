<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SmartBot extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'whatsapp_number',
        'keyword',
        'custom_navigation_message',
        'tree',
        'status'
    ];

    // نقوم بتحويل الحقول التي تحتوي على JSON تلقائيًا
    protected $casts = [
        'tree' => 'array',
    ];

    // العلاقة مع المستخدم
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

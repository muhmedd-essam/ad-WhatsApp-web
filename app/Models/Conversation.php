<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'employee_id',
        'name',
        'phone',
        'phone_sender'
    ];

    // علاقة مع الـ User (محادثة تتبع مستخدم)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // علاقة مع الـ Employee (محادثة تتبع موظف)
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }


    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}

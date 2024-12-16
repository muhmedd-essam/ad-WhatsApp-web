<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'whatsapp_account',
        'contact_list',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'min_delay',
        'max_delay',
        'user_id',
        'delay',
        'body',
        'messages'
    ];

    // ربط الحملة بالرسائل
    public function messages()
    {
        return $this->hasMany(MessageCampaign::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contacts()
    {
        return $this->belongsToMany(Contact::class, 'campaign_contact')->wherePivot('sent_message', '!=', 1);
    }
}

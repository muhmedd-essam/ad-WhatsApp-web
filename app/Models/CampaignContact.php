<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignContact extends Model
{
    use HasFactory;
    protected $table = 'campaign_contact';


    protected $fillable = [
        'campaign_id',
        'contact_id',
        'sent_message',

        // 'deactivated_until',
    ];
}

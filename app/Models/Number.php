<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Number extends Model
{
    use HasFactory;

    protected $table = 'numbers';


    protected $fillable = [
        'name',
        'user_id',
        'phone_number',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }



}

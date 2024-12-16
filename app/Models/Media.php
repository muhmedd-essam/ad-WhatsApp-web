<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Media extends Model
{
    use HasFactory;

    protected $table = 'media';

    protected $fillable = [
        'user_id',
        'type',
        'path',
        'size'
    ];

    public function getProfilePictureAttribute($value){
        if(Str::contains($value, 'http')){
            return $value;
        }

        if($value == null){
            return null;
        }

        return asset('/storage/' . $value);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public static function countMediasBetween($start, $end)
    {
        $medias =  self::whereBetween('created_at', [$start, $end])->get();
        $size = 0;
        foreach ($medias as $media){
            $size += floatval($media->size);
        }
        return $size;
    }


}

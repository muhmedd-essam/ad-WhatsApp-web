<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;


class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    protected $table = 'users';

    protected $fillable = [
        'name',
        'company',
        'email',
        'password',
        // 'country_code',
        'phone',
        'tax_number',
        'plan_time_starts',
        'plan_time_ends'
        // 'deactivated_until',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }



    public function numbers()
    {
        return $this->hasMany(Number::class);
    }

    public function media()
    {
        return $this->hasMany(Media::class);
    }


    public function plan()
    {
        return $this->belongsTo(Plan::class, 'plan_id', 'plan_no');
    }

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }

    public function conversations()
    {
        return $this->hasMany(Conversation::class);
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function Messages()
    {
        return $this->hasMany(Message::class);
    }

    public function campaign()
    {
        return $this->hasMany(Campaign::class);
    }

    public function SmartBot()
    {
        return $this->hasMany(SmartBot::class);
    }
}

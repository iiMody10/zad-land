<?php

namespace App\Models;

use App\Models\Concerns\HasStringId;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'id',
    'username',
    'password',
    'can_delete_banners',
    'can_delete_categories',
    'can_delete_orders',
    'can_delete_products',
    'can_delete_promo_codes',
    'can_manage_banners',
    'can_manage_categories',
    'can_manage_orders',
    'can_manage_products',
    'can_manage_promo_codes',
    'role',
    'can_delete_brands',
    'can_manage_brands',
    'can_manage_reviews',
])]
#[Hidden(['password'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasStringId, Notifiable;

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'can_delete_banners' => 'boolean',
            'can_delete_categories' => 'boolean',
            'can_delete_orders' => 'boolean',
            'can_delete_products' => 'boolean',
            'can_delete_promo_codes' => 'boolean',
            'can_manage_banners' => 'boolean',
            'can_manage_categories' => 'boolean',
            'can_manage_orders' => 'boolean',
            'can_manage_products' => 'boolean',
            'can_manage_promo_codes' => 'boolean',
            'can_delete_brands' => 'boolean',
            'can_manage_brands' => 'boolean',
            'can_manage_reviews' => 'boolean',
        ];
    }
}

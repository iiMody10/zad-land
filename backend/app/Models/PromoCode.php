<?php

namespace App\Models;

use App\Models\Concerns\HasStringId;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PromoCode extends Model
{
    use HasStringId;

    protected $guarded = [];

    public $incrementing = false;

    protected $keyType = 'string';

    protected function casts(): array
    {
        return ['discount_percentage' => 'integer', 'is_active' => 'boolean', 'usage_count' => 'integer', 'total_sales' => 'decimal:2'];
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}

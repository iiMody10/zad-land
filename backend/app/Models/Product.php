<?php

namespace App\Models;

use App\Models\Concerns\HasStringId;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasStringId;

    protected $guarded = [];

    public $incrementing = false;

    protected $keyType = 'string';

    protected function casts(): array
    {
        return ['price' => 'decimal:2', 'discount_price' => 'decimal:2', 'discount_value' => 'decimal:2', 'stock' => 'integer', 'min_order' => 'integer', 'is_trending' => 'boolean', 'is_active' => 'boolean', 'pricing_needs_review' => 'boolean'];
    }

    public function getImagesAttribute(?string $value): string
    {
        if ($value === null || $value === '') {
            return '';
        }
        $decoded = json_decode($value, true);
        if (is_array($decoded)) {
            return implode(',', array_filter($decoded, fn ($image) => is_string($image) && $image !== ''));
        }

        return $value;
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function mainCategory(): BelongsTo
    {
        return $this->belongsTo(MainCategory::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}

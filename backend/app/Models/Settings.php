<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    protected $table = 'settings';

    protected $guarded = [];

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'exchange_rate' => 'decimal:2',
            'featured_collection_enabled' => 'boolean',
            'featured_collection_new_arrivals_enabled' => 'boolean',
            'featured_collection_best_sellers_enabled' => 'boolean',
            'about_page_enabled' => 'boolean',
            'about_hero_enabled' => 'boolean',
            'about_narrative_enabled' => 'boolean',
            'about_values_enabled' => 'boolean',
            'about_cta_enabled' => 'boolean',
            'about_value1_enabled' => 'boolean',
            'about_value2_enabled' => 'boolean',
            'about_value3_enabled' => 'boolean',
            'updated_at' => 'datetime',
        ];
    }
}

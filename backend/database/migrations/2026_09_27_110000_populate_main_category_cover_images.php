<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Add the existing category artwork to matching catalog records without
     * replacing any image that an administrator has already uploaded.
     */
    public function up(): void
    {
        $images = [
            'غذائيات' => '/images/categories/canned-goods.webp',
            'مشروبات' => '/images/categories/beverages-coffee.webp',
            'منظفات' => '/images/categories/cleaning-supplies.webp',
            'نقرشات' => '/images/categories/snacks-nuts.webp',
        ];

        foreach ($images as $name => $image) {
            DB::table('main_categories')
                ->where('name', $name)
                ->where(fn ($query) => $query->whereNull('image')->orWhere('image', ''))
                ->update(['image' => $image, 'updated_at' => now()]);
        }
    }

    public function down(): void
    {
        // Preserve images so rollback does not erase administrator changes.
    }
};

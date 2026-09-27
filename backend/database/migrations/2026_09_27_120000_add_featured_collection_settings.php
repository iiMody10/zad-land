<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->boolean('featured_collection_enabled')->default(true);
            $table->boolean('featured_collection_new_arrivals_enabled')->default(true);
            $table->boolean('featured_collection_best_sellers_enabled')->default(true);
            $table->longText('featured_collection_title')->nullable();
            $table->longText('featured_collection_title_ar')->nullable();
            $table->longText('featured_collection_new_arrivals_label')->nullable();
            $table->longText('featured_collection_new_arrivals_label_ar')->nullable();
            $table->longText('featured_collection_best_sellers_label')->nullable();
            $table->longText('featured_collection_best_sellers_label_ar')->nullable();
            $table->longText('featured_collection_all_products_label')->nullable();
            $table->longText('featured_collection_all_products_label_ar')->nullable();
            $table->longText('featured_collection_all_products_url')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn([
                'featured_collection_enabled',
                'featured_collection_new_arrivals_enabled',
                'featured_collection_best_sellers_enabled',
                'featured_collection_title',
                'featured_collection_title_ar',
                'featured_collection_new_arrivals_label',
                'featured_collection_new_arrivals_label_ar',
                'featured_collection_best_sellers_label',
                'featured_collection_best_sellers_label_ar',
                'featured_collection_all_products_label',
                'featured_collection_all_products_label_ar',
                'featured_collection_all_products_url',
            ]);
        });
    }
};

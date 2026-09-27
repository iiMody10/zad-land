<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->string('id', 191)->collation('utf8mb4_0900_bin')->primary();
            $table->string('name', 191);
            $table->longText('name_ar')->nullable();
            $table->longText('name_en')->nullable();
            $table->string('slug', 767)->collation('utf8mb4_0900_bin')->unique('products_slug_unique');
            $table->longText('images');
            $table->boolean('is_trending')->default(false);
            $table->longText('description')->nullable();
            $table->longText('description_ar')->nullable();
            $table->longText('description_en')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->longText('discount_type')->nullable();
            $table->decimal('discount_value', 10, 2)->nullable();
            $table->integer('stock')->default(0);
            $table->integer('min_order')->default(1);
            $table->string('packaging', 1024)->nullable()->default('طرد');
            $table->longText('items_per_package')->nullable();
            $table->longText('options')->nullable();
            $table->string('category_id', 191)->collation('utf8mb4_0900_bin');
            $table->dateTime('created_at', precision: 3)->useCurrent();
            $table->dateTime('updated_at', precision: 3);
            $table->longText('sku')->nullable();
            $table->string('brand_id', 191)->collation('utf8mb4_0900_bin');
            $table->string('main_category_id', 191)->collation('utf8mb4_0900_bin')->nullable();

            $table->index('brand_id', 'products_brand_id_index');
            $table->index('category_id', 'products_category_id_index');
            $table->index('main_category_id', 'products_main_category_id_index');
            $table->index('is_trending', 'products_is_trending_index');
            $table->index('created_at', 'products_created_at_index');
            $table->index('name', 'products_name_index');
            $table->index(['category_id', 'created_at'], 'products_category_created_at_index');
            $table->index(['brand_id', 'created_at'], 'products_brand_created_at_index');
            $table->index(['main_category_id', 'created_at'], 'products_main_category_created_at_index');
            $table->index('price', 'products_price_index');
            $table->index('stock', 'products_stock_index');
            $table->index(['category_id', 'price'], 'products_category_price_index');
            $table->index(['brand_id', 'price'], 'products_brand_price_index');
            $table->foreign('brand_id', 'products_brand_id_foreign')
                ->references('id')->on('brands')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreign('category_id', 'products_category_id_foreign')
                ->references('id')->on('categories')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreign('main_category_id', 'products_main_category_id_foreign')
                ->references('id')->on('main_categories')->cascadeOnUpdate()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

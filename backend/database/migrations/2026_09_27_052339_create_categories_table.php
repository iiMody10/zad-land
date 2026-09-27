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
        Schema::create('categories', function (Blueprint $table) {
            $table->string('id', 191)->collation('utf8mb4_0900_bin')->primary();
            $table->string('name', 191)->collation('utf8mb4_0900_bin');
            $table->longText('description')->nullable();
            $table->longText('image')->nullable();
            $table->dateTime('created_at', precision: 3)->useCurrent();
            $table->dateTime('updated_at', precision: 3);
            $table->boolean('is_featured')->default(false);
            $table->string('slug', 767)->collation('utf8mb4_0900_bin')->unique('categories_slug_unique');
            $table->string('brand_id', 191)->collation('utf8mb4_0900_bin');
            $table->string('main_category_id', 191)->collation('utf8mb4_0900_bin')->nullable();

            $table->unique(['brand_id', 'name'], 'categories_brand_name_unique');
            $table->index('brand_id', 'categories_brand_id_index');
            $table->index('main_category_id', 'categories_main_category_id_index');
            $table->index('is_featured', 'categories_is_featured_index');
            $table->foreign('brand_id', 'categories_brand_id_foreign')
                ->references('id')->on('brands')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreign('main_category_id', 'categories_main_category_id_foreign')
                ->references('id')->on('main_categories')->cascadeOnUpdate()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};

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
        Schema::create('main_categories', function (Blueprint $table) {
            $table->string('id', 191)->collation('utf8mb4_0900_bin')->primary();
            $table->string('name', 767)->collation('utf8mb4_0900_bin')->unique('main_categories_name_unique');
            $table->string('slug', 767)->collation('utf8mb4_0900_bin')->unique('main_categories_slug_unique');
            $table->longText('description')->nullable();
            $table->longText('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('show_in_nav')->default(true);
            $table->integer('nav_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->dateTime('created_at', precision: 3)->useCurrent();
            $table->dateTime('updated_at', precision: 3);

            $table->index(['is_active', 'show_in_nav', 'nav_order'], 'main_categories_nav_visibility_index');
            $table->index('is_featured', 'main_categories_is_featured_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('main_categories');
    }
};

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
        Schema::create('brands', function (Blueprint $table) {
            $table->string('id', 191)->collation('utf8mb4_0900_bin')->primary();
            $table->string('name', 767)->collation('utf8mb4_0900_bin')->unique('brands_name_unique');
            $table->string('slug', 767)->collation('utf8mb4_0900_bin')->unique('brands_slug_unique');
            $table->longText('description')->nullable();
            $table->longText('image')->nullable();
            $table->enum('group', ['MAIN', 'DIFFERENT'])->collation('utf8mb4_0900_bin')->default('DIFFERENT');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->dateTime('created_at', precision: 3)->useCurrent();
            $table->dateTime('updated_at', precision: 3);
            $table->string('main_category_id', 191)->collation('utf8mb4_0900_bin')->nullable();

            $table->index('group', 'brands_group_index');
            $table->index('is_active', 'brands_is_active_index');
            $table->index('is_featured', 'brands_is_featured_index');
            $table->index('main_category_id', 'brands_main_category_id_index');
            $table->foreign('main_category_id', 'brands_main_category_id_foreign')
                ->references('id')->on('main_categories')->cascadeOnUpdate()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('brands');
    }
};

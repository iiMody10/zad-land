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
        Schema::create('banners', function (Blueprint $table) {
            $table->string('id', 191)->collation('utf8mb4_0900_bin')->primary();
            $table->longText('title')->nullable();
            $table->longText('subtitle')->nullable();
            $table->longText('title_ar')->nullable();
            $table->longText('subtitle_ar')->nullable();
            $table->longText('image');
            $table->string('button_text', 1024)->nullable()->default('Shop Now');
            $table->string('button_text_ar', 1024)->nullable()->default('تسوق الآن');
            $table->string('link', 1024)->nullable()->default('/products');
            $table->string('badge', 1024)->nullable()->default('Certified Wholesale');
            $table->string('badge_ar', 1024)->nullable()->default('توزيع جملة معتمد');
            $table->boolean('is_active')->default(true);
            $table->dateTime('created_at', precision: 3)->useCurrent();
            $table->dateTime('updated_at', precision: 3);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};

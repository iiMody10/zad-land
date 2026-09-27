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
        Schema::create('reviews', function (Blueprint $table) {
            $table->string('id', 191)->collation('utf8mb4_0900_bin')->primary();
            $table->string('product_id', 191)->collation('utf8mb4_0900_bin');
            $table->integer('rating');
            $table->longText('feedback')->nullable();
            $table->longText('image')->nullable();
            $table->longText('name');
            $table->longText('email')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->dateTime('created_at', precision: 3)->useCurrent();
            $table->dateTime('updated_at', precision: 3);

            $table->index('product_id', 'reviews_product_id_index');
            $table->index(['product_id', 'is_approved'], 'reviews_product_approved_index');
            $table->foreign('product_id', 'reviews_product_id_foreign')
                ->references('id')->on('products')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};

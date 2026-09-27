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
        Schema::create('wishlist_items', function (Blueprint $table) {
            $table->string('id', 191)->collation('utf8mb4_0900_bin')->primary();
            $table->string('customer_id', 191)->collation('utf8mb4_0900_bin');
            $table->string('product_id', 191)->collation('utf8mb4_0900_bin');
            $table->dateTime('created_at', precision: 3)->useCurrent();

            $table->unique(['customer_id', 'product_id'], 'wishlist_customer_product_unique');
            $table->index('product_id', 'wishlist_items_product_id_index');
            $table->foreign('customer_id', 'wishlist_items_customer_id_foreign')
                ->references('id')->on('customers')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('product_id', 'wishlist_items_product_id_foreign')
                ->references('id')->on('products')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wishlist_items');
    }
};

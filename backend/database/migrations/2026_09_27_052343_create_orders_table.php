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
        Schema::create('orders', function (Blueprint $table) {
            $table->string('id', 191)->collation('utf8mb4_0900_bin')->primary();
            $table->string('customer_id', 191)->collation('utf8mb4_0900_bin')->nullable();
            $table->longText('shop_name')->nullable();
            $table->longText('notes')->nullable();
            $table->string('idempotency_key', 767)->collation('utf8mb4_0900_bin')->nullable()
                ->unique('orders_idempotency_key_unique');
            $table->longText('request_hash')->nullable();
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
                ->collation('utf8mb4_0900_bin')->default('PENDING');
            $table->dateTime('created_at', precision: 3)->useCurrent();
            $table->dateTime('updated_at', precision: 3);
            $table->longText('city');
            $table->longText('street_address');
            $table->longText('name');
            $table->longText('phone');
            $table->decimal('discount', 10, 2)->default(0);
            $table->boolean('stock_reserved')->nullable();
            $table->string('promo_code_id', 191)->collation('utf8mb4_0900_bin')->nullable();

            $table->index('status', 'orders_status_index');
            $table->index('created_at', 'orders_created_at_index');
            $table->index('promo_code_id', 'orders_promo_code_id_index');
            $table->index('customer_id', 'orders_customer_id_index');
            $table->foreign('customer_id', 'orders_customer_id_foreign')
                ->references('id')->on('customers')->cascadeOnUpdate()->nullOnDelete();
            $table->foreign('promo_code_id', 'orders_promo_code_id_foreign')
                ->references('id')->on('promo_codes')->cascadeOnUpdate()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

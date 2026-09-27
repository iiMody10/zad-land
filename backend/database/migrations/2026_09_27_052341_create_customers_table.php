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
        Schema::create('customers', function (Blueprint $table) {
            $table->string('id', 191)->collation('utf8mb4_0900_bin')->primary();
            $table->longText('shop_name');
            $table->longText('owner_name');
            $table->string('phone', 64)->collation('utf8mb4_0900_bin')->unique('customers_phone_unique');
            $table->longText('city');
            $table->longText('address');
            $table->string('password', 255);
            $table->longText('notes')->nullable();
            $table->boolean('is_active')->default(false);
            $table->dateTime('created_at', precision: 3)->useCurrent();
            $table->dateTime('updated_at', precision: 3);

            $table->index(['is_active', 'created_at'], 'customers_active_created_at_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};

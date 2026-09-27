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
        Schema::create('users', function (Blueprint $table) {
            $table->string('id', 191)->collation('utf8mb4_0900_bin')->primary();
            $table->string('password', 255);
            $table->dateTime('created_at', precision: 3)->useCurrent();
            $table->dateTime('updated_at', precision: 3);
            $table->string('username', 767)->collation('utf8mb4_0900_bin')->unique('users_username_unique');
            $table->boolean('can_delete_banners')->default(true);
            $table->boolean('can_delete_categories')->default(true);
            $table->boolean('can_delete_orders')->default(true);
            $table->boolean('can_delete_products')->default(true);
            $table->boolean('can_delete_promo_codes')->default(true);
            $table->boolean('can_manage_banners')->default(true);
            $table->boolean('can_manage_categories')->default(true);
            $table->boolean('can_manage_orders')->default(true);
            $table->boolean('can_manage_products')->default(true);
            $table->boolean('can_manage_promo_codes')->default(true);
            $table->enum('role', ['SUPER_ADMIN', 'ADMIN'])->collation('utf8mb4_0900_bin')->default('ADMIN');
            $table->boolean('can_delete_brands')->default(true);
            $table->boolean('can_manage_brands')->default(true);
            $table->boolean('can_manage_reviews')->default(true);
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id', 191)->collation('utf8mb4_0900_bin')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('users');
    }
};

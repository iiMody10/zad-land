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
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->string('id', 191)->collation('utf8mb4_0900_bin')->primary();
            $table->string('name', 191);
            $table->string('business_name', 191)->nullable();
            $table->string('phone', 64);
            $table->text('message');
            $table->string('status', 32)->default('unread');
            $table->dateTime('created_at', precision: 3)->useCurrent();
            $table->dateTime('updated_at', precision: 3);

            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
    }
};

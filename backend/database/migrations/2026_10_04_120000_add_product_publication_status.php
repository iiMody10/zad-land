<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            // Keep existing catalog entries published; stock is managed separately.
            $table->boolean('is_active')->default(true)->after('is_trending');
            $table->index('is_active', 'products_is_active_index');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->dropIndex('products_is_active_index');
            $table->dropColumn('is_active');
        });
    }
};

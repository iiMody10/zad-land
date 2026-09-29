<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->decimal('price', 10, 2)->nullable()->change();
            $table->integer('stock')->nullable()->default(null)->change();
            $table->boolean('pricing_needs_review')->default(false)->after('items_per_package');
        });
    }

    public function down(): void
    {
        DB::table('products')->whereNull('price')->update(['price' => 0]);
        DB::table('products')->whereNull('stock')->update(['stock' => 0]);
        Schema::table('products', function (Blueprint $table): void {
            $table->dropColumn('pricing_needs_review');
        });

        Schema::table('products', function (Blueprint $table): void {
            $table->decimal('price', 10, 2)->nullable(false)->change();
            $table->integer('stock')->default(0)->nullable(false)->change();
        });
    }
};

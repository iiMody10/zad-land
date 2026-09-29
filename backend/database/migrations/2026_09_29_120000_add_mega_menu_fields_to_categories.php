<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->boolean('show_in_nav')->default(true);
            $table->unsignedInteger('nav_order')->default(0);
            $table->index(['main_category_id', 'show_in_nav', 'nav_order'], 'categories_mega_menu_order_index');
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex('categories_mega_menu_order_index');
            $table->dropColumn(['show_in_nav', 'nav_order']);
        });
    }
};

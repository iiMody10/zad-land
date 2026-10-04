<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->longText('company_contacts')->nullable();
        });

        DB::table('settings')->where('id', 'site-settings')->update([
            'company_contacts' => json_encode([
                ['id' => 'company-manager', 'nameAr' => 'حسام', 'nameEn' => 'Hussam', 'roleAr' => 'مدير الشركة', 'roleEn' => 'Company Manager', 'phone' => '0944664406', 'enabled' => true],
                ['id' => 'sales-manager', 'nameAr' => 'محمد', 'nameEn' => 'Mohammad', 'roleAr' => 'مدير مبيعات', 'roleEn' => 'Sales Manager', 'phone' => '0969392878', 'enabled' => true],
            ], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
        ]);
    }

    public function down(): void
    {
        Schema::table('settings', fn (Blueprint $table) => $table->dropColumn('company_contacts'));
    }
};

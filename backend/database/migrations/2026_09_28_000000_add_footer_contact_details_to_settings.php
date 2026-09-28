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
            $table->longText('footer_contact_title')->nullable();
            $table->longText('footer_contact_title_ar')->nullable();
            $table->longText('footer_address')->nullable();
            $table->longText('footer_address_ar')->nullable();
            $table->longText('footer_phone')->nullable();
            $table->longText('footer_email')->nullable();
            $table->longText('footer_whatsapp_label')->nullable();
            $table->longText('footer_whatsapp_label_ar')->nullable();
        });

        DB::table('settings')->where('id', 'site-settings')->update([
            'footer_contact_title' => 'Contact Information',
            'footer_contact_title_ar' => 'معلومات التواصل',
            'footer_address' => 'Homs, Syria',
            'footer_address_ar' => 'حمص، سوريا',
            'footer_phone' => '+963 933 254 796',
            'footer_email' => 'info@zadland.com',
            'footer_whatsapp_label' => 'Chat on WhatsApp',
            'footer_whatsapp_label_ar' => 'تواصل معنا عبر واتساب',
        ]);
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn([
                'footer_contact_title',
                'footer_contact_title_ar',
                'footer_address',
                'footer_address_ar',
                'footer_phone',
                'footer_email',
                'footer_whatsapp_label',
                'footer_whatsapp_label_ar',
            ]);
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->string('id', 191)->collation('utf8mb4_0900_bin')->default('site-settings')->primary();
            $table->longText('categories_cta_title')->nullable();
            $table->longText('categories_cta_desc')->nullable();
            $table->longText('categories_cta_title_ar')->nullable();
            $table->longText('categories_cta_desc_ar')->nullable();
            $table->dateTime('updated_at', precision: 3);
            $table->longText('categories_cta_image')->nullable();
            $table->longText('express_shipping_time')->nullable();
            $table->longText('final_sale_desc')->nullable();
            $table->longText('final_sale_desc_ar')->nullable();
            $table->longText('final_sale_title')->nullable();
            $table->longText('final_sale_title_ar')->nullable();
            $table->longText('returns_desc')->nullable();
            $table->longText('returns_desc_ar')->nullable();
            $table->longText('returns_title')->nullable();
            $table->longText('returns_title_ar')->nullable();
            $table->longText('shipping_desc')->nullable();
            $table->longText('shipping_desc_ar')->nullable();
            $table->longText('shipping_title')->nullable();
            $table->longText('shipping_title_ar')->nullable();
            $table->longText('standard_shipping_time')->nullable();
            $table->longText('verification_desc')->nullable();
            $table->longText('verification_desc_ar')->nullable();
            $table->longText('verification_title')->nullable();
            $table->longText('verification_title_ar')->nullable();
            $table->longText('hygiene_desc')->nullable();
            $table->longText('hygiene_desc_ar')->nullable();
            $table->longText('hygiene_title')->nullable();
            $table->longText('hygiene_title_ar')->nullable();
            $table->longText('shipping_returns_image')->nullable();
            $table->longText('about_hero_image')->nullable();
            $table->longText('about_hero_subtitle')->nullable();
            $table->longText('about_hero_subtitle_ar')->nullable();
            $table->longText('about_hero_title')->nullable();
            $table->longText('about_hero_title_ar')->nullable();
            $table->longText('about_narrative_desc1')->nullable();
            $table->longText('about_narrative_desc1_ar')->nullable();
            $table->longText('about_narrative_desc2')->nullable();
            $table->longText('about_narrative_desc2_ar')->nullable();
            $table->longText('about_narrative_image')->nullable();
            $table->longText('about_narrative_quote')->nullable();
            $table->longText('about_narrative_quote_ar')->nullable();
            $table->longText('about_narrative_title')->nullable();
            $table->longText('about_narrative_title_ar')->nullable();
            $table->longText('about_value1_desc')->nullable();
            $table->longText('about_value1_desc_ar')->nullable();
            $table->longText('about_value1_title')->nullable();
            $table->longText('about_value1_title_ar')->nullable();
            $table->longText('about_value2_desc')->nullable();
            $table->longText('about_value2_desc_ar')->nullable();
            $table->longText('about_value2_title')->nullable();
            $table->longText('about_value2_title_ar')->nullable();
            $table->longText('about_value3_desc')->nullable();
            $table->longText('about_value3_desc_ar')->nullable();
            $table->longText('about_value3_title')->nullable();
            $table->longText('about_value3_title_ar')->nullable();
            $table->longText('about_values_desc')->nullable();
            $table->longText('about_values_desc_ar')->nullable();
            $table->longText('about_values_title')->nullable();
            $table->longText('about_values_title_ar')->nullable();
            $table->longText('about_narrative_founded')->nullable();
            $table->longText('about_narrative_founded_ar')->nullable();
            $table->longText('footer_brand_title')->nullable();
            $table->longText('footer_brand_title_ar')->nullable();
            $table->longText('footer_brand_description')->nullable();
            $table->longText('footer_brand_description_ar')->nullable();
            $table->longText('footer_copyright')->nullable();
            $table->longText('footer_copyright_ar')->nullable();
            $table->longText('footer_instagram_url')->nullable();
            $table->longText('footer_facebook_url')->nullable();
            $table->longText('footer_whatsapp_url')->nullable();
            $table->longText('footer_shop_title')->nullable();
            $table->longText('footer_shop_title_ar')->nullable();
            $table->longText('footer_support_title')->nullable();
            $table->longText('footer_support_title_ar')->nullable();
            $table->longText('footer_company_title')->nullable();
            $table->longText('footer_company_title_ar')->nullable();
            $table->longText('footer_support_link1_label')->nullable();
            $table->longText('footer_support_link1_label_ar')->nullable();
            $table->longText('footer_support_link1_url')->nullable();
            $table->longText('footer_support_link2_label')->nullable();
            $table->longText('footer_support_link2_label_ar')->nullable();
            $table->longText('footer_support_link2_url')->nullable();
            $table->longText('footer_support_link3_label')->nullable();
            $table->longText('footer_support_link3_label_ar')->nullable();
            $table->longText('footer_support_link3_url')->nullable();
            $table->longText('footer_company_link1_label')->nullable();
            $table->longText('footer_company_link1_label_ar')->nullable();
            $table->longText('footer_company_link1_url')->nullable();
            $table->longText('footer_company_link2_label')->nullable();
            $table->longText('footer_company_link2_label_ar')->nullable();
            $table->longText('footer_company_link2_url')->nullable();
            $table->longText('footer_company_link3_label')->nullable();
            $table->longText('footer_company_link3_label_ar')->nullable();
            $table->longText('footer_company_link3_url')->nullable();
            $table->longText('footer_category1_id')->nullable();
            $table->longText('footer_category2_id')->nullable();
            $table->longText('footer_category3_id')->nullable();
            $table->longText('footer_category4_id')->nullable();
            $table->decimal('exchange_rate', 10, 2)->default(135);
            $table->longText('middle_banner1_image')->nullable();
            $table->longText('middle_banner1_link')->nullable();
            $table->longText('middle_banner2_button_text')->nullable();
            $table->longText('middle_banner2_button_text_ar')->nullable();
            $table->longText('middle_banner2_image')->nullable();
            $table->longText('middle_banner2_link')->nullable();
            $table->longText('middle_banner2_subtitle')->nullable();
            $table->longText('middle_banner2_subtitle_ar')->nullable();
            $table->longText('middle_banner2_title')->nullable();
            $table->longText('middle_banner2_title_ar')->nullable();
        });

        DB::table('settings')->insert([
            array_merge([
                'id' => 'site-settings',
                'categories_cta_title' => 'Looking for specific wholesale brands?',
                'categories_cta_desc' => 'Our wholesale team is ready to provide custom pricing and scheduled deliveries for your business.',
                'categories_cta_title_ar' => 'تبحث عن شركات أو منتجات محددة؟',
                'categories_cta_desc_ar' => 'فريق المبيعات لدينا جاهز لتزويدكم بأفضل أسعار الجملة وجداول التوزيع المنتظمة.',
                'categories_cta_image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-S_GMsoebb73JIEWcxtvH2G-vVgkfypE8ysWpGMNiiiwyTno8rIbMCpHR-fsa76ZQL49aYswb7bGZh-kgwc6z9lv0VwUSUrStxNWz2qU3RuIb75ShOMAKZMRyrOXZHZjEBgtxfW7r97FEEshOkEd2MqgE6FpGYrmKa8msLtMOQxXBsmhr3ZGGEtL7jpzgMYbgrAXhiHcMfCspdvD5FRNuSbgFY9_xGqcJM9KbgG0MoC4Ie4WkkmCR4FsuavfglcnY13G2ADZxlK8F',
                'express_shipping_time' => '24 Hours',
                'final_sale_desc' => 'All goods are shipped in factory-sealed cases conforming to international standards.',
                'final_sale_desc_ar' => 'يتم تسليم البضائع في كراتين المصنع الأصلية والمطابقة للمواصفات القياسية.',
                'final_sale_title' => 'Wholesale Delivery Terms',
                'final_sale_title_ar' => 'شروط تسليم الجملة',
                'returns_desc' => 'We are committed to full satisfaction and verified shipment handling.',
                'returns_desc_ar' => 'نحن ملتزمون بالجودة والمطابقة التامة للشحنات.',
                'returns_title' => 'Wholesale Support',
                'returns_title_ar' => 'دعم الجملة',
                'shipping_desc' => 'We ensure wholesale goods reach your business in perfect condition.',
                'shipping_desc_ar' => 'نحن نضمن وصول بضائع الجملة إلى نشاطكم التجاري في أفضل حالة.',
                'shipping_title' => 'Fast & Reliable Distribution',
                'shipping_title_ar' => 'توزيع سريع وموثوق',
                'standard_shipping_time' => '1-3 Business Days',
                'verification_desc' => 'Orders are verified and scheduled immediately with our logistics fleet.',
                'verification_desc_ar' => 'يتم التحقق من الطلبات وجدولتها فوراً مع أسطولنا اللوجستي.',
                'verification_title' => 'Verification Process',
                'verification_title_ar' => 'عملية التحقق',
                'hygiene_desc' => 'Our temperature-controlled warehouses ensure optimal quality preservation.',
                'hygiene_desc_ar' => 'تضمن مستودعاتنا وشاحناتنا درجات حرارة وبيئة تخزين مثالية حتى نقطة التسليم.',
                'hygiene_title' => 'Safety & Temperature Storage',
                'hygiene_title_ar' => 'بروتوكولات السلامة والتخزين',
                'shipping_returns_image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1GmfD6bueEsJqlHNPjDWHMlhsLZSm2Jmp21TUCLKvobkcd7oAPMMdwzfm8BOHC5XtR0EP6tLI7DT5hhyLxuijsbpX2kQf6iNlqROU-8k-DrqZAUqdc7-0lE4nxuCcLaEb0fEaXVBxc_yXkiUlyhfvaYJ1FfHZtngnoJbeanLgsf7rcxqON6rjkoC4BQv6FhlwLNKZrMbxjCugphq-bo5GCqBoLfmjjZSuH0N5eV-Kz33xFQTD5jSYCTsVYAwOkwhLQsQiPD_lnD9U',
                'about_hero_image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz8qN2iAHz-UZeEQfqOY49U5OCZ5z4ejVm7ILFjFSl9S5xg_6UuBa61qOmrkMPrBa4CuXDzHa9EN3-LNyUxi5IDK5A9TvJWkNuG-tt_RRyvJH8LvynO1daOEkTk47KDtkW3Md2ugZYShZJdxolsjiJUtDdOOz4Q7-6TNrexIvyClP0ADf1TWdbCUk1kBn8bfzhTC1cn8s9jG3yt0tDDht7__J5YKKf690SmKN4WIJX_pc2LOj3x1CnYk5JuqEu0Bzp2vGwsrYLaJWb',
                'about_hero_subtitle' => 'Your trusted partner for distributing top quality global goods and food products.',
                'about_hero_subtitle_ar' => 'شريككم الموثوق لتوزيع البضائع والمواد الغذائية من أفضل الشركات العالمية.',
                'about_hero_title' => 'Our Story',
                'about_hero_title_ar' => 'قصتنا',
                'about_narrative_desc1' => 'At Zad Land, we bridge the gap between world-renowned international brands and local markets. We believe in providing retailers and businesses with seamless access to authentic, top-tier goods at competitive wholesale prices.',
                'about_narrative_desc1_ar' => 'في زاد لاند، نعمل كجسر موثوق يربط بين كبرى الشركات والعلامات التجارية العالمية والأسواق المحلية.',
                'about_narrative_desc2' => 'With rigorous quality control, modern logistics, and a commitment to reliability, Zad Land has established itself as the trusted partner for food and consumer goods distribution across all governorates.',
                'about_narrative_desc2_ar' => 'بفضل أسطول التوزيع المنظم والمستودعات المجهزة، أثبتت زاد لاند مكانتها كشركة رائدة وموثوقة لتوزيع البضائع الغذائية والاستهلاكية في جميع المحافظات.',
                'about_narrative_image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4yp4c_LJLNPwaV2ay8DZ6xRHD0UF1WqXU8eDtrdDoiVjtq9oNRc9Cn6cnbqsNwOLO-y-99jnkiLnCsGLs2rQqthU8TPqhAh2Msisbst1UyfyrILBR5fRO7KYu90u1FEoeRRjGceGVbB5vz2SJAtjzUrLLtA6BmR8VN5a5Seo4MraBJj7i4Gs4QPEZbURtSN-F7wbJsu4WNj3pEaWlye2SuJvokQhYXJ27gnAoabHg5_0_4DZY49qyKnQuMHHL9atOIILRIMD3FkeZ',
                'about_narrative_quote' => 'Connecting you with the world\'s finest brands.',
                'about_narrative_quote_ar' => 'جودة مضمونة وخدمة توزيع موثوقة.',
                'about_narrative_title' => 'Our Mission for Quality Distribution',
                'about_narrative_title_ar' => 'مهمتنا في التوزيع الموثوق',
                'about_value1_desc' => 'All products are certified authentic from original manufacturers.',
                'about_value1_desc_ar' => 'جميع المنتجات أصلية 100% ومطابقة لأعلى معايير الجودة والمواصفات.',
                'about_value1_title' => 'Certified Quality',
                'about_value1_title_ar' => 'جودة ومواصفات قياسية',
                'about_value2_desc' => 'Direct distribution partnerships with leading global brands.',
                'about_value2_desc_ar' => 'شراكات توزيع مباشرة مع كبرى العلامات التجارية العالمية.',
                'about_value2_title' => '100% Authentic',
                'about_value2_title_ar' => 'أصلي 100٪',
                'about_value3_desc' => 'Temperature-controlled logistics fleet covering all distribution channels.',
                'about_value3_desc_ar' => 'أسطول سيارات وشاحنات مجهزة لنقل وتوزيع البضائع والمفرزات بدقة وكفاءة.',
                'about_value3_title' => 'Reliable Fleet',
                'about_value3_title_ar' => 'أسطول توزيع مجهز',
                'about_values_desc' => 'We are committed to transparency, reliability, and excellence in food distribution.',
                'about_values_desc_ar' => 'نحن ملتزمون بالشفافية والموثوقية والتميز في توزيع البضائع والمواد الغذائية.',
                'about_values_title' => 'Our Core Values',
                'about_values_title_ar' => 'قيمنا الجوهرية',
                'about_narrative_founded' => 'Founded with Trust',
                'about_narrative_founded_ar' => 'تأسست على الثقة',
                'footer_brand_title' => 'Zad Land',
                'footer_brand_title_ar' => 'زاد لاند',
                'footer_brand_description' => 'Your trusted partner in wholesale food and consumer goods distribution from top international brands.',
                'footer_brand_description_ar' => 'شريككم الموثوق لتوزيع البضائع والمواد الغذائية من أفضل الشركات العالمية.',
                'footer_copyright' => '© 2026 Zad Land. All rights reserved.',
                'footer_copyright_ar' => '© 2026 زاد لاند. جميع الحقوق محفوظة.',
                'footer_instagram_url' => '#',
                'footer_facebook_url' => '#',
                'footer_whatsapp_url' => '#',
                'footer_shop_title' => 'Shop',
                'footer_shop_title_ar' => 'المتجر',
                'footer_support_title' => 'Support',
                'footer_support_title_ar' => 'الدعم',
                'footer_company_title' => 'Company',
                'footer_company_title_ar' => 'الشركة',
                'footer_support_link1_label' => 'Help Center',
                'footer_support_link1_label_ar' => 'مركز المساعدة',
                'footer_support_link1_url' => '#',
                'footer_support_link2_label' => 'Shipping & Returns',
                'footer_support_link2_label_ar' => 'التوزيع والتسليم',
                'footer_support_link2_url' => '/shipping-returns',
                'footer_support_link3_label' => 'Contact Us',
                'footer_support_link3_label_ar' => 'اتصل بنا',
                'footer_support_link3_url' => '#',
                'footer_company_link1_label' => 'About Us',
                'footer_company_link1_label_ar' => 'من نحن',
                'footer_company_link1_url' => '/about-us',
                'exchange_rate' => 135,
                'middle_banner1_image' => 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200',
                'middle_banner1_link' => '/products',
                'middle_banner2_button_text' => 'Explore Catalog',
                'middle_banner2_button_text_ar' => 'تصفح الكتالوج',
                'middle_banner2_image' => 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=1200',
                'middle_banner2_link' => '/products',
                'middle_banner2_subtitle' => 'Discover the best products from around the world.',
                'middle_banner2_subtitle_ar' => 'اكتشف أفضل المنتجات من كبرى الشركات العالمية.',
                'middle_banner2_title' => 'Global Brands',
                'middle_banner2_title_ar' => 'شركات عالمية',
            ], ['updated_at' => now()]),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};

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
            foreach (['about_page', 'about_hero', 'about_narrative', 'about_values', 'about_cta', 'about_value1', 'about_value2', 'about_value3'] as $section) {
                $table->boolean($section.'_enabled')->default(true);
            }

            foreach ([
                'about_hero_eyebrow', 'about_hero_eyebrow_ar',
                'about_hero_image_alt', 'about_hero_image_alt_ar',
                'about_hero_primary_cta_label', 'about_hero_primary_cta_label_ar',
                'about_hero_primary_cta_url', 'about_hero_secondary_cta_label', 'about_hero_secondary_cta_label_ar',
                'about_hero_secondary_cta_url',
                'about_narrative_image_alt', 'about_narrative_image_alt_ar',
                'about_values_eyebrow', 'about_values_eyebrow_ar',
                'about_cta_eyebrow', 'about_cta_eyebrow_ar', 'about_cta_title', 'about_cta_title_ar',
                'about_cta_button_label', 'about_cta_button_label_ar', 'about_cta_url',
                'about_seo_title', 'about_seo_title_ar', 'about_seo_description', 'about_seo_description_ar',
            ] as $column) {
                $table->longText($column)->nullable();
            }
        });

        $settings = DB::table('settings')->where('id', 'site-settings')->first();
        if (! $settings) {
            return;
        }

        $defaults = [
            'about_hero_eyebrow' => 'Zad Land · Wholesale distribution',
            'about_hero_eyebrow_ar' => 'زاد لاند · تجارة وتوزيع بالجملة',
            'about_hero_image_alt' => 'Zad Land wholesale distribution',
            'about_hero_image_alt_ar' => 'مركز زاد لاند للتوزيع',
            'about_hero_primary_cta_label' => 'Explore products',
            'about_hero_primary_cta_label_ar' => 'تصفّح المنتجات',
            'about_hero_primary_cta_url' => '/products',
            'about_hero_secondary_cta_label' => 'Contact us',
            'about_hero_secondary_cta_label_ar' => 'تواصلوا معنا',
            'about_hero_secondary_cta_url' => '/contact',
            'about_narrative_image_alt' => 'Products supplied by Zad Land',
            'about_narrative_image_alt_ar' => 'منتجات توزعها زاد لاند',
            'about_values_eyebrow' => 'How we work',
            'about_values_eyebrow_ar' => 'نهجنا في العمل',
            'about_cta_eyebrow' => 'For retailers and businesses',
            'about_cta_eyebrow_ar' => 'للمتاجر وأصحاب الأعمال',
            'about_cta_title' => 'Looking for a dependable wholesale partner?',
            'about_cta_title_ar' => 'هل تبحثون عن شريك موثوق لتجارة الجملة؟',
            'about_cta_button_label' => 'Talk to our team',
            'about_cta_button_label_ar' => 'تواصلوا مع فريقنا',
            'about_cta_url' => '/contact',
            'about_seo_title' => 'About Zad Land | Wholesale distribution',
            'about_seo_title_ar' => 'من نحن | زاد لاند لتجارة وتوزيع المواد الغذائية',
            'about_seo_description' => 'Learn how Zad Land connects trusted food and consumer brands with retailers and businesses.',
            'about_seo_description_ar' => 'تعرف على زاد لاند وشبكة التوريد التي تربط العلامات التجارية بالمتاجر وأصحاب الأعمال.',
        ];

        $updates = [];
        foreach ($defaults as $column => $value) {
            if (! isset($settings->{$column}) || trim((string) $settings->{$column}) === '') {
                $updates[$column] = $value;
            }
        }

        $legacyDefaults = [
            'about_hero_title' => ['Our Story' => 'A dependable partner for everyday trade.'],
            'about_hero_title_ar' => ['قصتنا' => 'شريك موثوق لتجارة تلبي الاحتياجات اليومية.'],
            'about_hero_subtitle' => ['Your trusted partner for distributing top quality global goods and food products.' => 'We bring trusted food and consumer brands closer to the businesses and communities that count on them.'],
            'about_hero_subtitle_ar' => ['شريككم الموثوق لتوزيع البضائع والمواد الغذائية من أفضل الشركات العالمية.' => 'نقرّب العلامات الموثوقة في الغذاء والمنتجات الاستهلاكية من المتاجر والمجتمعات التي تعتمد عليها.'],
            'about_narrative_founded' => ['Founded with Trust' => 'Our story'],
            'about_narrative_founded_ar' => ['تأسست على الثقة' => 'قصتنا'],
            'about_narrative_title' => ['Our Mission for Quality Distribution' => 'Reliable supply, built on long-term relationships.'],
            'about_narrative_title_ar' => ['مهمتنا في التوزيع الموثوق' => 'توريد موثوق، وعلاقات عمل تدوم.'],
            'about_narrative_desc1' => ['At Zad Land, we bridge the gap between world-renowned international brands and local markets. We believe in providing retailers and businesses with seamless access to authentic, top-tier goods at competitive wholesale prices.' => 'Zad Land sources and distributes a considered range of food and consumer goods, connecting trusted brands with the local shops and markets people depend on.'],
            'about_narrative_desc1_ar' => ['في زاد لاند، نعمل كجسر موثوق يربط بين كبرى الشركات والعلامات التجارية العالمية والأسواق المحلية.' => 'توفر زاد لاند مجموعة مختارة من المنتجات الغذائية والاستهلاكية، وتربط العلامات الموثوقة بالمتاجر والأسواق المحلية التي يعتمد عليها الناس.'],
            'about_narrative_desc2' => ['With rigorous quality control, modern logistics, and a commitment to reliability, Zad Land has established itself as the trusted partner for food and consumer goods distribution across all governorates.' => 'We believe good distribution starts with clear communication and dependable service. Our team works closely with suppliers and customers to make wholesale trade easier and more consistent.'],
            'about_narrative_desc2_ar' => ['بفضل أسطول التوزيع المنظم والمستودعات المجهزة، أثبتت زاد لاند مكانتها كشركة رائدة وموثوقة لتوزيع البضائع الغذائية والاستهلاكية في جميع المحافظات.' => 'نؤمن بأن التوزيع الجيد يبدأ بالتواصل الواضح والخدمة التي يمكن الاعتماد عليها. يعمل فريقنا عن قرب مع الموردين والعملاء لتسهيل تجارة الجملة وجعلها أكثر انتظاماً.'],
            'about_narrative_quote' => ["Connecting you with the world's finest brands." => 'Dependable supply helps local businesses grow.'],
            'about_narrative_quote_ar' => ['جودة مضمونة وخدمة توزيع موثوقة.' => 'التوريد الموثوق يدعم نمو الأعمال المحلية.'],
            'about_values_title' => ['Our Core Values' => 'What our partners can expect.'],
            'about_values_title_ar' => ['قيمنا الجوهرية' => 'ما يمكن لشركائنا الاعتماد عليه.'],
            'about_values_desc' => ['We are committed to transparency, reliability, and excellence in food distribution.' => 'A practical approach focused on product choice, lasting partnerships and reliable delivery.'],
            'about_values_desc_ar' => ['نحن ملتزمون بالشفافية والموثوقية والتميز في توزيع البضائع والمواد الغذائية.' => 'نهج عملي يركز على تنوع المنتجات، والشراكات المستمرة، والتوريد الموثوق.'],
            'about_value1_title' => ['Certified Quality' => 'A considered selection'],
            'about_value1_title_ar' => ['جودة ومواصفات قياسية' => 'اختيار بعناية'],
            'about_value1_desc' => ['All products are certified authentic from original manufacturers.' => 'A practical range of food and everyday goods from brands our partners know.'],
            'about_value1_desc_ar' => ['جميع المنتجات أصلية 100% ومطابقة لأعلى معايير الجودة والمواصفات.' => 'تشكيلة عملية من المواد الغذائية والمنتجات اليومية من علامات يعرفها شركاؤنا.'],
            'about_value2_title' => ['100% Authentic' => 'Partnership that lasts'],
            'about_value2_title_ar' => ['أصلي 100٪' => 'شراكة تدوم'],
            'about_value2_desc' => ['Direct distribution partnerships with leading global brands.' => 'Clear, responsive collaboration with suppliers and local businesses.'],
            'about_value2_desc_ar' => ['شراكات توزيع مباشرة مع كبرى العلامات التجارية العالمية.' => 'تعاون واضح وسريع الاستجابة مع الموردين وأصحاب الأعمال.'],
            'about_value3_title' => ['Reliable Fleet' => 'Reliable supply'],
            'about_value3_title_ar' => ['أسطول توزيع مجهز' => 'توريد يمكن الاعتماد عليه'],
            'about_value3_desc' => ['Temperature-controlled logistics fleet covering all distribution channels.' => 'Organized distribution shaped around the needs of local trade.'],
            'about_value3_desc_ar' => ['أسطول سيارات وشاحنات مجهزة لنقل وتوزيع البضائع والمفرزات بدقة وكفاءة.' => 'توزيع منظم يراعي احتياجات التجارة المحلية.'],
        ];

        foreach ($legacyDefaults as $column => $replacements) {
            $current = (string) ($settings->{$column} ?? '');
            if (isset($replacements[$current])) {
                $updates[$column] = $replacements[$current];
            }
        }

        if (str_starts_with((string) ($settings->about_hero_image ?? ''), 'https://lh3.googleusercontent.com/aida-public/')) {
            $updates['about_hero_image'] = '/images/redesign/hero-bg.png';
        }
        if (str_starts_with((string) ($settings->about_narrative_image ?? ''), 'https://lh3.googleusercontent.com/aida-public/')) {
            $updates['about_narrative_image'] = '/images/redesign/ad-banner-bg.png';
        }

        if ($updates) {
            DB::table('settings')->where('id', 'site-settings')->update($updates);
        }
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn([
                'about_page_enabled', 'about_hero_enabled', 'about_narrative_enabled', 'about_values_enabled',
                'about_cta_enabled', 'about_value1_enabled', 'about_value2_enabled', 'about_value3_enabled',
                'about_hero_eyebrow', 'about_hero_eyebrow_ar', 'about_hero_image_alt', 'about_hero_image_alt_ar',
                'about_hero_primary_cta_label', 'about_hero_primary_cta_label_ar', 'about_hero_primary_cta_url',
                'about_hero_secondary_cta_label', 'about_hero_secondary_cta_label_ar', 'about_hero_secondary_cta_url',
                'about_narrative_image_alt', 'about_narrative_image_alt_ar', 'about_values_eyebrow',
                'about_values_eyebrow_ar', 'about_cta_eyebrow', 'about_cta_eyebrow_ar', 'about_cta_title',
                'about_cta_title_ar', 'about_cta_button_label', 'about_cta_button_label_ar', 'about_cta_url',
                'about_seo_title', 'about_seo_title_ar', 'about_seo_description', 'about_seo_description_ar',
            ]);
        });
    }
};

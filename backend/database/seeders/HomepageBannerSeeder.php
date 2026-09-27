<?php

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;

class HomepageBannerSeeder extends Seeder
{
    public function run(): void
    {
        Banner::firstOrCreate(
            ['image' => '/images/redesign/hero-bg.png'],
            [
                'title' => 'Connecting Global Brands to Every Market',
                'subtitle' => "Zad Land leading wholesale distribution\nOfficial partner for global products in Syria - Homs",
                'title_ar' => 'نصل بالعلامات العالمية إلى كل سوق',
                'subtitle_ar' => "زاد لاند شركة توزيع رائدة\nالوكيل الرسمي لمنتجات عالمية\nوطنية في سوريا - حمص",
                'button_text' => 'Discover More',
                'button_text_ar' => 'اكتشف المزيد',
                'link' => '/products',
                'badge' => 'Certified Wholesale',
                'badge_ar' => 'توزيع جملة معتمد',
                'is_active' => true,
            ],
        );
    }
}

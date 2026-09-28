<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandLogoSeeder extends Seeder
{
    /**
     * Assign the checked-in logo assets to matching catalog brands.
     * Existing non-catalog/custom image URLs are preserved.
     */
    public function run(): void
    {
        $logos = [
            'علي كافيه' => 'alicafe.webp',
            'اميركان جاردن' => 'american-garden.webp',
            'امريكانا' => 'americana-restaurants.webp',
            'اميركانا' => 'americana-restaurants.webp',
            'بوم بوم' => 'boom-boom.webp',
            'كابتن فيشر' => 'captain-fisher.webp',
            'ديشكو باستا' => 'de-cecco.webp',
            'غو اون' => 'go-on.webp',
            'غرومت' => 'gourmet.webp',
            'هايجين' => 'higeen.webp',
            'ميلاف' => 'milaf.webp',
            'ماستر براوني' => 'mr-brownie.webp',
            'نبيل' => 'nabil.webp',
            'اوتيما' => 'ottima.webp',
            'بيبسي' => 'pepsi.webp',
            'ريو ماري الايطالي' => 'rio.webp',
            'سانتي' => 'sante.webp',
            'تات' => 'tat.webp',
            'اولداغ' => 'uludag.webp',
        ];

        $matched = 0;
        $preserved = 0;
        $missingFiles = [];

        foreach (Brand::query()->whereIn('name', array_keys($logos))->get() as $brand) {
            $file = $logos[$brand->name];
            $path = '/brand-logos/'.$file;

            if (! is_file(public_path($path))) {
                $missingFiles[] = $file;
                continue;
            }

            if ($brand->image && $brand->image !== $path) {
                $preserved++;
                continue;
            }

            if ($brand->image !== $path) {
                $brand->image = $path;
                $brand->save();
            }

            $matched++;
        }

        $this->command?->info("Brand logos assigned: {$matched}; custom logos preserved: {$preserved}.");

        if ($missingFiles !== []) {
            $this->command?->warn('Logo files not found: '.implode(', ', array_unique($missingFiles)));
        }
    }
}

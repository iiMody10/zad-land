<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\MainCategory;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class ProductCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/data/workbook-products.json');
        $products = json_decode(file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
        $mainCategories = [];
        $brands = [];
        $categories = [];
        $brandImages = [
            'علي كافيه' => '/brand-logos/alicafe.webp',
            'اميركان جاردن' => '/brand-logos/american-garden.webp',
            'امريكانا' => '/brand-logos/americana-restaurants.webp',
            'اميركانا' => '/brand-logos/americana-restaurants.webp',
            'بوم بوم' => '/brand-logos/boom-boom.webp',
            'كابتن فيشر' => '/brand-logos/captain-fisher.webp',
            'ديشكو باستا' => '/brand-logos/de-cecco.webp',
            'غو اون' => '/brand-logos/go-on.webp',
            'غرومت' => '/brand-logos/gourmet.webp',
            'هايجين' => '/brand-logos/higeen.webp',
            'ميلاف' => '/brand-logos/milaf.webp',
            'ماستر براوني' => '/brand-logos/mr-brownie.webp',
            'نبيل' => '/brand-logos/nabil.webp',
            'اوتيما' => '/brand-logos/ottima.webp',
            'بيبسي' => '/brand-logos/pepsi.webp',
            'ريو ماري الايطالي' => '/brand-logos/rio.webp',
            'سانتي' => '/brand-logos/sante.webp',
            'تات' => '/brand-logos/tat.webp',
            'اولداغ' => '/brand-logos/uludag.webp',
        ];

        foreach ($products as $row) {
            $mainName = trim($row['mainCategory']);
            $mainSlug = $this->slug('department', $mainName);
            $mainKey = mb_strtolower($mainName);
            $mainCategories[$mainKey] ??= MainCategory::firstOrCreate(
                ['slug' => $mainSlug],
                [
                    'name' => $mainName,
                    'image' => $this->mainCategoryImage($mainName),
                    'show_in_nav' => true,
                    'is_active' => true,
                ],
            );

            $brandName = trim($row['brand']);
            if ($brandName === 'اميركانا') {
                $brandName = 'امريكانا';
            }
            $brandKey = mb_strtolower($brandName);
            $brands[$brandKey] ??= Brand::firstOrCreate(
                ['name' => $brandName],
                [
                    'slug' => $this->slug('brand', $brandName),
                    'group' => 'MAIN',
                    'is_active' => true,
                ],
            );
            $brandImage = $brandImages[$brandName] ?? null;
            if ($brandImage && ! $brands[$brandKey]->image) {
                $brands[$brandKey]->image = $brandImage;
                $brands[$brandKey]->save();
            }

            $categoryName = trim($row['category']);
            $categoryKey = $brandKey.'|'.mb_strtolower($categoryName);
            $categories[$categoryKey] ??= Category::firstOrCreate(
                ['brand_id' => $brands[$brandKey]->id, 'name' => $categoryName],
                [
                    'slug' => $this->slug('category', $brandName.'-'.$categoryName),
                    'main_category_id' => $mainCategories[$mainKey]->id,
                ],
            );

            $productSlug = $this->slug('product', $row['nameEn'] ?: $row['nameAr'], $row['nameAr']);
            Product::firstOrCreate(
                ['slug' => $productSlug],
                [
                    'name' => $row['nameAr'],
                    'name_ar' => $row['nameAr'],
                    'name_en' => $row['nameEn'],
                    'description' => $row['descriptionAr'],
                    'description_ar' => $row['descriptionAr'],
                    'description_en' => $row['descriptionEn'],
                    'images' => json_encode(Arr::whereNotNull([$row['image']]), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                    'price' => $row['price'],
                    'stock' => $row['stock'],
                    'min_order' => 1,
                    'packaging' => 'طرد',
                    'category_id' => $categories[$categoryKey]->id,
                    'brand_id' => $brands[$brandKey]->id,
                    'main_category_id' => $mainCategories[$mainKey]->id,
                ],
            );
        }

        $this->command?->info(sprintf(
            'Catalog ready: %d products, %d categories, %d brands, %d departments.',
            Product::count(), Category::count(), Brand::count(), MainCategory::count(),
        ));
    }

    private function slug(string $prefix, string $value, ?string $stableKey = null): string
    {
        $base = Str::slug($value);
        $suffix = substr(hash('sha256', mb_strtolower($stableKey ?? $value)), 0, 12);

        return ($base !== '' ? $base : $prefix).'-'.$suffix;
    }

    private function mainCategoryImage(string $name): ?string
    {
        return match ($name) {
            'غذائيات' => '/images/categories/canned-goods.webp',
            'مشروبات' => '/images/categories/beverages-coffee.webp',
            'منظفات' => '/images/categories/cleaning-supplies.webp',
            'نقرشات' => '/images/categories/snacks-nuts.webp',
            // Frozen foods intentionally use an actual product image until an
            // appropriate cover is uploaded from the main-category editor.
            default => null,
        };
    }
}

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

        foreach ($products as $row) {
            $mainName = trim($row['mainCategory']);
            $mainSlug = $this->slug('department', $mainName);
            $mainKey = mb_strtolower($mainName);
            $mainCategories[$mainKey] ??= MainCategory::firstOrCreate(
                ['slug' => $mainSlug],
                ['name' => $mainName, 'show_in_nav' => true, 'is_active' => true],
            );

            $brandName = trim($row['brand']);
            $brandKey = mb_strtolower($brandName);
            $brands[$brandKey] ??= Brand::firstOrCreate(
                ['name' => $brandName],
                [
                    'slug' => $this->slug('brand', $brandName),
                    'group' => 'MAIN',
                    'is_active' => true,
                ],
            );

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
}

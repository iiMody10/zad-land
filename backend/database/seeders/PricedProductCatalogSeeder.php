<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\MainCategory;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class PricedProductCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/data/priced-workbook-products.json');
        $products = json_decode(file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
        $counts = ['created' => 0, 'updated' => 0];

        DB::transaction(function () use ($products, &$counts): void {
            foreach ($products as $row) {
                $barcode = trim((string) $row['barcode']);
                $mainName = trim((string) $row['mainCategory']);
                $brandName = trim((string) ($row['brand'] ?: 'عام'));
                $categoryName = trim((string) $row['category']);
                $nameAr = trim((string) $row['nameAr']);
                $nameEn = trim((string) $row['nameEn']);

                $main = MainCategory::firstOrCreate(
                    ['slug' => $this->slug('department', $mainName)],
                    ['name' => $mainName, 'show_in_nav' => true, 'is_active' => true],
                );
                $brand = Brand::firstOrCreate(
                    ['name' => $brandName],
                    ['slug' => $this->slug('brand', $brandName), 'group' => 'MAIN', 'is_active' => true],
                );
                $category = Category::firstOrCreate(
                    ['brand_id' => $brand->id, 'name' => $categoryName],
                    [
                        'slug' => $this->slug('category', $brandName.'-'.$categoryName),
                        'main_category_id' => $main->id,
                    ],
                );

                $byBarcode = Product::where('sku', $barcode)->get();
                if ($byBarcode->count() > 1) {
                    throw new RuntimeException("Barcode {$barcode} is already assigned to multiple products.");
                }

                $product = $byBarcode->first() ?? $this->findExistingProduct($brand->id, $barcode, $nameAr, $nameEn);
                $isNew = $product === null;
                $product ??= new Product([
                    'slug' => $this->slug('product', $nameEn ?: $nameAr, $barcode),
                    'min_order' => 1,
                    'packaging' => 'طرد',
                ]);

                $product->fill([
                    'name' => $nameAr,
                    'name_ar' => $nameAr,
                    'name_en' => $nameEn,
                    'description' => $row['descriptionAr'],
                    'description_ar' => $row['descriptionAr'],
                    'description_en' => $row['descriptionEn'],
                    'images' => json_encode([$row['image']], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                    'price' => $row['price'],
                    'stock' => (int) $row['stock'],
                    'sku' => $barcode,
                    'category_id' => $category->id,
                    'brand_id' => $brand->id,
                    'main_category_id' => $main->id,
                ]);
                if (! empty($row['options'])) {
                    $product->options = $row['options'];
                }
                $product->save();

                $counts[$isNew ? 'created' : 'updated']++;
            }
        });

        $this->command?->info(sprintf(
            'Priced catalog imported: %d products created, %d updated.',
            $counts['created'],
            $counts['updated'],
        ));
    }

    private function findExistingProduct(string $brandId, string $barcode, string $nameAr, string $nameEn): ?Product
    {
        $matches = Product::query()
            ->where('brand_id', $brandId)
            ->where(fn ($query) => $query->whereNull('sku')->orWhere('sku', '')->orWhere('sku', $barcode))
            ->where(fn ($query) => $query->where('name_ar', $nameAr)->orWhere('name_en', $nameEn))
            ->get();

        $exactNames = $matches->filter(fn (Product $product) => $product->name_ar === $nameAr && $product->name_en === $nameEn);
        if ($exactNames->count() === 1) {
            return $exactNames->first();
        }

        $arabicMatches = $matches->filter(fn (Product $product) => $product->name_ar === $nameAr);
        if ($arabicMatches->count() === 1) {
            return $arabicMatches->first();
        }

        $englishMatches = $matches->filter(fn (Product $product) => $product->name_en === $nameEn);
        if ($englishMatches->count() === 1) {
            return $englishMatches->first();
        }

        if ($matches->count() === 1) {
            return $matches->first();
        }
        if ($matches->count() > 1) {
            throw new RuntimeException("Product names match multiple existing products; barcode {$barcode} needs review.");
        }

        return null;
    }

    private function slug(string $prefix, string $value, ?string $stableKey = null): string
    {
        $base = Str::slug($value);
        $suffix = substr(hash('sha256', mb_strtolower($stableKey ?? $value)), 0, 12);

        return ($base !== '' ? $base : $prefix).'-'.$suffix;
    }
}

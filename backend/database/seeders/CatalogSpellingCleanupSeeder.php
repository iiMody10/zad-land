<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use RuntimeException;

class CatalogSpellingCleanupSeeder extends Seeder
{
    /**
     * Catalog audit found this same brand entered with two spellings.
     * Keep the spelling used by the larger legacy product catalog.
     */
    private const BRAND_MERGES = [
        'اميركانا' => 'امريكانا',
    ];

    public function run(): void
    {
        $mergedBrands = 0;
        $mergedCategories = 0;

        DB::transaction(function () use (&$mergedBrands, &$mergedCategories): void {
            foreach (self::BRAND_MERGES as $duplicateName => $canonicalName) {
                $duplicate = Brand::query()->where('name', $duplicateName)->lockForUpdate()->first();
                if (! $duplicate) {
                    continue;
                }

                $canonical = Brand::query()->where('name', $canonicalName)->lockForUpdate()->first();
                if (! $canonical) {
                    throw new RuntimeException("Cannot merge {$duplicateName}: canonical brand {$canonicalName} was not found.");
                }

                $categoryIdMap = [];
                foreach (Category::query()->where('brand_id', $duplicate->id)->lockForUpdate()->get() as $category) {
                    $canonicalCategory = Category::query()
                        ->where('brand_id', $canonical->id)
                        ->where('name', $category->name)
                        ->lockForUpdate()
                        ->first();

                    if (! $canonicalCategory) {
                        $category->brand_id = $canonical->id;
                        $category->save();
                        continue;
                    }

                    Product::query()->where('category_id', $category->id)->update(['category_id' => $canonicalCategory->id]);
                    $this->replaceCategorySettingsReferences($category->id, $canonicalCategory->id);
                    $categoryIdMap[$category->id] = $canonicalCategory->id;

                    $canonicalCategory->description = $canonicalCategory->description ?: $category->description;
                    $canonicalCategory->image = $canonicalCategory->image ?: $category->image;
                    $canonicalCategory->is_featured = $canonicalCategory->is_featured || $category->is_featured;
                    $canonicalCategory->save();
                    $category->delete();
                    $mergedCategories++;
                }

                Product::query()->where('brand_id', $duplicate->id)->update(['brand_id' => $canonical->id]);
                $this->replaceHeaderNavigationReferences($duplicate->id, $canonical->id, $categoryIdMap);

                $canonical->description = $canonical->description ?: $duplicate->description;
                $canonical->image = $canonical->image ?: $duplicate->image;
                $canonical->main_category_id = $canonical->main_category_id ?: $duplicate->main_category_id;
                $canonical->is_active = $canonical->is_active || $duplicate->is_active;
                $canonical->is_featured = $canonical->is_featured || $duplicate->is_featured;
                $canonical->save();

                $duplicate->delete();
                $mergedBrands++;
            }
        });

        $this->command?->info("Catalog spelling cleanup complete: {$mergedBrands} duplicate brand(s) and {$mergedCategories} duplicate subcategory(ies) merged.");
        $this->command?->info('No duplicate main-category spellings were found in the catalog audit.');
    }

    private function replaceCategorySettingsReferences(string $oldId, string $newId): void
    {
        foreach (['footer_category1_id', 'footer_category2_id', 'footer_category3_id', 'footer_category4_id'] as $column) {
            if (Schema::hasColumn('settings', $column)) {
                DB::table('settings')->where($column, $oldId)->update([$column => $newId]);
            }
        }
    }

    /** @param array<string, string> $categoryIdMap */
    private function replaceHeaderNavigationReferences(string $oldBrandId, string $newBrandId, array $categoryIdMap): void
    {
        if (! Schema::hasColumn('settings', 'header_nav_items')) {
            return;
        }

        foreach (DB::table('settings')->select(['id', 'header_nav_items'])->get() as $settings) {
            if (! $settings->header_nav_items) {
                continue;
            }

            $items = json_decode($settings->header_nav_items, true);
            if (! is_array($items)) {
                continue;
            }

            $updated = [];
            $seen = [];
            foreach ($items as $item) {
                if (! is_array($item)) {
                    continue;
                }

                if (($item['type'] ?? null) === 'brand' && ($item['id'] ?? null) === $oldBrandId) {
                    $item['id'] = $newBrandId;
                } elseif (($item['type'] ?? null) === 'category' && isset($categoryIdMap[$item['id'] ?? ''])) {
                    $item['id'] = $categoryIdMap[$item['id']];
                }

                $key = ($item['type'] ?? '').':'.($item['id'] ?? '');
                if (isset($seen[$key])) {
                    continue;
                }

                $seen[$key] = true;
                $updated[] = $item;
            }

            DB::table('settings')->where('id', $settings->id)->update([
                'header_nav_items' => json_encode($updated, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ]);
        }
    }
}

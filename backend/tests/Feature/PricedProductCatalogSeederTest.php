<?php

namespace Tests\Feature;

use App\Models\Product;
use Database\Seeders\PricedProductCatalogSeeder;
use Database\Seeders\ProductCatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PricedProductCatalogSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_priced_workbook_links_products_to_barcode_images_and_is_safe_to_rerun(): void
    {
        $this->seed(ProductCatalogSeeder::class);
        $existing = Product::where('name_ar', 'حليب ندى شوكولا 200 مل')->firstOrFail();
        $seeder = new PricedProductCatalogSeeder();

        $seeder->run();

        $imported = Product::where('sku', '1')->firstOrFail();
        $this->assertSame($existing->id, $imported->id);
        $this->assertSame(
            ['/uploads/products/catalog-batch/1.webp'],
            json_decode($imported->getRawOriginal('images'), true, flags: JSON_THROW_ON_ERROR),
        );
        $this->assertSame('0.35', (string) $imported->price);
        $this->assertSame(1, Product::where('sku', '1')->count());
        $countAfterFirstImport = Product::count();

        $seeder->run();

        $this->assertSame($countAfterFirstImport, Product::count());
        $this->assertSame(1, Product::where('sku', '1')->count());
    }
}

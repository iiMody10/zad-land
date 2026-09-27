<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\PromoCode;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    private function product(int $stock = 8, int $minOrder = 2): Product
    {
        $brand = Brand::create(['name' => 'Test Brand', 'slug' => 'test-brand', 'group' => 'MAIN', 'is_active' => true]);
        $category = Category::create(['name' => 'Test Category', 'slug' => 'test-category', 'brand_id' => $brand->id]);

        return Product::create(['name' => 'Test product', 'slug' => 'test-product', 'images' => '[]', 'price' => '10.25', 'discount_price' => '9.50', 'stock' => $stock, 'min_order' => $minOrder, 'category_id' => $category->id, 'brand_id' => $brand->id]);
    }

    public function test_catalog_keeps_current_price_visibility(): void
    {
        $this->product();

        $this->getJson('/api/products')
            ->assertOk()
            ->assertJsonPath('products.0.price', '10.25')
            ->assertJsonPath('products.0.discountPrice', '9.50');
    }

    public function test_catalog_sitemap_returns_camel_case_update_dates(): void
    {
        $this->product();

        $this->getJson('/api/sitemap')->assertOk()
            ->assertJsonPath('products.0.slug', 'test-product')
            ->assertJsonStructure(['products' => [['slug', 'updatedAt']]]);
    }

    public function test_order_uses_database_price_reserves_stock_and_replays_idempotently(): void
    {
        $product = $this->product(stock: 3);
        $body = [
            'shopName' => 'Store One', 'ownerName' => 'Owner One', 'phone' => '0912345678',
            'city' => 'حمص', 'streetAddress' => 'Main street 12', 'notes' => '',
            'idempotencyKey' => 'test-order-key-00001',
            'items' => [['productId' => $product->id, 'quantity' => 3, 'price' => '0.01', 'total' => 0.03]],
        ];

        $created = $this->postJson('/api/orders', $body)->assertCreated()
            ->assertJsonPath('totalAmount', '28.50')
            ->assertJsonPath('items.0.price', '9.50');
        $orderId = $created->json('id');
        $this->assertSame(0, $product->fresh()->stock);

        $this->postJson('/api/orders', $body)->assertOk()->assertJsonPath('id', $orderId);
        $this->assertSame(0, $product->fresh()->stock);
        $this->assertDatabaseCount('orders', 1);

        $body['items'][0]['quantity'] = 4;
        $this->postJson('/api/orders', $body)->assertConflict();
        $this->assertSame(0, $product->fresh()->stock);
    }

    public function test_order_rejects_below_minimum_and_does_not_reserve_stock(): void
    {
        $product = $this->product();
        $this->postJson('/api/orders', [
            'shopName' => 'Store One', 'ownerName' => 'Owner One', 'phone' => '963912345678',
            'city' => 'Homs', 'streetAddress' => 'Main street 12', 'idempotencyKey' => 'test-order-key-00002',
            'items' => [['productId' => $product->id, 'quantity' => 1]],
        ])->assertUnprocessable();

        $this->assertSame(8, $product->fresh()->stock);
        $this->assertDatabaseCount('orders', 0);
    }

    public function test_guest_order_token_and_cookie_preserve_confirmation_page_access(): void
    {
        $product = $this->product();
        $created = $this->postJson('/api/orders', [
            'shopName' => 'Guest Store', 'ownerName' => 'Guest Owner', 'phone' => '0912345678',
            'city' => 'حمص', 'streetAddress' => 'Main street 12', 'idempotencyKey' => 'guest-order-key-0001',
            'items' => [['productId' => $product->id, 'quantity' => 2]],
        ])->assertCreated()->assertJsonStructure(['id', 'orderToken', 'whatsappNumber', 'items']);

        $orderId = $created->json('id');
        $token = $created->json('orderToken');
        $created->assertCookie('zad_order_'.$orderId);

        $this->getJson('/api/orders/'.$orderId.'?token='.urlencode($token))
            ->assertOk()->assertJsonPath('id', $orderId)->assertJsonPath('items.0.product.id', $product->id);
    }

    public function test_promotion_discount_is_calculated_from_database_prices(): void
    {
        $product = $this->product();
        $promo = PromoCode::create(['code' => 'TENOFF', 'discount_percentage' => 10, 'is_active' => true]);

        $this->postJson('/api/orders', [
            'shopName' => 'Store One', 'ownerName' => 'Owner One', 'phone' => '0912345678', 'city' => 'حمص',
            'streetAddress' => 'Main street 12', 'idempotencyKey' => 'test-order-key-00003', 'promoCodeId' => $promo->id,
            'items' => [['productId' => $product->id, 'quantity' => 2, 'price' => '0.01']],
        ])->assertCreated()->assertJsonPath('totalAmount', '17.10')->assertJsonPath('discount', '1.90');

        $this->assertSame(1, $promo->fresh()->usage_count);
        $this->assertSame('17.10', $promo->fresh()->total_sales);
    }

    public function test_merchant_routes_require_an_approved_merchant_session(): void
    {
        $this->getJson('/api/customer/wishlist?idsOnly=true')->assertUnauthorized();
        $merchant = Customer::create(['shop_name' => 'Approved shop', 'owner_name' => 'Owner', 'phone' => '96312345678', 'city' => 'حمص', 'address' => 'Main street', 'password' => Hash::make('secret123'), 'is_active' => true]);

        $this->actingAs($merchant, 'merchant')->getJson('/api/customer/wishlist?idsOnly=true')
            ->assertOk()->assertJsonPath('wishlistIds', []);
    }

    public function test_admin_resource_routes_enforce_existing_permissions(): void
    {
        $admin = User::create(['username' => 'limited-admin', 'password' => Hash::make('secret123'), 'role' => 'ADMIN', 'can_manage_products' => false]);

        $this->actingAs($admin, 'web')->getJson('/api/admin/products')->assertForbidden();
        $admin->update(['role' => 'SUPER_ADMIN']);
        $this->actingAs($admin->fresh(), 'web')->getJson('/api/admin/products')->assertOk();
    }

    public function test_super_admin_can_create_products_with_server_generated_slug(): void
    {
        $admin = User::create(['username' => 'super-admin', 'password' => Hash::make('secret123'), 'role' => 'SUPER_ADMIN']);
        $brand = Brand::create(['name' => 'New Brand', 'slug' => 'new-brand', 'group' => 'MAIN', 'is_active' => true]);
        $category = Category::create(['name' => 'New Category', 'slug' => 'new-category', 'brand_id' => $brand->id]);

        $this->actingAs($admin, 'web')->postJson('/api/admin/products', [
            'name' => 'New Product', 'images' => '[]', 'price' => '12.50', 'stock' => 4, 'minOrder' => 2,
            'brandId' => $brand->id, 'categoryId' => $category->id,
        ])->assertCreated()->assertJsonPath('slug', 'new-product')->assertJsonPath('price', '12.50');
    }

    public function test_super_admin_can_import_workbook_product_rows_into_mysql(): void
    {
        $admin = User::create(['username' => 'catalog-admin', 'password' => Hash::make('secret123'), 'role' => 'SUPER_ADMIN']);
        $row = [
            'mainCategory' => 'مشروبات', 'category' => 'عصائر', 'brand' => 'ندى',
            'nameAr' => 'عصير اختبار 200 مل', 'nameEn' => 'Test Juice 200ml',
            'price' => '0.35', 'stock' => 18, 'image' => 'https://example.test/juice.webp',
        ];

        $this->actingAs($admin, 'web')->postJson('/api/admin/products/import', $row)
            ->assertCreated()->assertJsonPath('success', true)->assertJsonPath('created', true);
        $this->postJson('/api/admin/products/import', $row)
            ->assertOk()->assertJsonPath('created', false);

        $this->assertDatabaseCount('products', 1);
        $this->getJson('/api/products')->assertOk()->assertJsonPath('products.0.images', 'https://example.test/juice.webp');
    }

    public function test_uploads_use_the_permission_for_the_target_admin_section(): void
    {
        $admin = User::create(['username' => 'product-admin', 'password' => Hash::make('secret123'), 'role' => 'ADMIN', 'can_manage_products' => true, 'can_manage_banners' => false]);

        $this->actingAs($admin, 'web')->postJson('/api/upload', ['folder' => 'banners'])->assertForbidden();
    }

    public function test_merchant_registration_stores_canonical_phone_and_waits_for_approval(): void
    {
        $this->postJson('/api/customer/auth/register', [
            'shopName' => 'Shop One', 'ownerName' => 'Owner Name', 'phone' => '0912345678',
            'city' => 'حمص', 'address' => 'Main street 12', 'password' => 'secret123',
        ])->assertCreated()->assertJsonPath('pendingApproval', true);

        $this->assertDatabaseHas('customers', ['phone' => '96312345678', 'is_active' => false]);
    }

    public function test_merchant_login_uses_sanctum_session_authentication(): void
    {
        Customer::create(['shop_name' => 'Approved shop', 'owner_name' => 'Owner', 'phone' => '96312345678', 'city' => 'حمص', 'address' => 'Main street', 'password' => Hash::make('secret123'), 'is_active' => true]);

        $this->withHeaders(['Origin' => 'http://localhost:3000', 'Referer' => 'http://localhost:3000/'])
            ->postJson('/api/customer/auth/login', ['phone' => '0912345678', 'password' => 'secret123'])
            ->assertOk()->assertJsonPath('customer.phone', '96312345678');

        $this->getJson('/api/customer/auth/me')->assertOk()->assertJsonPath('customer.shopName', 'Approved shop');
        $this->getJson('/api/customer/wishlist?idsOnly=true')->assertOk()->assertJsonPath('wishlistIds', []);
    }
}

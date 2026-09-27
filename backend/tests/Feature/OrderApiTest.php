<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Order;
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
            ->assertOk()->assertJsonPath('id', $orderId)->assertJsonPath('items.0.product.id', $product->id)
            ->assertJsonPath('phone', '963912345678');
    }

    public function test_merchant_can_claim_guest_order_using_receipt_reference_when_phone_matches(): void
    {
        $product = $this->product();
        $merchant = Customer::create([
            'shop_name' => 'Approved shop', 'owner_name' => 'Owner', 'phone' => '963912345678', 'city' => 'حمص',
            'address' => 'Main street', 'password' => Hash::make('secret123'), 'is_active' => true,
        ]);
        $created = $this->postJson('/api/orders', [
            'shopName' => 'Approved shop', 'ownerName' => 'Owner', 'phone' => '0912345678',
            'city' => 'حمص', 'streetAddress' => 'Main street 12', 'idempotencyKey' => 'claim-guest-order-0001',
            'items' => [['productId' => $product->id, 'quantity' => 2]],
        ])->assertCreated();
        $orderId = $created->json('id');

        $this->actingAs($merchant, 'merchant')->postJson('/api/customer/orders/claim', [
            'orderId' => strtoupper(substr($orderId, -8)),
        ])->assertOk()->assertJsonPath('success', true);

        $this->getJson('/api/customer/orders')->assertOk()->assertJsonPath('orders.0.id', $orderId);
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

    public function test_admin_can_save_separate_desktop_and_mobile_banner_images(): void
    {
        $admin = User::create(['username' => 'banner-admin', 'password' => Hash::make('secret123'), 'role' => 'SUPER_ADMIN']);

        $created = $this->actingAs($admin, 'web')->postJson('/api/admin/banners', [
            'title' => 'Desktop banner', 'titleAr' => 'بنر للشاشات الكبيرة',
            'image' => '/uploads/banners/desktop.webp', 'imageMobile' => '/uploads/banners/mobile.webp',
        ])->assertCreated()
            ->assertJsonPath('image', '/uploads/banners/desktop.webp')
            ->assertJsonPath('imageMobile', '/uploads/banners/mobile.webp');

        $id = $created->json('id');
        $this->patchJson('/api/admin/banners/'.$id, ['imageMobile' => null])
            ->assertOk()->assertJsonPath('imageMobile', null);
    }

    public function test_admin_can_patch_product_flags_without_resending_relationship_ids(): void
    {
        $admin = User::create(['username' => 'catalog-patch-admin', 'password' => Hash::make('secret123'), 'role' => 'SUPER_ADMIN']);
        $product = $this->product();

        $this->actingAs($admin, 'web')->patchJson('/api/admin/products/'.$product->id, ['isTrending' => true])
            ->assertOk()->assertJsonPath('isTrending', true);

        $this->assertTrue($product->fresh()->is_trending);
    }

    public function test_category_names_are_unique_per_brand_and_in_use_categories_cannot_be_deleted(): void
    {
        $admin = User::create(['username' => 'category-admin', 'password' => Hash::make('secret123'), 'role' => 'SUPER_ADMIN']);
        $firstBrand = Brand::create(['name' => 'Brand One', 'slug' => 'brand-one', 'group' => 'MAIN', 'is_active' => true]);
        $secondBrand = Brand::create(['name' => 'Brand Two', 'slug' => 'brand-two', 'group' => 'MAIN', 'is_active' => true]);
        $category = Category::create(['name' => 'Beverages', 'slug' => 'brand-one-beverages', 'brand_id' => $firstBrand->id]);

        $this->actingAs($admin, 'web')->postJson('/api/admin/categories', [
            'name' => 'Beverages', 'brandId' => $secondBrand->id,
        ])->assertCreated();

        $this->postJson('/api/admin/categories', [
            'name' => 'Beverages', 'brandId' => $firstBrand->id,
        ])->assertUnprocessable();

        $product = Product::create([
            'name' => 'Category linked product', 'slug' => 'category-linked-product', 'images' => '[]',
            'price' => '2.00', 'stock' => 5, 'min_order' => 1, 'category_id' => $category->id, 'brand_id' => $firstBrand->id,
        ]);
        $this->deleteJson('/api/admin/categories/'.$category->id)->assertConflict();
        $this->assertDatabaseHas('products', ['id' => $product->id, 'category_id' => $category->id]);
    }

    public function test_admin_orders_endpoint_reports_pagination_and_returns_requested_page(): void
    {
        $admin = User::create(['username' => 'orders-page-admin', 'password' => Hash::make('secret123'), 'role' => 'SUPER_ADMIN']);
        foreach (range(1, 3) as $number) {
            Order::create([
                'shop_name' => 'Shop '.$number, 'total_amount' => '10.00', 'status' => 'PENDING',
                'city' => 'Homs', 'street_address' => 'Street '.$number, 'Name' => 'Owner '.$number, 'phone' => '09'.$number,
            ]);
        }

        $this->actingAs($admin, 'web')->getJson('/api/admin/orders?page=2&limit=2')
            ->assertOk()->assertJsonPath('pagination.total', 3)->assertJsonPath('pagination.pages', 2)
            ->assertJsonCount(1, 'orders');
    }

    public function test_admin_customers_endpoint_returns_order_counts_and_approval_updates_status(): void
    {
        $admin = User::create(['username' => 'merchant-list-admin', 'password' => Hash::make('secret123'), 'role' => 'SUPER_ADMIN']);
        $merchant = Customer::create([
            'shop_name' => 'Test shop', 'owner_name' => 'Shop owner', 'phone' => '963900000001', 'city' => 'Homs',
            'address' => 'Market road', 'password' => Hash::make('secret123'), 'is_active' => false,
        ]);
        Order::create([
            'customer_id' => $merchant->id, 'shop_name' => 'Test shop', 'total_amount' => '10.00', 'status' => 'PENDING',
            'city' => 'Homs', 'street_address' => 'Market road', 'Name' => 'Shop owner', 'phone' => $merchant->phone,
        ]);

        $this->actingAs($admin, 'web')->getJson('/api/admin/customers')
            ->assertOk()->assertJsonPath('0.shopName', 'Test shop')->assertJsonPath('0._count.orders', 1)
            ->assertJsonPath('0.isActive', false);

        $this->patchJson('/api/admin/customers', ['id' => $merchant->id, 'isActive' => true])
            ->assertOk()->assertJsonPath('customer.isActive', true);
        $this->assertTrue($merchant->fresh()->is_active);
    }

    public function test_super_admin_can_create_edit_reset_and_delete_merchant_accounts(): void
    {
        $admin = User::create(['username' => 'merchant-manage-admin', 'password' => Hash::make('secret123'), 'role' => 'SUPER_ADMIN']);
        $this->actingAs($admin, 'web');

        $created = $this->postJson('/api/admin/customers', [
            'shopName' => 'Managed Shop', 'ownerName' => 'Shop Owner', 'phone' => '0912345678',
            'city' => 'حمص', 'address' => 'Market road 12', 'notes' => null,
            'password' => 'merchant123', 'isActive' => true,
        ])->assertCreated()->assertJsonPath('shopName', 'Managed Shop')->assertJsonPath('phone', '963912345678');
        $merchantId = $created->json('id');
        $merchant = Customer::findOrFail($merchantId);
        $this->assertTrue(Hash::check('merchant123', $merchant->password));

        $this->patchJson('/api/admin/customers/'.$merchantId, [
            'shopName' => 'Updated Shop', 'ownerName' => 'New Owner', 'phone' => '96312345678',
            'city' => 'حلب', 'address' => 'New address 4', 'notes' => 'Verified by admin',
            'password' => 'resetpass123', 'isActive' => false,
        ])->assertOk()->assertJsonPath('shopName', 'Updated Shop')->assertJsonPath('isActive', false);
        $this->assertTrue(Hash::check('resetpass123', $merchant->fresh()->password));

        $order = Order::create([
            'customer_id' => $merchantId, 'shop_name' => 'Updated Shop', 'total_amount' => '10.00',
            'status' => 'PENDING', 'city' => 'حلب', 'street_address' => 'New address 4',
            'Name' => 'New Owner', 'phone' => '96312345678',
        ]);

        $this->deleteJson('/api/admin/customers/'.$merchantId)->assertOk()->assertJsonPath('success', true);
        $this->assertDatabaseMissing('customers', ['id' => $merchantId]);
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'customer_id' => null]);
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

        $this->assertDatabaseHas('customers', ['phone' => '963912345678', 'is_active' => false]);
    }

    public function test_merchant_login_uses_sanctum_session_authentication(): void
    {
        Customer::create(['shop_name' => 'Approved shop', 'owner_name' => 'Owner', 'phone' => '963912345678', 'city' => 'حمص', 'address' => 'Main street', 'password' => Hash::make('secret123'), 'is_active' => true]);

        $this->withHeaders(['Origin' => 'http://localhost:3000', 'Referer' => 'http://localhost:3000/'])
            ->postJson('/api/customer/auth/login', ['phone' => '0912345678', 'password' => 'secret123'])
            ->assertOk()->assertJsonPath('customer.phone', '963912345678');

        $this->getJson('/api/customer/auth/me')->assertOk()->assertJsonPath('customer.shopName', 'Approved shop');
        $this->getJson('/api/customer/wishlist?idsOnly=true')->assertOk()->assertJsonPath('wishlistIds', []);
    }

    public function test_merchant_login_repairs_legacy_phone_values(): void
    {
        Customer::create(['shop_name' => 'Legacy shop', 'owner_name' => 'Owner', 'phone' => '96312345678', 'city' => 'حمص', 'address' => 'Main street', 'password' => Hash::make('secret123'), 'is_active' => true]);

        $this->withHeaders(['Origin' => 'http://localhost:3000', 'Referer' => 'http://localhost:3000/'])
            ->postJson('/api/customer/auth/login', ['phone' => '0912345678', 'password' => 'secret123'])
            ->assertOk()->assertJsonPath('customer.phone', '963912345678');
        $this->assertDatabaseHas('customers', ['phone' => '963912345678']);
    }
}

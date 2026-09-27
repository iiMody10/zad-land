<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\WishlistController;
use App\Models\Settings;
use App\Support\ApiJson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', fn (Request $request) => $request->user())->middleware('auth:sanctum');

Route::get('/products', [CatalogController::class, 'products']);
Route::get('/products/trending', [CatalogController::class, 'trending']);
Route::get('/products/{slug}', [CatalogController::class, 'product']);
Route::get('/categories', [CatalogController::class, 'categories']);
Route::get('/main-categories', [CatalogController::class, 'mainCategories']);
Route::get('/brands', [CatalogController::class, 'brands']);
Route::get('/navigation', [CatalogController::class, 'navigation']);
Route::get('/home', [CatalogController::class, 'home']);
Route::get('/sitemap', [CatalogController::class, 'sitemap']);
Route::get('/settings', fn () => response()->json(ApiJson::camel(Settings::firstOrCreate(['id' => 'site-settings']))));
Route::post('/promotions/validate', [AdminController::class, 'validatePromo'])->middleware('throttle:30,1');
Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:20,1');
Route::get('/orders/{id}', [OrderController::class, 'show']);

Route::prefix('customer/auth')->group(function () {
    Route::post('/register', [AuthController::class, 'merchantRegister'])->middleware('throttle:10,1');
    Route::post('/login', [AuthController::class, 'merchantLogin'])->middleware('throttle:20,1');
    Route::post('/logout', [AuthController::class, 'merchantLogout']);
    Route::get('/me', [AuthController::class, 'merchantMe']);
    Route::patch('/me', [AuthController::class, 'merchantMe'])->middleware(['auth:sanctum', 'merchant']);
});
Route::prefix('customer')->middleware(['auth:sanctum', 'merchant'])->group(function () {
    Route::get('/orders', [OrderController::class, 'history']);
    Route::post('/orders/claim', [OrderController::class, 'claim']);
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist', [WishlistController::class, 'destroy']);
});

Route::prefix('admin')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'adminLogin'])->middleware('throttle:20,1');
    Route::post('/auth/logout', [AuthController::class, 'adminLogout']);
    Route::get('/auth/me', [AuthController::class, 'adminMe'])->middleware(['auth:sanctum', 'admin']);
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/customers', [AdminController::class, 'index'])->defaults('resource', 'customers')->middleware('permission:customers');
        Route::post('/customers', [AdminController::class, 'storeCustomer'])->middleware('permission:customers');
        Route::patch('/customers', [AdminController::class, 'approveCustomer'])->middleware('permission:customers');
        Route::patch('/customers/{id}', [AdminController::class, 'updateCustomer'])->middleware('permission:customers');
        Route::delete('/customers/{id}', [AdminController::class, 'deleteCustomer'])->middleware('permission:customers');
        Route::get('/reviews', [AdminController::class, 'index'])->defaults('resource', 'reviews')->middleware('permission:manage_reviews');
        Route::patch('/reviews/{id}', [AdminController::class, 'updateReview'])->middleware('permission:manage_reviews');
        Route::delete('/reviews/{id}', [AdminController::class, 'deleteReview'])->middleware('permission:manage_reviews');
        Route::get('/dashboard', [AdminController::class, 'index'])->defaults('resource', 'dashboard');
        Route::get('/users', [AdminController::class, 'index'])->defaults('resource', 'users')->middleware('permission:users');
        Route::post('/users', [AdminController::class, 'usersStore'])->middleware('permission:users');
        Route::patch('/users/{id}', [AdminController::class, 'usersUpdate'])->middleware('permission:users');
        Route::delete('/users/{id}', [AdminController::class, 'usersDelete'])->middleware('permission:users');
        Route::get('/credentials', [AdminController::class, 'credentials'])->middleware('permission:settings');
        Route::patch('/credentials', [AdminController::class, 'credentials'])->middleware('permission:settings');
        Route::get('/settings', [AdminController::class, 'index'])->defaults('resource', 'settings')->middleware('permission:settings');
        Route::put('/settings', [AdminController::class, 'saveSettings'])->middleware('permission:settings');
        Route::post('/bulk', [AdminController::class, 'bulk']);
        Route::get('/orders', [AdminController::class, 'index'])->defaults('resource', 'orders')->middleware('permission:manage_orders');
        Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus'])->middleware('permission:manage_orders');
        Route::delete('/orders/{id}', [OrderController::class, 'destroy'])->middleware('permission:delete_orders');
        foreach (['brands' => 'manage_brands', 'main-categories' => 'settings', 'categories' => 'manage_categories', 'products' => 'manage_products', 'banners' => 'manage_banners', 'promo-codes' => 'manage_promo_codes'] as $resource => $permission) {
            Route::get('/'.$resource, [AdminController::class, 'index'])->defaults('resource', $resource)->middleware('permission:'.$permission);
            Route::post('/'.$resource, [AdminController::class, 'store'])->defaults('resource', $resource)->middleware('permission:'.$permission);
            if ($resource === 'products') {
                Route::post('/products/import', [AdminController::class, 'importProduct'])->middleware('permission:manage_products');
            }
            Route::patch('/'.$resource.'/{id}', [AdminController::class, 'update'])->defaults('resource', $resource)->middleware('permission:'.$permission);
            $deletePermission = $permission === 'settings' ? 'settings' : 'delete_'.str_replace('manage_', '', $permission);
            Route::delete('/'.$resource.'/{id}', [AdminController::class, 'destroy'])->defaults('resource', $resource)->middleware('permission:'.$deletePermission);
        }
    });
});
Route::post('/upload', [UploadController::class, 'store'])->middleware(['auth:sanctum', 'admin']);

Route::get('/reviews', fn () => response()->json(['error' => 'Product reviews are no longer available.'], 410));
Route::post('/reviews', fn () => response()->json(['error' => 'Product reviews are no longer available.'], 410));

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Customer;
use App\Models\MainCategory;
use App\Models\Order;
use App\Models\Product;
use App\Models\PromoCode;
use App\Models\Review;
use App\Models\Settings;
use App\Models\User;
use App\Support\ApiJson;
use App\Support\MerchantPhone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    private const RESOURCES = [
        'brands' => [Brand::class, 'brands', ['name', 'slug', 'description', 'image', 'group', 'is_active', 'is_featured', 'main_category_id']],
        'main-categories' => [MainCategory::class, 'main_categories', ['name', 'slug', 'description', 'image', 'is_active', 'show_in_nav', 'nav_order', 'is_featured']],
        'categories' => [Category::class, 'categories', ['name', 'slug', 'description', 'image', 'brand_id', 'main_category_id', 'is_featured']],
        'products' => [Product::class, 'products', ['name', 'name_ar', 'name_en', 'slug', 'images', 'is_trending', 'description', 'description_ar', 'description_en', 'price', 'discount_price', 'discount_type', 'discount_value', 'stock', 'min_order', 'packaging', 'items_per_package', 'options', 'category_id', 'sku', 'brand_id', 'main_category_id']],
        'banners' => [Banner::class, 'banners', ['title', 'subtitle', 'title_ar', 'subtitle_ar', 'image', 'image_mobile', 'button_text', 'button_text_ar', 'link', 'badge', 'badge_ar', 'is_active']],
        'promo-codes' => [PromoCode::class, 'promo_codes', ['code', 'discount_percentage', 'delegate_name', 'is_active']],
    ];

    public function index(Request $request, string $resource)
    {
        if ($resource === 'orders') {
            $page = max(1, min((int) $request->query('page', 1), 10000));
            $limit = max(1, min((int) $request->query('limit', 50), 200));
            $query = Order::with('items.product')->orderByDesc('created_at');
            $total = (clone $query)->count();

            return response()->json(['orders' => ApiJson::camel($query->skip(($page - 1) * $limit)->take($limit)->get()), 'pagination' => ['total' => $total, 'pages' => (int) ceil($total / $limit), 'page' => $page, 'limit' => $limit]]);
        }
        if ($resource === 'customers') {
            $customers = Customer::withCount(['orders', 'wishlistProducts'])->orderByDesc('created_at')->get();

            return response()->json($customers->map(function (Customer $customer): array {
                $data = ApiJson::camel($customer);
                $data['_count'] = ['orders' => $customer->orders_count, 'wishlistItems' => $customer->wishlist_products_count];

                return $data;
            })->values());
        }
        if ($resource === 'users') {
            return response()->json(ApiJson::camel(User::orderByDesc('created_at')->get()));
        }
        if ($resource === 'reviews') {
            return response()->json(ApiJson::camel(Review::with('product:id,name')->orderByDesc('created_at')->get()));
        }
        if ($resource === 'settings') {
            return response()->json(ApiJson::camel(Settings::firstOrCreate(['id' => 'site-settings'])));
        }
        if ($resource === 'dashboard') {
            return $this->dashboard();
        }
        if ($resource === 'promo-codes') {
            $month = now()->startOfMonth();
            $promos = PromoCode::with(['orders' => fn ($q) => $q->where('created_at', '>=', $month)])->orderByDesc('created_at')->get();
            $promos->each(fn ($p) => $p->setAttribute('this_month_sales', number_format($p->orders->sum(fn ($o) => (float) $o->total_amount), 2, '.', '')));

            return response()->json(ApiJson::camel($promos));
        }
        abort_unless(isset(self::RESOURCES[$resource]), 404);
        [$class] = self::RESOURCES[$resource];
        $query = $class::query();
        if ($resource === 'products') {
            $query->with(['brand', 'category', 'mainCategory']);
        } elseif ($resource === 'categories') {
            $query->with(['brand', 'mainCategory'])->withCount('products');
        } elseif ($resource === 'brands') {
            $query->with('mainCategory')->withCount(['products', 'categories']);
        } elseif ($resource === 'main-categories') {
            $query->withCount(['products', 'categories', 'brands']);
        }

        $records = $query->orderByDesc('created_at')->get();
        if (in_array($resource, ['brands', 'categories', 'main-categories'], true)) {
            return response()->json($records->map(function ($record) use ($resource): array {
                $data = ApiJson::camel($record);
                $data['_count'] = match ($resource) {
                    'brands' => ['products' => (int) $record->products_count, 'categories' => (int) $record->categories_count],
                    'categories' => ['products' => (int) $record->products_count],
                    'main-categories' => ['products' => (int) $record->products_count, 'categories' => (int) $record->categories_count, 'brands' => (int) $record->brands_count],
                };

                return $data;
            })->values());
        }

        return response()->json(ApiJson::camel($records));
    }

    public function store(Request $request, string $resource)
    {
        abort_unless(isset(self::RESOURCES[$resource]), 404);
        [$class, $table, $fields] = self::RESOURCES[$resource];
        $input = $this->allowedInput($request, $fields);
        if ($resource === 'categories' && empty($input['brand_id'])) {
            $brand = Brand::firstOrCreate(['slug' => 'zad-land'], ['name' => 'Zad Land', 'group' => 'MAIN', 'is_active' => true, 'is_featured' => true]);
            $input['brand_id'] = $brand->id;
        }
        $this->validateResource($request, $resource, $table, $fields, $input);
        if (in_array('slug', $fields, true) && empty($input['slug'])) {
            $input['slug'] = $this->uniqueSlug($table, $resource === 'main-categories' ? (($input['description'] ?? '') ?: ($input['name'] ?? '')) : ($input['name'] ?? ''));
        }
        if ($resource === 'products') {
            $category = Category::find($input['category_id'] ?? null);
            if (! $category || $category->brand_id !== ($input['brand_id'] ?? null)) {
                return response()->json(['error' => 'Product category must belong to the selected brand'], 422);
            }
            if (empty($input['main_category_id'])) {
                $input['main_category_id'] = $category->main_category_id;
            }
        }
        if ($resource === 'promo-codes' && isset($input['code'])) {
            $input['code'] = strtoupper($input['code']);
        }
        $record = new $class($input);
        $record->save();

        return response()->json(ApiJson::camel($record->fresh()), 201);
    }

    public function importProduct(Request $request)
    {
        $row = $request->validate(['row' => ['sometimes', 'array']]);
        $source = $row['row'] ?? $request->all();
        $values = [];
        foreach ($source as $key => $value) {
            $values[mb_strtolower(preg_replace('/[^\pL\pN]/u', '', (string) $key) ?? '')] = $value;
        }
        $pick = static function (array $keys) use ($values): mixed {
            foreach ($keys as $key) {
                $normalized = mb_strtolower(preg_replace('/[^\pL\pN]/u', '', $key) ?? '');
                if (array_key_exists($normalized, $values)) {
                    return $values[$normalized];
                }
            }

            return null;
        };
        $mainName = trim((string) $pick(['mainCategory', 'main category', 'department', 'القسم الرئيسي', 'القسم']));
        $categoryName = trim((string) $pick(['category', 'categoryName', 'subcategory', 'sub category', 'الفئة', 'الصنف الفرعي']));
        $brandName = trim((string) $pick(['brand', 'brandName', 'الشركة', 'العلامة التجارية']));
        $nameAr = trim((string) $pick(['nameAr', 'name ar', 'arabic name', 'product name', 'name', 'اسم المنتج', 'الاسم']));
        $nameEn = trim((string) $pick(['nameEn', 'name en', 'english name']));
        $price = $pick(['price', 'السعر']);
        $stock = $pick(['stock', 'quantity', 'available stock', 'الكمية', 'المخزون']);
        $image = $pick(['image', 'images', 'image url', 'الصورة', 'رابط الصورة']);
        if ($mainName === '' || $categoryName === '' || $brandName === '' || $nameAr === '' || ! is_numeric($price) || (float) $price < 0 || ! is_numeric($stock) || (int) $stock < 0) {
            return response()->json(['error' => 'Each row needs a department, category, brand, product name, valid price, and non-negative stock.'], 422);
        }
        $mainName = match (trim($mainName)) {
            'مفزرات' => 'مفرزات', default => trim($mainName)
        };
        $main = MainCategory::firstOrCreate(['slug' => $this->importSlug('department', $mainName)], ['name' => $mainName, 'show_in_nav' => true, 'is_active' => true]);
        $brand = Brand::firstOrCreate(['name' => $brandName], ['slug' => $this->importSlug('brand', $brandName), 'group' => 'MAIN', 'is_active' => true]);
        $category = Category::firstOrCreate(['brand_id' => $brand->id, 'name' => $categoryName], ['slug' => $this->importSlug('category', $brandName.'-'.$categoryName), 'main_category_id' => $main->id]);
        $descriptionAr = trim((string) $pick(['descriptionAr', 'description ar', 'الوصف']) ?: $nameAr);
        $descriptionEn = trim((string) $pick(['descriptionEn', 'description en', 'description']) ?: $nameEn);
        if (is_array($image)) {
            $imageList = array_values(array_filter($image, 'is_string'));
        } else {
            $imageString = trim((string) ($image ?? ''));
            $imageList = $imageString === '' || $imageString === '0' ? [] : (str_starts_with($imageString, '[') ? (json_decode($imageString, true) ?: []) : array_map('trim', explode(',', $imageString)));
        }
        $slugSource = $nameEn !== '' ? $nameEn : $nameAr;
        $slug = $this->importSlug('product', $slugSource, $nameAr);
        $product = Product::firstOrCreate(['slug' => $slug], [
            'name' => $nameAr, 'name_ar' => $nameAr, 'name_en' => $nameEn ?: null,
            'description' => $descriptionAr, 'description_ar' => $descriptionAr, 'description_en' => $descriptionEn ?: null,
            'images' => json_encode($imageList, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'price' => $price, 'stock' => (int) $stock, 'min_order' => 1, 'packaging' => 'طرد',
            'category_id' => $category->id, 'brand_id' => $brand->id, 'main_category_id' => $main->id,
        ]);

        return response()->json(['success' => true, 'created' => $product->wasRecentlyCreated, 'id' => $product->id], $product->wasRecentlyCreated ? 201 : 200);
    }

    private function importSlug(string $prefix, string $value, ?string $stableKey = null): string
    {
        $base = Str::slug($value);
        $suffix = substr(hash('sha256', mb_strtolower($stableKey ?? $value)), 0, 12);

        return ($base !== '' ? $base : $prefix).'-'.$suffix;
    }

    public function update(Request $request, string $id, string $resource)
    {
        abort_unless(isset(self::RESOURCES[$resource]), 404);
        [$class, $table, $fields] = self::RESOURCES[$resource];
        $record = $class::findOrFail($id);
        $input = $this->allowedInput($request, $fields);
        $this->validateResource($request, $resource, $table, $fields, $input, $id);
        if (in_array('slug', $fields, true) && isset($input['name']) && ! array_key_exists('slug', $input)) {
            $source = $resource === 'main-categories' ? (($input['description'] ?? $record->description) ?: $input['name']) : $input['name'];
            $input['slug'] = $this->uniqueSlug($table, $source, $id);
        }
        if ($resource === 'products') {
            $category = Category::find($input['category_id'] ?? $record->category_id);
            $brandId = $input['brand_id'] ?? $record->brand_id;
            if (! $category || $category->brand_id !== $brandId) {
                return response()->json(['error' => 'Product category must belong to the selected brand'], 422);
            }
            if (array_key_exists('category_id', $input) && ! array_key_exists('main_category_id', $input)) {
                $input['main_category_id'] = $category->main_category_id;
            }
        }
        if ($resource === 'promo-codes' && isset($input['code'])) {
            $input['code'] = strtoupper($input['code']);
        }
        $record->fill($input)->save();

        return response()->json(ApiJson::camel($record->fresh()));
    }

    public function destroy(string $id, string $resource)
    {
        abort_unless(isset(self::RESOURCES[$resource]), 404);
        [$class] = self::RESOURCES[$resource];
        $record = $class::findOrFail($id);
        if ($resource === 'products' && $record->orderItems()->exists()) {
            return response()->json(['error' => 'Products with orders cannot be deleted.'], 409);
        }
        if ($resource === 'categories' && $record->products()->exists()) {
            return response()->json(['error' => 'Categories with products cannot be deleted.'], 409);
        }
        try {
            $record->delete();
        } catch (\Throwable) {
            return response()->json(['error' => 'This record is still in use.'], 409);
        }

        return response()->json(['success' => true]);
    }

    public function approveCustomer(Request $request)
    {
        $data = $request->validate(['id' => ['required', 'string', 'max:191'], 'isActive' => ['required', 'boolean']]);
        $customer = Customer::find($data['id']);
        if (! $customer) {
            return response()->json(['error' => 'Merchant not found'], 404);
        }
        $customer->update(['is_active' => $data['isActive']]);

        return response()->json(['customer' => ApiJson::camel($customer->only(['id', 'shop_name', 'is_active']))])->header('Cache-Control', 'no-store');
    }

    public function storeCustomer(Request $request)
    {
        $data = $request->validate([
            'shopName' => ['required', 'string', 'min:2', 'max:100'],
            'ownerName' => ['required', 'string', 'min:2', 'max:100'],
            'phone' => ['required', 'string', 'max:32'],
            'city' => ['required', 'string', 'min:2', 'max:100'],
            'address' => ['required', 'string', 'min:5', 'max:250'],
            'notes' => ['nullable', 'string', 'max:500'],
            'password' => ['required', 'string', 'min:6', 'max:128'],
            'isActive' => ['required', 'boolean'],
        ]);
        $phone = MerchantPhone::normalize($data['phone']);
        if (! $phone) {
            return response()->json(['error' => 'Enter a valid mobile number.'], 422);
        }
        if (Customer::whereIn('phone', MerchantPhone::variants($phone))->exists()) {
            return response()->json(['error' => 'This phone number already has a merchant account.'], 409);
        }

        $customer = Customer::create([
            'shop_name' => $data['shopName'],
            'owner_name' => $data['ownerName'],
            'phone' => $phone,
            'city' => $data['city'],
            'address' => $data['address'],
            'notes' => $data['notes'] ?? null,
            'password' => Hash::make($data['password']),
            'is_active' => $data['isActive'],
        ]);

        return response()->json(ApiJson::camel($customer), 201)->header('Cache-Control', 'no-store');
    }

    public function updateCustomer(Request $request, string $id)
    {
        $customer = Customer::findOrFail($id);
        $data = $request->validate([
            'shopName' => ['required', 'string', 'min:2', 'max:100'],
            'ownerName' => ['required', 'string', 'min:2', 'max:100'],
            'phone' => ['required', 'string', 'max:32'],
            'city' => ['required', 'string', 'min:2', 'max:100'],
            'address' => ['required', 'string', 'min:5', 'max:250'],
            'notes' => ['nullable', 'string', 'max:500'],
            'password' => ['nullable', 'string', 'min:6', 'max:128'],
            'isActive' => ['required', 'boolean'],
        ]);
        $phone = MerchantPhone::normalize($data['phone']);
        if (! $phone) {
            return response()->json(['error' => 'Enter a valid mobile number.'], 422);
        }
        if (Customer::whereIn('phone', MerchantPhone::variants($phone))->where('id', '!=', $customer->id)->exists()) {
            return response()->json(['error' => 'This phone number already has a merchant account.'], 409);
        }

        $customer->fill([
            'shop_name' => $data['shopName'],
            'owner_name' => $data['ownerName'],
            'phone' => $phone,
            'city' => $data['city'],
            'address' => $data['address'],
            'notes' => $data['notes'] ?? null,
            'is_active' => $data['isActive'],
        ]);
        if (! empty($data['password'])) {
            $customer->password = Hash::make($data['password']);
        }
        $customer->save();

        return response()->json(ApiJson::camel($customer->fresh()), 200)->header('Cache-Control', 'no-store');
    }

    public function deleteCustomer(string $id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();

        return response()->json(['success' => true])->header('Cache-Control', 'no-store');
    }

    public function updateReview(Request $request, string $id)
    {
        $data = $request->validate(['isApproved' => ['required', 'boolean']]);
        $review = Review::findOrFail($id);
        $review->update(['is_approved' => $data['isApproved']]);

        return response()->json(['success' => true]);
    }

    public function deleteReview(string $id)
    {
        Review::whereKey($id)->delete();

        return response()->json(['success' => true]);
    }

    public function saveSettings(Request $request)
    {
        $columns = collect(Schema::getColumnListing('settings'))->reject(fn ($c) => in_array($c, ['id', 'updated_at'], true))->all();
        $rules = [];
        foreach (array_keys($request->all()) as $key) {
            $column = Str::snake($key);
            if (in_array($column, $columns, true)) {
                if ($column === 'exchange_rate') {
                    $rules[$key] = ['nullable', 'numeric', 'gt:0', 'max:99999999.99'];
                } elseif (in_array($column, [
                    'featured_collection_enabled',
                    'featured_collection_new_arrivals_enabled',
                    'featured_collection_best_sellers_enabled',
                ], true)) {
                    $rules[$key] = ['required', 'boolean'];
                } elseif ($column === 'featured_collection_all_products_url') {
                    $rules[$key] = ['nullable', 'string', 'max:2000'];
                } elseif ($column === 'header_nav_items') {
                    $rules[$key] = ['nullable', 'string', 'max:20000', function ($attribute, $value, $fail) {
                        if ($value === null || $value === '') {
                            return;
                        }

                        try {
                            $items = json_decode($value, true, 512, JSON_THROW_ON_ERROR);
                        } catch (\JsonException) {
                            $fail('The header navigation links must be valid JSON.');
                            return;
                        }

                        if (! is_array($items) || ! array_is_list($items) || count($items) > 12) {
                            $fail('The header navigation supports up to 12 ordered links.');
                            return;
                        }

                        $seen = [];
                        foreach ($items as $item) {
                            if (! is_array($item)
                                || ! in_array($item['type'] ?? null, ['category', 'brand'], true)
                                || ! is_string($item['id'] ?? null)
                                || $item['id'] === ''
                                || strlen($item['id']) > 191) {
                                $fail('Each header navigation link must select a valid category or brand.');
                                return;
                            }

                            $key = $item['type'].':'.$item['id'];
                            if (isset($seen[$key])) {
                                $fail('A category or brand can only appear once in the header navigation.');
                                return;
                            }
                            $seen[$key] = true;
                        }
                    }];
                } else {
                    $rules[$key] = ['nullable', 'string', 'max:20000'];
                }
            }
        }
        $data = $request->validate($rules);
        $input = [];
        foreach ($data as $key => $value) {
            $column = Str::snake($key);
            if (in_array($column, $columns, true)) {
                $input[$column] = $value;
            }
        }
        if (isset($input['exchange_rate']) && (! is_numeric($input['exchange_rate']) || (float) $input['exchange_rate'] <= 0)) {
            return response()->json(['error' => 'Invalid exchange rate'], 422);
        }
        $settings = Settings::firstOrCreate(['id' => 'site-settings']);
        $settings->fill($input);
        $settings->updated_at = now();
        $settings->save();

        return response()->json(ApiJson::camel($settings->fresh()));
    }

    public function validatePromo(Request $request)
    {
        $data = $request->validate(['code' => ['required', 'string', 'max:100']]);
        $promo = PromoCode::where('code', strtoupper(trim($data['code'])))->first();
        if (! $promo || ! $promo->is_active) {
            return response()->json(['success' => false, 'error' => $promo ? 'Promo code is inactive' : 'Invalid promo code']);
        }

        return response()->json(['success' => true, 'promoCode' => ['id' => $promo->id, 'code' => $promo->code, 'discountPercentage' => $promo->discount_percentage]]);
    }

    public function usersStore(Request $request)
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:191', 'unique:users,username'], 'password' => ['required', 'string', 'min:6', 'max:128'],
            'role' => ['nullable', Rule::in(['ADMIN', 'SUPER_ADMIN'])], ...$this->permissionRules(),
        ]);
        $data = $this->snakeKeys($data);
        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);

        return response()->json($user, 201);
    }

    public function usersUpdate(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        $data = $request->validate([
            'username' => ['required', 'string', 'max:191', Rule::unique('users', 'username')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:6', 'max:128'], 'role' => ['nullable', Rule::in(['ADMIN', 'SUPER_ADMIN'])], ...$this->permissionRules(),
        ]);
        $data = $this->snakeKeys($data);
        if (($data['role'] ?? $user->role) !== 'SUPER_ADMIN' && $user->role === 'SUPER_ADMIN' && User::where('role', 'SUPER_ADMIN')->count() <= 1) {
            return response()->json(['error' => 'At least one super admin must remain.'], 409);
        }
        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }
        $user->update($data);

        return response()->json($user->fresh());
    }

    public function credentials(Request $request)
    {
        $user = $request->user('web');
        if ($request->isMethod('get')) {
            return response()->json(['user' => ApiJson::camel($user->only(['id', 'username', 'created_at', 'updated_at']))])->header('Cache-Control', 'private, no-store');
        }
        $data = $request->validate([
            'currentPassword' => ['required', 'string', 'max:128'],
            'newUsername' => ['nullable', 'string', 'min:2', 'max:191', Rule::unique('users', 'username')->ignore($user->id)],
            'newPassword' => ['nullable', 'string', 'min:6', 'max:128'],
        ]);
        if (! Hash::check($data['currentPassword'], $user->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 422);
        }
        $update = [];
        if (! empty($data['newUsername']) && $data['newUsername'] !== $user->username) {
            $update['username'] = trim($data['newUsername']);
        }
        if (! empty($data['newPassword'])) {
            $update['password'] = Hash::make($data['newPassword']);
        }
        if ($update === []) {
            return response()->json(['error' => 'No changes to update'], 422);
        }
        $user->update($update);

        return response()->json(['success' => true, 'message' => 'Credentials updated successfully']);
    }

    public function usersDelete(string $id)
    {
        $user = User::findOrFail($id);
        if ($user->id === request()->user('web')->id) {
            return response()->json(['error' => 'You cannot delete your own account.'], 409);
        }
        if ($user->role === 'SUPER_ADMIN' && User::where('role', 'SUPER_ADMIN')->count() <= 1) {
            return response()->json(['error' => 'At least one super admin must remain.'], 409);
        }
        $user->delete();

        return response()->json(['success' => true]);
    }

    public function bulk(Request $request)
    {
        $data = $request->validate(['action' => ['required', Rule::in(['toggleTrending', 'removeSale', 'deleteProducts', 'deleteCategories'])], 'ids' => ['required', 'array', 'min:1', 'max:500'], 'ids.*' => ['string', 'max:191'], 'value' => ['nullable', 'boolean']]);
        $user = $request->user('web');
        $requiredPermission = $data['action'] === 'deleteCategories' ? 'can_delete_categories' : (in_array($data['action'], ['deleteProducts'], true) ? 'can_delete_products' : 'can_manage_products');
        if ($user->role !== 'SUPER_ADMIN' && ! $user->{$requiredPermission}) {
            return response()->json(['error' => 'Forbidden'], 403);
        }
        if ($data['action'] === 'toggleTrending') {
            Product::whereIn('id', $data['ids'])->update(['is_trending' => (bool) ($data['value'] ?? false)]);
        } elseif ($data['action'] === 'removeSale') {
            Product::whereIn('id', $data['ids'])->update(['discount_price' => null, 'discount_type' => null, 'discount_value' => null]);
        } elseif ($data['action'] === 'deleteProducts') {
            $deletable = Product::whereIn('id', $data['ids'])->whereDoesntHave('orderItems')->pluck('id');
            Product::whereIn('id', $deletable)->delete();

            return response()->json(['success' => true, 'count' => $deletable->count(), 'partial' => $deletable->count() !== count($data['ids'])]);
        } else {
            $deletable = Category::whereIn('id', $data['ids'])->whereDoesntHave('products')->pluck('id');
            Category::whereIn('id', $deletable)->delete();

            return response()->json(['success' => true, 'count' => $deletable->count(), 'partial' => $deletable->count() !== count($data['ids'])]);
        }

        return response()->json(['success' => true]);
    }

    private function dashboard()
    {
        $delivered = Order::where('status', 'DELIVERED');
        $statuses = collect(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
            ->mapWithKeys(fn (string $status) => [strtolower($status) => Order::where('status', $status)->count()]);
        $lowStock = Product::with('category:id,name')->where('stock', '<=', 5)->orderBy('stock')->take(10)->get();
        $sales = Order::where('status', 'DELIVERED')->where('created_at', '>=', now()->subDays(13)->startOfDay())
            ->selectRaw('DATE(created_at) as day, SUM(total_amount) as revenue, COUNT(*) as orders')->groupByRaw('DATE(created_at)')->orderBy('day')->get()->keyBy('day');
        $trend = collect(range(13, 0))->map(function (int $daysAgo) use ($sales): array {
            $date = now()->subDays($daysAgo)->startOfDay();
            $row = $sales->get($date->toDateString());

            return ['date' => $date->toDateString(), 'label' => $date->format('M j'), 'revenue' => (float) ($row?->revenue ?? 0), 'orders' => (int) ($row?->orders ?? 0)];
        });
        $topProducts = DB::table('order_items')->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')->where('orders.status', '!=', 'CANCELLED')
            ->select('products.id', 'products.name', 'products.name_ar as nameAr', 'products.images', 'products.stock', 'products.price')
            ->selectRaw('SUM(order_items.quantity) as unitsSold, SUM(order_items.quantity * order_items.price) as revenue')
            ->groupBy('products.id', 'products.name', 'products.name_ar', 'products.images', 'products.stock', 'products.price')
            ->orderByDesc('unitsSold')->take(10)->get()->map(fn ($item) => [
                'id' => $item->id, 'name' => $item->name, 'nameAr' => $item->nameAr,
                'image' => is_string($item->images) ? (json_decode($item->images, true)[0] ?? explode(',', $item->images)[0]) : '',
                'unitsSold' => (int) $item->unitsSold, 'revenue' => (float) $item->revenue,
                'stock' => (int) $item->stock, 'price' => (float) $item->price,
            ]);
        $totalOrders = Order::count();
        $totalRevenue = (float) $delivered->sum('total_amount');
        $deliveredCount = (int) $delivered->count();
        $outOfStockCount = Product::where('stock', '<=', 0)->count();
        $recentOrders = Order::with('items.product')->orderByDesc('created_at')->take(10)->get()->map(fn (Order $order) => [
            'id' => $order->id, 'Name' => $order->name, 'customer' => $order->shop_name ?: $order->name,
            'phone' => $order->phone, 'streetAddress' => $order->street_address, 'city' => $order->city,
            'product' => $order->items->first()?->product?->name,
            'date' => $order->created_at?->toDateString(), 'createdAt' => $order->created_at?->toISOString(),
            'amount' => number_format((float) $order->total_amount, 2).' USD', 'totalAmount' => (float) $order->total_amount,
            'status' => $order->status, 'statusColor' => match ($order->status) {
                'PENDING' => 'amber', 'PROCESSING' => 'blue', 'SHIPPED' => 'indigo', 'DELIVERED' => 'emerald', 'CANCELLED' => 'red', default => 'slate'
            },
            'items' => ApiJson::camel($order->items),
        ]);
        $topCities = Order::where('status', '!=', 'CANCELLED')->select('city')->selectRaw('COUNT(*) as order_count, SUM(total_amount) as total_revenue')
            ->groupBy('city')->orderByDesc('order_count')->take(6)->get()->map(fn ($row) => ['city' => $row->city, 'orderCount' => (int) $row->order_count, 'totalRevenue' => (float) $row->total_revenue]);

        return response()->json([
            'totalRevenue' => $totalRevenue, 'totalOrders' => $totalOrders, 'totalProducts' => Product::count(),
            'totalCategories' => Category::count(), 'averageOrderValue' => $deliveredCount ? $totalRevenue / $deliveredCount : 0,
            'deliveredOrdersCount' => $deliveredCount, 'pipeline' => $statuses,
            'inventory' => ['totalProducts' => Product::count(), 'lowStockCount' => Product::whereBetween('stock', [1, 5])->count(), 'outOfStockCount' => $outOfStockCount, 'inStockCount' => Product::where('stock', '>', 0)->count()],
            'lowStockProducts' => $lowStock->map(fn (Product $product) => ['id' => $product->id, 'name' => $product->name, 'nameAr' => $product->name_ar, 'stock' => $product->stock, 'price' => (float) $product->price, 'image' => explode(',', $product->images)[0] ?? '', 'categoryName' => $product->category?->name]),
            'topProducts' => $topProducts, 'salesTrend' => $trend, 'topCities' => $topCities, 'recentOrders' => $recentOrders,
        ]);
    }

    private function allowedInput(Request $request, array $fields): array
    {
        $allowed = array_fill_keys($fields, true);
        $input = [];
        foreach ($request->all() as $key => $value) {
            $column = Str::snake($key);
            if (isset($allowed[$column])) {
                $input[$column] = is_string($value) ? trim($value) : $value;
            }
        }

        return $input;
    }

    private function validateResource(Request $request, string $resource, string $table, array $fields, array $input, ?string $id = null): void
    {
        $rules = [];
        foreach ($fields as $field) {
            $rules[Str::camel($field)] = ['sometimes', 'nullable'];
        }
        $required = match ($resource) {
            'brands', 'main-categories' => ['name'],
            'categories' => ['name'],
            'products' => ['name', 'images', 'price', 'category_id', 'brand_id'],
            'banners' => ['image'], 'promo-codes' => ['code', 'discount_percentage'], default => [],
        };
        foreach ($required as $field) {
            $maxLength = match ($field) {
                'images' => 10000,
                'name' => in_array($resource, ['products', 'categories'], true) ? 191 : 767,
                default => 2000,
            };
            $rules[Str::camel($field)] = [$id ? 'sometimes' : 'required', 'string', 'max:'.$maxLength];
        }
        if ($resource === 'banners' && in_array('image_mobile', $fields, true)) {
            $rules['imageMobile'] = ['sometimes', 'nullable', 'string', 'max:2000'];
        }
        foreach (['price', 'discount_price', 'discount_value'] as $field) {
            if (in_array($field, $fields, true)) {
                $rules[Str::camel($field)] = [$field === 'price' && $resource === 'products' && ! $id ? 'required' : 'sometimes', 'nullable', 'numeric', 'min:0', 'max:99999999.99'];
            }
        }
        foreach (['stock', 'min_order', 'nav_order', 'discount_percentage'] as $field) {
            if (in_array($field, $fields, true)) {
                $rules[Str::camel($field)] = ['sometimes', 'integer', 'min:'.($field === 'min_order' ? 1 : 0), 'max:'.($field === 'discount_percentage' ? 100 : 2147483647)];
            }
        }
        foreach (['is_active', 'is_featured', 'show_in_nav', 'is_trending'] as $field) {
            if (in_array($field, $fields, true)) {
                $rules[Str::camel($field)] = ['sometimes', 'boolean'];
            }
        }
        if (in_array('slug', $fields, true)) {
            $rules['slug'] = ['sometimes', 'string', 'max:767'];
        }
        if (in_array('brand_id', $fields, true)) {
            $rules['brandId'] = [$resource === 'products' && ! $id ? 'required' : 'sometimes', 'string', 'max:191', 'exists:brands,id'];
        }
        if (in_array('category_id', $fields, true)) {
            $rules['categoryId'] = [$resource === 'products' && ! $id ? 'required' : 'sometimes', 'string', 'max:191', 'exists:categories,id'];
        }
        if (in_array('main_category_id', $fields, true)) {
            $rules['mainCategoryId'] = ['sometimes', 'nullable', 'string', 'max:191', 'exists:main_categories,id'];
        }
        foreach (['slug' => 'slug', 'name' => 'name', 'code' => 'code'] as $field => $column) {
            if (in_array($column, $fields, true)) {
                $uniqueRule = Rule::unique($table, $column)->ignore($id);
                if ($resource === 'categories' && $field === 'name') {
                    $brandId = $input['brand_id'] ?? ($id ? Category::whereKey($id)->value('brand_id') : null);
                    if ($brandId === null) {
                        continue;
                    }
                    $uniqueRule->where('brand_id', $brandId);
                }
                $rules[Str::camel($field)][] = $uniqueRule;
            }
        }
        if ($resource === 'promo-codes') {
            $rules['discountPercentage'] = ['required', 'integer', 'between:0,100'];
        }
        if ($resource === 'brands') {
            $rules['group'] = ['sometimes', Rule::in(['MAIN', 'DIFFERENT'])];
        }
        $request->validate($rules);
    }

    private function permissionRules(): array
    {
        return [
            'canManageBrands' => ['required', 'boolean'], 'canDeleteBrands' => ['required', 'boolean'], 'canManageProducts' => ['required', 'boolean'], 'canDeleteProducts' => ['required', 'boolean'],
            'canManageCategories' => ['required', 'boolean'], 'canDeleteCategories' => ['required', 'boolean'], 'canManageBanners' => ['required', 'boolean'], 'canDeleteBanners' => ['required', 'boolean'],
            'canManageOrders' => ['required', 'boolean'], 'canDeleteOrders' => ['required', 'boolean'], 'canManagePromoCodes' => ['required', 'boolean'], 'canDeletePromoCodes' => ['required', 'boolean'],
        ];
    }

    private function snakeKeys(array $data): array
    {
        $result = [];
        foreach ($data as $key => $value) {
            $result[Str::snake($key)] = $value;
        }

        return $result;
    }

    private function uniqueSlug(string $table, string $source, ?string $ignore = null): string
    {
        $base = strtolower(trim(str_replace('&', $table === 'brands' ? 'g' : 'and', $source)));
        $base = trim(preg_replace('/[^a-z0-9]+/', '-', $base) ?? '', '-');
        if ($base === '') {
            $base = match ($table) {
                'brands' => 'brand', 'categories' => 'category', default => 'dept-'.base_convert((string) time(), 10, 36)
            };
        }
        $slug = $base;
        $query = DB::table($table)->where('slug', $slug);
        if ($ignore) {
            $query->where('id', '!=', $ignore);
        }
        if ($query->exists()) {
            $slug = $base.'-'.Str::lower(Str::random(5));
        }

        return $slug;
    }
}

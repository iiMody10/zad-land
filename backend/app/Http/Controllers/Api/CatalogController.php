<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Brand;
use App\Models\Category;
use App\Models\MainCategory;
use App\Models\Product;
use App\Support\ApiJson;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function products(Request $request)
    {
        $data = $request->validate([
            'page' => ['nullable', 'integer', 'min:1', 'max:100000'], 'limit' => ['nullable', 'integer', 'min:1', 'max:32'],
            'sort' => ['nullable', 'in:price_asc,price_desc,newest,bestselling'], 'categoryIds' => ['nullable', 'string', 'max:4000'],
            'brandIds' => ['nullable', 'string', 'max:4000'], 'mainCategoryId' => ['nullable', 'string', 'max:191'],
            'search' => ['nullable', 'string', 'max:200'], 'knownTotal' => ['nullable', 'integer', 'min:0'],
        ]);
        $limit = min((int) ($data['limit'] ?? 32), 32);
        $page = (int) ($data['page'] ?? 1);
        $query = Product::query()->whereHas('brand', fn ($q) => $q->where('is_active', true))
            ->with(['brand:id,name,slug,group', 'category:id,name']);
        $categoryIds = $this->csvIds($data['categoryIds'] ?? '');
        $brandIds = $this->csvIds($data['brandIds'] ?? '');
        if ($categoryIds) {
            $query->whereIn('category_id', $categoryIds);
        }
        if ($brandIds) {
            $query->whereIn('brand_id', $brandIds);
        }
        if (! empty($data['mainCategoryId'])) {
            $query->where('main_category_id', $data['mainCategoryId']);
        }
        if (in_array($request->query('inStock'), ['true', '1'], true)) {
            $query->where('stock', '>', 0);
        }
        if (in_array($request->query('onSale'), ['true', '1'], true)) {
            $query->whereNotNull('discount_price');
        }
        if (in_array($request->query('isTrending'), ['true', '1'], true)) {
            $query->where('is_trending', true);
        }
        if (($data['search'] ?? '') !== '') {
            $term = '%'.addcslashes($data['search'], '%_\\').'%';
            $query->where(fn ($q) => $q->where('name', 'like', $term)->orWhere('name_ar', 'like', $term)->orWhere('name_en', 'like', $term)->orWhere('description', 'like', $term)->orWhere('description_ar', 'like', $term)->orWhere('description_en', 'like', $term));
        }
        match ($data['sort'] ?? '') {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'newest' => $query->orderByDesc('created_at'),
            default => $query->orderByDesc('created_at'),
        };
        $skipCount = in_array($request->query('skipCount'), ['true', '1'], true);
        $total = ($skipCount || ($page > 1 && array_key_exists('knownTotal', $data))) ? (int) ($data['knownTotal'] ?? 0) : (clone $query)->count();
        $products = $query->skip(($page - 1) * $limit)->take($limit)->get();

        return response()->json(['products' => ApiJson::camel($products), 'pagination' => ['total' => $total, 'pages' => (int) ceil($total / $limit), 'page' => $page, 'limit' => $limit]])->header('Cache-Control', 'private, no-store');
    }

    public function trending()
    {
        $products = Product::with('category')->where('is_trending', true)->get();

        return response()->json(ApiJson::camel($products))->header('Cache-Control', 'private, no-store');
    }

    public function product(string $slug)
    {
        $product = Product::with(['brand', 'category', 'mainCategory'])->where('slug', $slug)->whereHas('brand', fn ($q) => $q->where('is_active', true))->firstOrFail();

        return response()->json(ApiJson::camel($product))->header('Cache-Control', 'private, no-store');
    }

    public function home()
    {
        $banners = Banner::where('is_active', true)->orderByDesc('created_at')->get();
        $homeCategories = Category::whereHas('products')->whereHas('brand', fn ($q) => $q->where('is_active', true))
            ->with('brand:id,name,slug')->withCount('products')
            ->orderByDesc('is_featured')->orderByDesc('products_count')->orderBy('name')->take(8)->get();
        $featuredCategories = $homeCategories->map(function (Category $category): array {
            $product = Product::where('category_id', $category->id)->whereHas('brand', fn ($q) => $q->where('is_active', true))->orderByDesc('is_trending')->orderByDesc('created_at')->first();
            $image = $category->image ?: (is_string($product?->images) ? (explode(',', $product->images)[0] ?? null) : null);

            return [
                'id' => $category->id, 'name' => $category->name, 'nameEn' => $category->description ?: $category->name,
                'description' => $category->description, 'image' => $image, 'slug' => $category->slug,
                'brandId' => $category->brand_id, 'isFeatured' => $category->is_featured,
                'brand' => $category->brand ? ['id' => $category->brand->id, 'name' => trim(explode('-', $category->brand->name)[0]), 'slug' => $category->brand->slug] : null,
                'createdAt' => $category->created_at?->toISOString(), 'updatedAt' => $category->updated_at?->toISOString(),
            ];
        });
        $featuredBrands = Brand::where('group', 'MAIN')->where('is_active', true)
            ->withCount(['products', 'categories'])->orderByDesc('is_featured')->orderByDesc('products_count')->orderBy('name')->take(18)->get()
            ->map(fn (Brand $brand) => [...ApiJson::camel($brand->only(['id', 'name', 'slug', 'description', 'image', 'group'])), '_count' => ['products' => $brand->products_count, 'categories' => $brand->categories_count]]);

        $sections = $homeCategories->take(6)
            ->map(function (Category $category): ?array {
                $products = Product::where('category_id', $category->id)->whereHas('brand', fn ($q) => $q->where('is_active', true))
                    ->with('brand:id,name,slug,group')->orderByDesc('is_trending')->orderByDesc('created_at')->take(18)->get();
                if ($products->isEmpty()) {
                    return null;
                }

                return ['category' => ['id' => $category->id, 'name' => trim($category->name), 'slug' => $category->slug, 'description' => $category->description ? trim($category->description) : null, 'image' => $category->image, 'productCount' => Product::where('category_id', $category->id)->whereHas('brand', fn ($q) => $q->where('is_active', true))->count()],
                    'products' => $products->map(fn (Product $p) => ['id' => $p->id, 'slug' => $p->slug, 'name' => $p->name, 'description' => $p->description, 'price' => (float) $p->price, 'discountPrice' => $p->discount_price !== null ? (float) $p->discount_price : null, 'images' => $p->images, 'categoryId' => $p->category_id, 'stock' => $p->stock, 'minOrder' => $p->min_order, 'packaging' => $p->packaging, 'itemsPerPackage' => $p->items_per_package, 'isTrending' => $p->is_trending, 'brand' => $p->brand ? ApiJson::camel($p->brand->only(['id', 'name', 'slug', 'group'])) : null])->values()];
            })->filter()->values();

        return response()->json(['banners' => ApiJson::camel($banners), 'featuredCategories' => $featuredCategories, 'featuredMainBrands' => $featuredBrands, 'collectionSections' => $sections])
            ->header('Cache-Control', 'private, no-store');
    }

    public function categories(Request $request)
    {
        $data = $request->validate(['limit' => ['nullable', 'integer', 'min:1', 'max:1000'], 'brandId' => ['nullable', 'string', 'max:191']]);
        $query = Category::query()->whereHas('brand', fn ($q) => $q->where('is_active', true))->with('brand:id,name,slug,group')->orderByDesc('is_featured')->orderBy('name');
        if (! empty($data['brandId'])) {
            $query->where('brand_id', $data['brandId']);
        }
        if (! empty($data['limit'])) {
            $query->take((int) $data['limit']);
        }

        return response()->json(ApiJson::camel($query->get()))->header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    }

    public function mainCategories()
    {
        return response()->json(ApiJson::camel(MainCategory::where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug', 'description', 'image'])))
            ->header('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    }

    public function navigation()
    {
        $mainCategories = MainCategory::where('is_active', true)->where('show_in_nav', true)->orderBy('nav_order')
            ->with(['brands' => fn ($q) => $q->where('is_active', true)->orderBy('name'), 'categories' => fn ($q) => $q->with('brand')->orderBy('name')->take(30), 'products' => fn ($q) => $q->with('brand')->orderByDesc('created_at')->take(40)])
            ->get();
        $data = $mainCategories->map(function (MainCategory $main): array {
            $brands = collect();
            foreach ($main->brands as $brand) {
                $brands->put($brand->id, $brand);
            }
            foreach ($main->categories as $category) {
                if ($category->brand?->is_active) {
                    $brands->put($category->brand->id, $category->brand);
                }
            }
            foreach ($main->products as $product) {
                if ($product->brand?->is_active) {
                    $brands->put($product->brand->id, $product->brand);
                }
            }
            $products = $main->products;
            $format = fn (Product $p) => ['id' => $p->id, 'name' => $p->name, 'nameAr' => $p->name_ar, 'nameEn' => $p->name_en, 'slug' => $p->slug, 'images' => $p->images, 'price' => (float) $p->price, 'discountPrice' => $p->discount_price !== null ? (float) $p->discount_price : null, 'minOrder' => $p->min_order, 'stock' => $p->stock, 'packaging' => $p->packaging, 'itemsPerPackage' => $p->items_per_package, 'brand' => $p->brand ? ['name' => $p->brand->name] : null];
            $trending = $products->where('is_trending', true)->take(3)->values();
            if ($trending->count() < 3) {
                $trending = $trending->concat($products->reject(fn ($p) => $trending->contains('id', $p->id))->take(3 - $trending->count()));
            }
            $top = $products->reject(fn ($p) => $trending->contains('id', $p->id))->take(8)->map(fn ($p) => ['id' => $p->id, 'name' => $p->name, 'nameAr' => $p->name_ar, 'nameEn' => $p->name_en, 'slug' => $p->slug])->values();

            return ['id' => $main->id, 'name' => $main->name, 'nameEn' => $main->description ?: $main->name, 'slug' => $main->slug, 'image' => $main->image, 'brands' => ApiJson::camel($brands->sortBy('name')->values()->map->only(['id', 'name', 'slug', 'image'])), 'categories' => ApiJson::camel($main->categories->map->only(['id', 'name', 'slug'])->values()), 'topProducts' => $top, 'trendingProducts' => $trending->take(3)->map($format)->values()];
        });

        return response()->json($data)->header('Cache-Control', 'private, no-store');
    }

    public function brands(Request $request)
    {
        $query = Brand::where('is_active', true)->with(['mainCategory:id,name,slug'])->withCount(['products', 'categories'])->orderBy('name');
        if ($request->filled('mainCategoryId')) {
            $query->where(fn ($q) => $q->where('main_category_id', $request->string('mainCategoryId'))->orWhereHas('categories', fn ($c) => $c->where('main_category_id', $request->string('mainCategoryId'))));
        }

        return response()->json(ApiJson::camel($query->get()))->header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    }

    public function sitemap()
    {
        return response()->json([
            'products' => ApiJson::camel(Product::whereHas('brand', fn ($q) => $q->where('is_active', true))->get(['slug', 'updated_at'])),
            'departments' => ApiJson::camel(MainCategory::where('is_active', true)->get(['slug', 'updated_at'])),
            'brands' => ApiJson::camel(Brand::where('is_active', true)->get(['slug', 'updated_at'])),
            'categories' => ApiJson::camel(Category::whereHas('brand', fn ($q) => $q->where('is_active', true))->get(['slug', 'updated_at'])),
        ])->header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    }

    private function csvIds(string $value): array
    {
        return collect(explode(',', $value))->map(fn ($id) => trim($id))->filter(fn ($id) => $id !== '' && strlen($id) <= 191)->unique()->take(100)->values()->all();
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\WishlistItem;
use App\Support\ApiJson;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $merchant = $request->user('merchant');
        $items = WishlistItem::where('customer_id', $merchant->id)->with(['product.brand'])->orderByDesc('created_at')->take(200)->get();
        if ($request->boolean('idsOnly')) {
            return response()->json(['wishlistIds' => $items->pluck('product_id')])->header('Cache-Control', 'private, no-store');
        }
        $products = $items->filter(fn ($item) => $item->product?->brand?->is_active)->pluck('product')->values();

        return response()->json(['products' => ApiJson::camel($products)])->header('Cache-Control', 'private, no-store');
    }

    public function store(Request $request)
    {
        $data = $request->validate(['productId' => ['required', 'string', 'max:191']]);
        $product = Product::whereKey($data['productId'])->whereHas('brand', fn ($q) => $q->where('is_active', true))->first();
        if (! $product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        WishlistItem::firstOrCreate(['customer_id' => $request->user('merchant')->id, 'product_id' => $product->id]);

        return response()->json(['success' => true])->header('Cache-Control', 'private, no-store');
    }

    public function destroy(Request $request)
    {
        $productId = $request->query('productId');
        if (! is_string($productId) || $productId === '' || strlen($productId) > 191) {
            return response()->json(['error' => 'Invalid product ID'], 400);
        }
        WishlistItem::where('customer_id', $request->user('merchant')->id)->where('product_id', $productId)->delete();

        return response()->json(['success' => true])->header('Cache-Control', 'private, no-store');
    }
}

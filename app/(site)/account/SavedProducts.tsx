"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart as MdFavoriteBorder } from 'lucide-react';
import { useLanguage } from "@/app/context/LanguageContext";
import { useWishlist } from "@/app/context/WishlistContext";
import ProductCard, { type Product } from "@/app/components/ProductsPageComponents/ProductCard";

export default function SavedProducts() {
    const { language } = useLanguage();
    const { revision } = useWishlist();
    const ar = language === "ar";
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        fetch("/api/customer/wishlist", { cache: "no-store", signal: controller.signal })
            .then(async (response) => {
                if (!response.ok) throw new Error("Could not load saved products");
                return response.json() as Promise<{ products: Product[] }>;
            })
            .then((data) => { if (!controller.signal.aborted) { setProducts(data.products); setError(""); setLoading(false); } })
            .catch(() => { if (!controller.signal.aborted) { setError(ar ? "تعذر تحميل المنتجات المحفوظة." : "Could not load saved products."); setLoading(false); } });
        return () => controller.abort();
    }, [revision, ar]);

    return <section className="mt-7 space-y-5">
        <div><h2 className="text-xl font-bold text-[var(--color-brand)] dark:text-white">{ar ? "المنتجات المحفوظة" : "Saved products"}</h2><p className="mt-1 text-sm text-slate-500">{ar ? "احتفظ بالمنتجات التي تطلبها باستمرار في مكان واحد." : "Keep your regular wholesale products in one place."}</p></div>
        {loading && <p className="text-sm text-slate-500">{ar ? "جاري التحميل..." : "Loading..."}</p>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!loading && !error && products.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-white/15"><MdFavoriteBorder className="mx-auto text-3xl text-slate-400"/><h3 className="mt-3 font-bold text-[var(--color-brand)] dark:text-white">{ar ? "لم تحفظ أي منتج بعد" : "No saved products yet"}</h3><Link href="/products" className="mt-3 inline-block text-sm font-bold text-[var(--color-brand-hover)] hover:underline">{ar ? "استكشف المنتجات" : "Explore products"}</Link></div>}
        {products.length > 0 && <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
    </section>;
}

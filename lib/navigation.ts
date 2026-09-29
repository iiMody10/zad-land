import { laravelJson } from "@/lib/laravel-server";
import { canViewWholesalePrices, projectProductsPrices } from "./price-visibility";

export interface NavBrand { id: string; name: string; slug: string; image?: string | null }
export interface NavCategory { id: string; name: string; slug: string }
export interface NavTopProduct { id: string; name: string; nameAr?: string | null; nameEn?: string | null; slug: string }
export interface NavTrendingProduct {
    id: string; name: string; nameAr?: string | null; nameEn?: string | null; slug: string;
    images: string; price: number | null; discountPrice: number | null; minOrder: number; stock: number | null;
    packaging: string | null; itemsPerPackage: string | null; brand?: { name: string } | null;
}
export interface NavMainCategory {
    id: string; name: string; nameEn?: string; slug: string; image?: string | null; showInNav?: boolean;
    brands: NavBrand[]; categories: NavCategory[]; topProducts: NavTopProduct[]; trendingProducts: NavTrendingProduct[];
}

export async function getNavigationData() {
    // Navigation settings and main-category assignments are admin-editable.
    // Fetch the no-store Laravel response directly so stale Next data cannot
    // leave the header empty after changes or an earlier failed request.
    const [data, allowed] = await Promise.all([
        laravelJson<NavMainCategory[]>("/api/navigation", []),
        canViewWholesalePrices(),
    ]);
    return data.map((category) => ({ ...category, trendingProducts: projectProductsPrices(category.trendingProducts, allowed) }));
}

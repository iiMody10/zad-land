import { unstable_cache } from "next/cache";
import { laravelJson } from "@/lib/laravel-server";
import { canViewWholesalePrices, projectProductsPrices } from "./price-visibility";

export interface NavBrand { id: string; name: string; slug: string; image?: string | null }
export interface NavCategory { id: string; name: string; slug: string }
export interface NavTopProduct { id: string; name: string; nameAr?: string | null; nameEn?: string | null; slug: string }
export interface NavTrendingProduct {
    id: string; name: string; nameAr?: string | null; nameEn?: string | null; slug: string;
    images: string; price: number | null; discountPrice: number | null; minOrder: number; stock: number;
    packaging: string | null; itemsPerPackage: string | null; brand?: { name: string } | null;
}
export interface NavMainCategory {
    id: string; name: string; nameEn?: string; slug: string; image?: string | null; showInNav?: boolean;
    brands: NavBrand[]; categories: NavCategory[]; topProducts: NavTopProduct[]; trendingProducts: NavTrendingProduct[];
}

const cachedNavigation = unstable_cache(
    async () => laravelJson<NavMainCategory[]>("/api/navigation", []),
    ["laravel-navigation-data-v2"],
    { tags: ["navigation"], revalidate: 3600 },
);

export async function getNavigationData() {
    const [data, allowed] = await Promise.all([cachedNavigation(), canViewWholesalePrices()]);
    return data.map((category) => ({ ...category, trendingProducts: projectProductsPrices(category.trendingProducts, allowed) }));
}

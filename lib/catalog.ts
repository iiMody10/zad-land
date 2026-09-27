import { cache } from "react";
import { unstable_cache } from "next/cache";
import { laravelJson } from "@/lib/laravel-server";
import { canViewWholesalePrices, projectProductsPrices } from "./price-visibility";

export interface CatalogCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    brandId: string;
    mainCategoryId: string | null;
    brand?: CatalogBrand | null;
}

export interface CatalogProduct {
    id: string;
    slug: string;
    name: string;
    nameAr?: string | null;
    nameEn?: string | null;
    description: string | null;
    descriptionAr?: string | null;
    descriptionEn?: string | null;
    price: string;
    discountPrice: string | null;
    discountType?: string | null;
    discountValue?: string | null;
    images: string;
    brandId: string;
    categoryId: string;
    mainCategoryId: string | null;
    stock: number;
    minOrder?: number;
    packaging?: string | null;
    itemsPerPackage?: string | null;
    isTrending: boolean;
    category?: { id: string; name: string; slug: string } | null;
    brand?: CatalogBrand | null;
}

export interface CatalogBrand {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    group: "MAIN" | "DIFFERENT";
    isFeatured: boolean;
    mainCategory?: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
    } | null;
}

type CatalogMainCategory = {
    id: string;
    name: string;
    nameEn?: string;
    slug: string;
    description: string | null;
    image: string | null;
};

const cachedBrands = unstable_cache(
    async () => laravelJson<CatalogBrand[]>("/api/brands", []),
    ["laravel-catalog-brands"],
    { tags: ["catalog", "brands"], revalidate: 3600 },
);

export const getCatalogBrands = cache(async () => (await cachedBrands()).map((brand) => ({ ...brand, isFeatured: Boolean(brand.isFeatured) })));

export const getBrandBySlug = cache(async (slug: string) => {
    const brands = await getCatalogBrands();
    return brands.find((brand) => brand.slug === slug) || null;
});

export const getCatalogCategories = cache(async (brandId?: string) => {
    const query = new URLSearchParams({ limit: "1000" });
    if (brandId) query.set("brandId", brandId);
    return laravelJson<Array<Omit<CatalogCategory, "mainCategoryId"> & { mainCategoryId?: string | null }>>(`/api/categories?${query.toString()}`, []).then((items) => items.map((item) => ({ ...item, mainCategoryId: item.mainCategoryId ?? null })));
});

export const getFooterCategories = cache(async (preferredIds: string[] = []) => {
    const categories = await getCatalogCategories();
    const selected = [...new Set(preferredIds.filter(Boolean))]
        .map((id) => categories.find((category) => category.id === id))
        .filter((category): category is CatalogCategory => Boolean(category));

    return (selected.length ? selected : categories).slice(0, 4).map(({ id, name, slug }) => ({ id, name, slug }));
});

export const getCategoryBySlug = cache(async (slug: string) => {
    const categories = await getCatalogCategories();
    return categories.find((category) => category.slug === slug) || null;
});

const cachedMainCategories = unstable_cache(
    async () => laravelJson<CatalogMainCategory[]>("/api/main-categories", []),
    ["laravel-catalog-main-categories"],
    { tags: ["catalog", "main-categories"], revalidate: 3600 },
);

export const getCatalogMainCategories = cache(async () => (await cachedMainCategories()).map((category) => ({
    id: category.id,
    name: category.name,
    nameEn: category.nameEn || category.description || category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
})));

export const getCatalogInitialData = cache(async (
    categoryId?: string,
    brandId?: string,
    mainCategoryId?: string,
    pageSize = 12,
) => {
    const query = new URLSearchParams({ page: "1", limit: String(Math.min(32, Math.max(1, pageSize))) });
    if (categoryId) query.set("categoryIds", categoryId);
    if (brandId) query.set("brandIds", brandId);
    if (mainCategoryId) query.set("mainCategoryId", mainCategoryId);

    const [catalog, categories] = await Promise.all([
        laravelJson<{ products: CatalogProduct[]; pagination: { total: number } }>(`/api/products?${query.toString()}`, { products: [], pagination: { total: 0 } }),
        brandId ? getCatalogCategories(brandId) : getCatalogMainCategories(),
    ]);
    const allowed = await canViewWholesalePrices();

    return {
        categories,
        products: projectProductsPrices(catalog.products, allowed),
        totalProducts: catalog.pagination.total,
    };
});

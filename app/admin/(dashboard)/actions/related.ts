"use server";

import { laravelJson } from "@/lib/laravel-server";

export async function getRelatedProducts(type: "brandId" | "mainCategoryId" | "categoryId", id: string, query: string) {
    try {
        const products = await laravelJson<Record<string, any>[]>("/api/admin/products", []);
        const matches = products.filter((product) => product[type] === id && String(product.name || "").toLocaleLowerCase().includes(query.toLocaleLowerCase()));
        return { success: true, data: matches.slice(0, 50).map(({ id: productId, name, images, price, stock }) => ({ id: productId, name, images, price, stock })) };
    } catch { return { success: false, error: "Failed to fetch products" }; }
}

export async function getRelatedCategories(type: "brandId" | "mainCategoryId", id: string, query: string) {
    try {
        const categories = await laravelJson<Record<string, any>[]>("/api/admin/categories", []);
        const matches = categories.filter((category) => category[type] === id && String(category.name || "").toLocaleLowerCase().includes(query.toLocaleLowerCase()));
        return { success: true, data: matches.slice(0, 50).map(({ id: categoryId, name, image }) => ({ id: categoryId, name, image })) };
    } catch { return { success: false, error: "Failed to fetch categories" }; }
}

export async function getRelatedBrands(id: string, query: string) {
    try {
        const brands = await laravelJson<Record<string, any>[]>("/api/admin/brands", []);
        const matches = brands.filter((brand) => brand.mainCategoryId === id && String(brand.name || "").toLocaleLowerCase().includes(query.toLocaleLowerCase()));
        return { success: true, data: matches.slice(0, 50).map(({ id: brandId, name, image }) => ({ id: brandId, name, image })) };
    } catch { return { success: false, error: "Failed to fetch brands" }; }
}

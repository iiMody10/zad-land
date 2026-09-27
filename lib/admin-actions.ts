"use server";

import { revalidatePath } from "next/cache";
import { laravelJson, laravelRequest } from "@/lib/laravel-server";

export type BrandGroup = "MAIN" | "DIFFERENT";
export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface ProductInput {
    name: string; nameAr?: string | null; nameEn?: string | null;
    description?: string | null; descriptionAr?: string | null; descriptionEn?: string | null;
    price: string | number; discountPrice?: string | number | null; discountType?: string | null; discountValue?: string | number | null;
    stock: string | number; minOrder?: string | number; packaging?: string | null; itemsPerPackage?: string | null;
    options?: string | null; sku?: string | null; images: string; brandId: string; categoryId: string; mainCategoryId?: string | null;
}

interface CategoryInput { name: string; description?: string; image?: string; isFeatured?: boolean; brandId?: string }
interface BrandInput { name: string; description?: string; image?: string; group?: BrandGroup; isActive?: boolean; isFeatured?: boolean; mainCategoryId?: string }
interface MainCategoryInput { name: string; description?: string; image?: string; isActive?: boolean; isFeatured?: boolean; showInNav?: boolean; navOrder?: number }
type ProductImportRow = Record<string, string | number | boolean | null | undefined>;

export interface BannerInput {
    title: string; subtitle?: string; titleAr: string; subtitleAr?: string; image: string;
    buttonText?: string; buttonTextAr?: string; link?: string; badge?: string; badgeAr?: string; isActive?: boolean;
}
export interface PromoCodeInput { code: string; discountPercentage: number; delegateName?: string; isActive?: boolean }

export interface HomeCollectionSectionProduct {
    id: string; slug: string; name: string; description: string | null; price: number | null; discountPrice: number | null;
    images: string; categoryId: string; stock: number; minOrder: number; packaging: string | null;
    itemsPerPackage: string | null; isTrending: boolean; brand?: { id: string; name: string; slug: string; group: BrandGroup } | null;
}
export interface HomeCollectionSection {
    category: { id: string; name: string; slug: string; description: string | null; image: string | null; productCount: number };
    products: HomeCollectionSectionProduct[];
}
export interface HomeBrand {
    id: string; name: string; slug: string; description: string | null; image: string | null; group: BrandGroup;
    _count: { products: number; categories: number };
}
export interface RailBrand { id: string; name: string; nameAr: string; fullName: string; slug: string; image: string; productCount?: number }

export interface DashboardStats {
    totalRevenue: number; totalOrders: number; totalProducts: number; totalCategories: number; averageOrderValue: number;
    deliveredOrdersCount: number;
    pipeline: { pending: number; processing: number; shipped: number; delivered: number; cancelled: number };
    inventory: { totalProducts: number; lowStockCount: number; outOfStockCount: number; inStockCount: number };
    lowStockProducts: { id: string; name: string; nameAr: string | null; stock: number; price: number; image: string; categoryName: string }[];
    topProducts: { id: string; name: string; nameAr: string | null; image: string; unitsSold: number; revenue: number; stock: number; price: number }[];
    salesTrend: { date: string; label: string; revenue: number; orders: number }[];
    topCities: { city: string; orderCount: number; totalRevenue: number }[];
    recentOrders: { id: string; Name: string; customer: string; phone: string; streetAddress: string; city: string; product: string; date: string; createdAt: string; amount: string; totalAmount: number; status: string; statusColor: string; items: { id: string; quantity: number; price: number; product: { name: string; images: string } | null }[] }[];
}

async function request<T = any>(path: string, method = "GET", body?: unknown): Promise<T> {
    const response = await laravelRequest(`/api${path}`, {
        method,
        headers: body === undefined ? undefined : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        const validation = payload?.errors && Object.values(payload.errors).flat()[0];
        throw new Error(String(validation || payload?.message || payload?.error || `Request failed (${response.status})`));
    }
    return payload as T;
}

function invalidateAdminData() {
    for (const path of ["/", "/products", "/brands", "/categories", "/admin"]) {
        revalidatePath(path);
    }
}

async function mutation<T>(path: string, method: string, body?: unknown) {
    try {
        const data = await request<T>(path, method, body);
        invalidateAdminData();
        return { success: true as const, data };
    } catch (error) {
        return { success: false as const, error: error instanceof Error ? error.message : "Request failed" };
    }
}

async function products(query = "") {
    const params = new URLSearchParams({ page: "1", limit: "32" });
    if (query) new URLSearchParams(query).forEach((value, key) => params.set(key, value));
    const all: Record<string, unknown>[] = [];
    let page = 1;
    let total = Number.POSITIVE_INFINITY;
    while (all.length < total && page <= 100) {
        params.set("page", String(page));
        params.set("limit", "32");
        const result = await laravelJson<{ products: Record<string, unknown>[]; pagination?: { total?: number } }>(`/api/products?${params}`, { products: [], pagination: { total: 0 } }, { forwardSession: false });
        all.push(...result.products);
        total = Number(result.pagination?.total || 0);
        page++;
    }
    return all;
}

const homeData = () => laravelJson<Record<string, any>>("/api/home", {}, { forwardSession: false });
const publicProducts = (query: string) => laravelJson<{ products: any[] }>(`/api/products?${query}`, { products: [] }, { forwardSession: false }).then((data) => data.products);
const imageOf = (images: unknown) => {
    if (typeof images !== "string") return "";
    try { const parsed = JSON.parse(images); return Array.isArray(parsed) ? String(parsed[0] || "") : images.split(",")[0].trim(); }
    catch { return images.split(",")[0].trim(); }
};

export async function getSiteSettings(): Promise<any> {
    return laravelJson<any>("/api/settings", null, { forwardSession: false });
}

export async function getActiveBanners() {
    return (await homeData()).banners || [];
}

export async function getMainCategoryBrands(): Promise<HomeBrand[]> {
    const brands = await laravelJson<Record<string, any>[]>("/api/brands", [], { forwardSession: false });
    return brands.filter((brand) => brand.group === "MAIN").map((brand) => ({
        ...brand,
        _count: brand._count || { products: 0, categories: 0 },
    })) as HomeBrand[];
}

export async function getHomeRailBrands(): Promise<RailBrand[]> {
    const brands = await laravelJson<Record<string, any>[]>("/api/brands", [], { forwardSession: false });
    return brands.map((brand) => ({
        id: brand.id, name: brand.name, nameAr: brand.name, fullName: brand.name, slug: brand.slug,
        image: brand.image || "", productCount: brand._count?.products || 0,
    }));
}

export async function getHomeRailCategories() {
    const departments = await laravelJson<Record<string, any>[]>("/api/main-categories", [], { forwardSession: false });
    const results = await Promise.all(departments.map(async (department) => {
        const result = await publicProducts(`page=1&limit=1&mainCategoryId=${encodeURIComponent(department.id)}`);
        const product = result[0];
        return {
            id: department.id, name: department.nameEn || department.name, nameAr: department.name,
            slug: department.slug, image: department.image || imageOf(product?.images),
        };
    }));
    return results.filter((category) => category.image);
}

export async function getCategoryHighlightCardsData() {
    const departments = await getHomeRailCategories();
    return departments.slice(0, 4).map((department) => ({
        id: department.id, slug: department.slug, subheadingAr: department.nameAr, subheadingEn: department.name,
        headingAr: department.nameAr, headingEn: department.name,
        productNameAr: department.nameAr, productNameEn: department.name,
        priceText: "", heroImage: department.image, productThumb: department.image, productSlug: "",
    }));
}

export async function getOnSaleProducts() { return publicProducts("page=1&limit=12&onSale=true"); }
export async function getNewArrivalProducts(): Promise<any[]> { return publicProducts("page=1&limit=12&sort=newest"); }
export async function getBestSellerProducts(): Promise<any[]> {
    const trending = await publicProducts("page=1&limit=12&isTrending=true");
    return trending.length ? trending : getNewArrivalProducts();
}
export async function getTrendingWeeklyProducts(): Promise<any[]> {
    const trending = await laravelJson<any[]>("/api/products/trending", [], { forwardSession: false });
    return trending.length ? trending : getBestSellerProducts();
}
export async function getFeaturedCategories() {
    const home = await homeData();
    return home.featuredCategories || [];
}
export async function getFeaturedMainBrands(): Promise<HomeBrand[]> {
    const home = await homeData();
    return home.featuredMainBrands || [];
}
export async function getHomeCollectionSections(): Promise<HomeCollectionSection[]> {
    const home = await homeData();
    return home.collectionSections || [];
}

export async function getDashboardStats(): Promise<DashboardStats> {
    return laravelJson<DashboardStats>("/api/admin/dashboard");
}

export async function getAdminBrands() { return request<any[]>("/admin/brands"); }
export async function createBrand(data: BrandInput) { return mutation("/admin/brands", "POST", data); }
export async function updateBrand(id: string, data: BrandInput) { return mutation(`/admin/brands/${encodeURIComponent(id)}`, "PATCH", data); }
export async function deleteBrand(id: string) { return mutation(`/admin/brands/${encodeURIComponent(id)}`, "DELETE"); }
export async function toggleBrandActive(id: string, isActive: boolean) { return mutation(`/admin/brands/${encodeURIComponent(id)}`, "PATCH", { isActive }); }
export async function toggleBrandFeatured(id: string, isFeatured: boolean) { return mutation(`/admin/brands/${encodeURIComponent(id)}`, "PATCH", { isFeatured }); }

export async function getAdminMainCategories() { return request<any[]>("/admin/main-categories"); }
export async function createMainCategory(data: MainCategoryInput) { return mutation("/admin/main-categories", "POST", data); }
export async function updateMainCategory(id: string, data: MainCategoryInput) { return mutation(`/admin/main-categories/${encodeURIComponent(id)}`, "PATCH", data); }
export async function deleteMainCategory(id: string) { return mutation(`/admin/main-categories/${encodeURIComponent(id)}`, "DELETE"); }
export async function toggleMainCategoryFeatured(id: string, isFeatured: boolean) { return mutation(`/admin/main-categories/${encodeURIComponent(id)}`, "PATCH", { isFeatured }); }
export async function toggleMainCategoryActive(id: string, isActive: boolean) { return mutation(`/admin/main-categories/${encodeURIComponent(id)}`, "PATCH", { isActive }); }

export async function getAdminProducts(): Promise<any[]> {
    const products = await request<any[]>("/admin/products");
    return products.map((product) => ({
        ...product,
        price: Number(product.price ?? 0),
        discountPrice: product.discountPrice == null ? null : Number(product.discountPrice),
        discountValue: product.discountValue == null ? null : Number(product.discountValue),
        stock: Number(product.stock ?? 0),
        minOrder: Number(product.minOrder ?? 1),
    }));
}
export async function getAdminCategories(page = 1, limit = 500) {
    const categories = await request<any[]>(`/admin/categories?page=${page}&limit=${limit}`);
    return { categories: categories.slice((page - 1) * limit, page * limit), pagination: { total: categories.length, pages: Math.ceil(categories.length / limit), page, limit } };
}
export async function getAdminOrders(page = 1, limit = 50) { return request<{ orders: any[]; pagination: any }>(`/admin/orders?page=${page}&limit=${limit}`); }
export async function createProduct(data: ProductInput) { return mutation("/admin/products", "POST", data); }
export async function updateProduct(id: string, data: ProductInput & { isTrending?: boolean }) { return mutation(`/admin/products/${encodeURIComponent(id)}`, "PATCH", data); }
export async function deleteProduct(id: string) { return mutation(`/admin/products/${encodeURIComponent(id)}`, "DELETE"); }
export async function updateOrderStatus(id: string, status: OrderStatus) { return mutation(`/admin/orders/${encodeURIComponent(id)}/status`, "PATCH", { status }); }
export async function deleteOrder(id: string) { return mutation(`/admin/orders/${encodeURIComponent(id)}`, "DELETE"); }
export async function createCategory(data: CategoryInput) { return mutation("/admin/categories", "POST", data); }
export async function updateCategory(id: string, data: CategoryInput) { return mutation(`/admin/categories/${encodeURIComponent(id)}`, "PATCH", data); }
export async function deleteCategory(id: string) { return mutation(`/admin/categories/${encodeURIComponent(id)}`, "DELETE"); }
export async function toggleCategoryFeatured(id: string, isFeatured: boolean) { return mutation(`/admin/categories/${encodeURIComponent(id)}`, "PATCH", { isFeatured }); }

export async function toggleProductTrending(id: string, isTrending: boolean) { return mutation(`/admin/products/${encodeURIComponent(id)}`, "PATCH", { isTrending }); }
export async function getTrendingProducts() { return publicProducts("page=1&limit=32&isTrending=true"); }
export async function getCategoriesForCleanup() { return getAdminCategories(1, 1000).then((result) => result.categories); }
export async function bulkFixCategoryNames(mapping: { id: string; newName: string }[]) {
    const results = await Promise.all(mapping.map(({ id, newName }) => request(`/admin/categories/${encodeURIComponent(id)}`, "PATCH", { name: newName })));
    invalidateAdminData();
    return { success: true, count: results.length };
}
export async function bulkCreateProducts(rows: ProductImportRow[]) {
    try {
        let count = 0;
        for (const row of rows) {
            const result = await request<{ success: boolean; created?: boolean }>("/admin/products/import", "POST", row);
            if (result.success && result.created) count++;
        }
        invalidateAdminData();
        return { success: true as const, count };
    } catch (error) {
        return { success: false as const, error: error instanceof Error ? error.message : "Product import failed" };
    }
}

export async function getAdminBanners() { return request<any[]>("/admin/banners"); }
export async function createBanner(data: BannerInput) { return mutation("/admin/banners", "POST", data); }
export async function updateBanner(id: string, data: BannerInput) { return mutation(`/admin/banners/${encodeURIComponent(id)}`, "PATCH", data); }
export async function deleteBanner(id: string) { return mutation(`/admin/banners/${encodeURIComponent(id)}`, "DELETE"); }
export async function toggleBannerStatus(id: string, isActive: boolean) { return mutation(`/admin/banners/${encodeURIComponent(id)}`, "PATCH", { isActive }); }

export async function getPromoCodes() { return request<any[]>("/admin/promo-codes"); }
export async function createPromoCode(data: PromoCodeInput) { return mutation("/admin/promo-codes", "POST", data); }
export async function updatePromoCode(id: string, data: PromoCodeInput) { return mutation(`/admin/promo-codes/${encodeURIComponent(id)}`, "PATCH", data); }
export async function deletePromoCode(id: string) { return mutation(`/admin/promo-codes/${encodeURIComponent(id)}`, "DELETE"); }
export async function togglePromoCodeStatus(id: string, isActive: boolean) { return mutation(`/admin/promo-codes/${encodeURIComponent(id)}`, "PATCH", { isActive }); }
export async function validatePromoCode(code: string) {
    try { return await request<{ success: boolean; promoCode?: Record<string, any>; error?: string }>("/promotions/validate", "POST", { code }); }
    catch (error) { return { success: false, error: error instanceof Error ? error.message : "Invalid promo code" }; }
}

export async function getAdminUser() { return request<{ user: any }>("/admin/credentials").then((payload) => payload.user); }
export async function updateAdminCredentials(data: { currentPassword: string; newUsername?: string; newPassword?: string }) {
    try { return await request<{ success: true; message: string }>("/admin/credentials", "PATCH", data); }
    catch (error) { return { success: false as const, error: error instanceof Error ? error.message : "Failed to update credentials" }; }
}
export async function updateSiteSettings(data: Record<string, unknown>) { return mutation("/admin/settings", "PUT", data); }

async function bulk(action: string, ids: string[], value?: boolean) {
    try { return await request<{ success: true; count?: number; partial?: boolean; names?: string[] }>("/admin/bulk", "POST", { action, ids, ...(value === undefined ? {} : { value }) }); }
    catch (error) { return { success: false as const, error: error instanceof Error ? error.message : "Bulk update failed" }; }
}
export async function bulkToggleTrending(ids: string[], isTrending: boolean) { return bulk("toggleTrending", ids, isTrending); }
export async function bulkRemoveSale(ids: string[]) { return bulk("removeSale", ids); }
export async function bulkDeleteProducts(ids: string[]) { return bulk("deleteProducts", ids); }
export async function bulkDeleteCategories(ids: string[]) { return bulk("deleteCategories", ids); }

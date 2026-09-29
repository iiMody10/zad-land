export type CatalogSort = "newest" | "bestselling" | "price_asc" | "price_desc";
export type CatalogView = "grid" | "list";
export type CatalogOption = { id: string; slug: string };
export type CatalogBrand = CatalogOption & { mainCategoryId: string | null };
export type CatalogSubcategory = CatalogOption & { brandId: string; mainCategoryId: string | null };

export type CatalogFilters = {
    search: string;
    mainCategoryId: string;
    brandIds: string[];
    categoryIds: string[];
    inStock: boolean;
    onSale: boolean;
    isTrending: boolean;
    sort: CatalogSort;
    view: CatalogView;
};

export const defaultCatalogFilters: CatalogFilters = {
    search: "", mainCategoryId: "", brandIds: [], categoryIds: [],
    inStock: false, onSale: false, isTrending: false, sort: "newest", view: "grid",
};

function resolveMany(value: string | null, options: CatalogOption[]) {
    const requested = new Set((value || "").split(",").map((entry) => entry.trim()).filter(Boolean).slice(0, 30));
    return options.filter((option) => requested.has(option.slug) || requested.has(option.id)).map((option) => option.id);
}

export function availableSubcategories<T extends CatalogSubcategory>(filters: Pick<CatalogFilters, "mainCategoryId" | "brandIds">, categories: T[]): T[] {
    return categories.filter((category) =>
        (!filters.mainCategoryId || category.mainCategoryId === filters.mainCategoryId) &&
        (!filters.brandIds.length || filters.brandIds.includes(category.brandId))
    );
}

export function availableBrands<T extends CatalogBrand>(mainCategoryId: string, brands: T[], categories: CatalogSubcategory[]): T[] {
    return brands.filter((brand) => !mainCategoryId || brand.mainCategoryId === mainCategoryId ||
        categories.some((category) => category.brandId === brand.id && category.mainCategoryId === mainCategoryId));
}

export function reconcileCatalogFilters(filters: CatalogFilters, categories: CatalogSubcategory[], brands: CatalogBrand[]) {
    const allowedBrands = new Set(availableBrands(filters.mainCategoryId, brands, categories).map((brand) => brand.id));
    const brandIds = filters.brandIds.filter((id) => allowedBrands.has(id));
    const next = { ...filters, brandIds };
    const allowedCategories = new Set(availableSubcategories(next, categories).map((category) => category.id));
    return { ...next, categoryIds: next.categoryIds.filter((id) => allowedCategories.has(id)) };
}

export function parseCatalogFilters(
    params: URLSearchParams,
    mainCategories: CatalogOption[],
    brands: CatalogBrand[],
    categories: CatalogSubcategory[]
): CatalogFilters {
    const department = params.get("department") || params.get("mainCategoryId");
    const mainCategoryId = mainCategories.find((option) => option.slug === department || option.id === department)?.id || "";
    const brandIds = resolveMany(params.get("brands") || params.get("brandIds"), brands);
    const categoryIds = resolveMany(params.get("categories") || params.get("categoryIds"), categories);
    const sort = params.get("sort");
    return reconcileCatalogFilters({
        search: (params.get("search") || "").trim().slice(0, 120),
        mainCategoryId, brandIds, categoryIds,
        inStock: params.get("inStock") === "true",
        onSale: params.get("onSale") === "true",
        isTrending: params.get("isTrending") === "true",
        sort: sort === "price_asc" || sort === "price_desc" || sort === "bestselling" ? sort : "newest",
        view: params.get("view") === "list" ? "list" : "grid",
    }, categories, brands);
}

export function buildCatalogUrl(
    filters: CatalogFilters,
    mainCategories: CatalogOption[],
    brands: CatalogOption[],
    categories: CatalogSubcategory[],
    basePath = "/products",
    fixedMainCategoryId = ""
) {
    const params = new URLSearchParams();
    const department = mainCategories.find((option) => option.id === filters.mainCategoryId);
    if (department && department.id !== fixedMainCategoryId) params.set("department", department.slug);
    const brandSlugs = brands.filter((option) => filters.brandIds.includes(option.id)).map((option) => option.slug);
    if (brandSlugs.length) params.set("brands", brandSlugs.join(","));
    const categorySlugs = categories.filter((option) => filters.categoryIds.includes(option.id)).map((option) => option.slug);
    if (categorySlugs.length) params.set("categories", categorySlugs.join(","));
    if (filters.search) params.set("search", filters.search);
    if (filters.sort !== "newest") params.set("sort", filters.sort);
    if (filters.inStock) params.set("inStock", "true");
    if (filters.onSale) params.set("onSale", "true");
    if (filters.isTrending) params.set("isTrending", "true");
    if (filters.view === "list") params.set("view", "list");
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
}

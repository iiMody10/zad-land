"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X as MdClose, ListFilter as MdFilterList, Grid2X2 as MdGridView, ChevronDown as MdKeyboardArrowDown, Search as MdSearch, List as MdViewList } from 'lucide-react';
import ProductCard, { type Product } from "@/app/components/ProductsPageComponents/ProductCard";
import WholesaleProductRow from "@/app/components/ProductsPageComponents/WholesaleProductRow";
import { useLanguage } from "@/app/context/LanguageContext";
import { availableBrands, availableSubcategories, buildCatalogUrl, parseCatalogFilters, reconcileCatalogFilters, type CatalogFilters, type CatalogSort } from "@/lib/catalog-filters";

const CATALOG_BATCH_SIZE = 32;

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
}

interface Props {
    initialCategories: Category[];
    initialSubcategories: { id: string; name: string; slug: string; description: string | null; brandId: string; mainCategoryId: string | null }[];
    initialBrands: { id: string; name: string; slug: string; mainCategoryId: string | null }[];
    initialProducts: Product[];
    initialTotal: number;
    initialQuery: string;
    activeDepartment?: Category;
}

function brandDisplayName(name: string, isArabic: boolean) {
    const parts = name.split(/\s+-\s+/);
    return parts.find((part) => /[\u0600-\u06FF]/.test(part) === isArabic) || name;
}

function createProductsParams(filters: CatalogFilters) {
    const params = new URLSearchParams({ page: "1", limit: String(CATALOG_BATCH_SIZE), sort: filters.sort });
    if (filters.search) params.set("search", filters.search);
    if (filters.mainCategoryId) params.set("mainCategoryId", filters.mainCategoryId);
    if (filters.brandIds.length) params.set("brandIds", filters.brandIds.join(","));
    if (filters.categoryIds.length) params.set("categoryIds", filters.categoryIds.join(","));
    if (filters.inStock) params.set("inStock", "true");
    if (filters.onSale) params.set("onSale", "true");
    if (filters.isTrending) params.set("isTrending", "true");
    return params;
}

export default function CatalogClient({ initialCategories, initialSubcategories, initialBrands, initialProducts, initialTotal, initialQuery, activeDepartment }: Props) {
    const { language, t } = useLanguage();
    const isArabic = language === "ar";
    const basePath = activeDepartment ? `/department/${activeDepartment.slug}` : "/products";
    const fixedMainCategoryId = activeDepartment?.id || "";
    const initialFilters = useMemo(() => {
        const params = new URLSearchParams(initialQuery);
        if (activeDepartment) params.set("department", activeDepartment.slug);
        return parseCatalogFilters(params, initialCategories, initialBrands, initialSubcategories);
    }, [initialQuery, activeDepartment, initialCategories, initialBrands, initialSubcategories]);
    const initialFiltered = buildCatalogUrl(initialFilters, initialCategories, initialBrands, initialSubcategories, basePath, fixedMainCategoryId) !== basePath;
    const initialRequestKey = createProductsParams(initialFilters).toString();
    const [filters, setFilters] = useState<CatalogFilters>(initialFilters);
    const [products, setProducts] = useState(initialFiltered ? [] : initialProducts);
    const [total, setTotal] = useState(initialFiltered ? 0 : initialTotal);
    const [draftSearch, setDraftSearch] = useState(initialFilters.search);
    const [page, setPage] = useState(1);
    const [brandSearch, setBrandSearch] = useState("");
    const [subcategorySearch, setSubcategorySearch] = useState("");
    const [showAllBrands, setShowAllBrands] = useState(false);
    const [showAllSubcategories, setShowAllSubcategories] = useState(false);
    const [brandsOpen, setBrandsOpen] = useState(initialFilters.brandIds.length > 0);
    const [subcategoriesOpen, setSubcategoriesOpen] = useState(initialFilters.categoryIds.length > 0);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [loading, setLoading] = useState(initialFiltered);
    const [loadingMore, setLoadingMore] = useState(false);
    const lastRequestKey = useRef<string | null>(initialFiltered ? null : initialRequestKey);
    const requestId = useRef(0);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const loadingMoreRef = useRef(false);
    const { search, mainCategoryId, brandIds, categoryIds, inStock, onSale, isTrending, sort, view } = filters;
    const activeFilterCount = Number(Boolean(search)) + Number(Boolean(mainCategoryId && !activeDepartment)) + brandIds.length + categoryIds.length + Number(inStock) + Number(onSale) + Number(isTrending);
    const scopedBrands = availableBrands(mainCategoryId, initialBrands, initialSubcategories);
    const visibleBrands = scopedBrands
        .filter((brand) => brand.name.toLocaleLowerCase().includes(brandSearch.trim().toLocaleLowerCase()))
        .sort((a, b) => Number(brandIds.includes(b.id)) - Number(brandIds.includes(a.id)));
    const shownBrands = brandSearch.trim() || showAllBrands ? visibleBrands : visibleBrands.slice(0, 6);
    const brandNames = new Map(initialBrands.map((brand) => [brand.id, brandDisplayName(brand.name, isArabic)]));
    const scopedSubcategories = availableSubcategories(filters, initialSubcategories);
    const visibleSubcategories = scopedSubcategories
        .filter((category) => `${category.name} ${category.description || ""} ${brandNames.get(category.brandId) || ""}`.toLocaleLowerCase().includes(subcategorySearch.trim().toLocaleLowerCase()))
        .sort((a, b) => Number(categoryIds.includes(b.id)) - Number(categoryIds.includes(a.id)));
    const shownSubcategories = subcategorySearch.trim() || showAllSubcategories ? visibleSubcategories : visibleSubcategories.slice(0, 6);

    const updateFilters = (changes: Partial<CatalogFilters>) => {
        const next = reconcileCatalogFilters({ ...filters, ...changes, ...(activeDepartment ? { mainCategoryId: activeDepartment.id } : {}) }, initialSubcategories, initialBrands);
        setFilters(next);
        const url = buildCatalogUrl(next, initialCategories, initialBrands, initialSubcategories, basePath, fixedMainCategoryId);
        if (typeof window !== "undefined" && `${window.location.pathname}${window.location.search}` !== url) {
            window.history.pushState(window.history.state, "", url);
        }
    };

    const addFilters = useCallback((params: URLSearchParams) => {
        if (search) params.set("search", search);
        if (mainCategoryId) params.set("mainCategoryId", mainCategoryId);
        if (brandIds.length) params.set("brandIds", brandIds.join(","));
        if (categoryIds.length) params.set("categoryIds", categoryIds.join(","));
        if (inStock) params.set("inStock", "true");
        if (onSale) params.set("onSale", "true");
        if (isTrending) params.set("isTrending", "true");
    }, [search, mainCategoryId, brandIds, categoryIds, inStock, onSale, isTrending]);

    const resetFilters = () => {
        setDraftSearch("");
        setBrandSearch("");
        setSubcategorySearch("");
        updateFilters({ search: "", mainCategoryId: activeDepartment?.id || "", brandIds: [], categoryIds: [], inStock: false, onSale: false, isTrending: false });
    };

    const toggleBrand = (id: string) => {
        updateFilters({ brandIds: brandIds.includes(id) ? brandIds.filter((value) => value !== id) : [...brandIds, id] });
    };

    const activeSelections: { key: string; label: string; onRemove: () => void }[] = [];
    if (search) activeSelections.push({ key: "search", label: `${isArabic ? "بحث" : "Search"}: ${search}`, onRemove: () => { setDraftSearch(""); updateFilters({ search: "" }); } });
    if (mainCategoryId && !activeDepartment) {
        const category = initialCategories.find((item) => item.id === mainCategoryId);
        if (category) activeSelections.push({ key: "department", label: isArabic ? category.name : category.description || category.name, onRemove: () => updateFilters({ mainCategoryId: "", categoryIds: [] }) });
    }
    brandIds.forEach((id) => {
        const label = brandNames.get(id);
        if (label) activeSelections.push({ key: `brand-${id}`, label, onRemove: () => toggleBrand(id) });
    });
    categoryIds.forEach((id) => {
        const category = initialSubcategories.find((item) => item.id === id);
        if (category) activeSelections.push({ key: `subcategory-${id}`, label: isArabic ? category.name : category.description || category.name, onRemove: () => updateFilters({ categoryIds: categoryIds.filter((value) => value !== id) }) });
    });
    if (inStock) activeSelections.push({ key: "stock", label: isArabic ? "متوفر الآن" : "In stock", onRemove: () => updateFilters({ inStock: false }) });
    if (onSale) activeSelections.push({ key: "sale", label: isArabic ? "عروض" : "On sale", onRemove: () => updateFilters({ onSale: false }) });
    if (isTrending) activeSelections.push({ key: "trending", label: isArabic ? "منتجات رائجة" : "Trending", onRemove: () => updateFilters({ isTrending: false }) });

    useEffect(() => {
        const restore = () => {
            const params = new URLSearchParams(window.location.search);
            if (activeDepartment) params.set("department", activeDepartment.slug);
            const next = parseCatalogFilters(params, initialCategories, initialBrands, initialSubcategories);
            setFilters(next);
            setDraftSearch(next.search);
        };
        window.addEventListener("popstate", restore);
        return () => window.removeEventListener("popstate", restore);
    }, [activeDepartment, initialCategories, initialBrands, initialSubcategories]);

    useEffect(() => {
        if (!mobileFiltersOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMobileFiltersOpen(false);
        };
        window.addEventListener("keydown", closeOnEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [mobileFiltersOpen]);

    useEffect(() => {
        const params = createProductsParams(filters);
        const requestKey = params.toString();
        if (lastRequestKey.current === requestKey) return;
        const controller = new AbortController();
        const currentRequest = ++requestId.current;
        // Deferring one tick lets React Strict Mode cancel its development-only
        // effect replay before a redundant initial catalog request is sent.
        const startRequest = window.setTimeout(() => {
            if (controller.signal.aborted) return;
            lastRequestKey.current = requestKey;
            setLoading(true);
            setPage(1);

            fetch(`/api/products?${params}`, { signal: controller.signal })
                .then((response) => {
                    if (!response.ok) throw new Error("Unable to load products");
                    return response.json();
                })
                .then((data) => {
                    if (currentRequest !== requestId.current) return;
                    setProducts(data.products);
                    setTotal(data.pagination.total);
                })
                .catch((error) => {
                    if (error.name !== "AbortError") console.error("Failed to load catalog", error);
                })
                .finally(() => {
                    if (currentRequest === requestId.current) setLoading(false);
                });
        }, 0);

        return () => {
            window.clearTimeout(startRequest);
            controller.abort();
        };
    }, [filters]);

    const loadMore = useCallback(async () => {
        if (loading || loadingMoreRef.current || products.length >= total) return;
        const currentRequest = requestId.current;
        const nextPage = page + 1;
        const params = new URLSearchParams({
            page: String(nextPage),
            limit: String(CATALOG_BATCH_SIZE),
            sort,
            knownTotal: String(total),
            skipCount: "true",
        });
        addFilters(params);
        loadingMoreRef.current = true;
        setLoadingMore(true);
        try {
            const response = await fetch(`/api/products?${params}`);
            if (!response.ok) throw new Error("Unable to load more products");
            const data = await response.json();
            if (currentRequest !== requestId.current) return;
            setProducts((previous) => [...previous, ...data.products]);
            setPage(nextPage);
        } catch (error) {
            console.error("Failed to load more products", error);
        } finally {
            loadingMoreRef.current = false;
            setLoadingMore(false);
        }
    }, [addFilters, loading, page, products.length, sort, total]);

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target || products.length >= total || typeof IntersectionObserver === "undefined") return;
        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) void loadMore();
        }, { rootMargin: "1200px 0px" });
        observer.observe(target);
        return () => observer.disconnect();
    }, [loadMore, products.length, total]);

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateFilters({ search: draftSearch.trim() });
    };

    const optionClass = (selected: boolean) => `flex min-h-10 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors ${selected
        ? "border-[#cfe3d6] bg-[#edf5ef] font-semibold text-[var(--color-brand)] dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-white"
        : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50 dark:text-zinc-300 dark:hover:border-white/10 dark:hover:bg-white/5"}`;

    const filtersPanel = (scope: string) => (
        <div className="space-y-5">
            {scope === "desktop" ? <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf5ef] text-xl text-[var(--color-brand)] dark:bg-emerald-950/40 dark:text-emerald-300"><MdFilterList aria-hidden="true" /></span>
                    <div>
                        <h2 className="text-base font-extrabold text-[var(--color-brand)] dark:text-white">{isArabic ? "تصفية المنتجات" : "Filter products"}</h2>
                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">{isArabic ? "تتغير النتائج فوراً" : "Results update as you select"}</p>
                    </div>
                </div>
                {activeFilterCount > 0 && <button type="button" onClick={resetFilters} className="shrink-0 pt-1 text-xs font-bold text-[var(--color-brand-hover)] hover:underline dark:text-emerald-300">{isArabic ? "مسح الكل" : "Clear all"}</button>}
            </div> : <div className="flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-zinc-400">
                <span>{activeFilterCount > 0 ? `${activeFilterCount} ${isArabic ? (activeFilterCount === 1 ? "فلتر محدد" : "فلاتر محددة") : (activeFilterCount === 1 ? "filter selected" : "filters selected")}` : (isArabic ? "تتغير النتائج فوراً" : "Results update as you select")}</span>
                {activeFilterCount > 0 && <button type="button" onClick={resetFilters} className="font-bold text-[var(--color-brand-hover)] dark:text-emerald-300">{isArabic ? "مسح الكل" : "Clear all"}</button>}
            </div>}

            {activeDepartment ? <section className="border-t border-slate-100 pt-5 dark:border-white/10" aria-label={isArabic ? "الأقسام" : "Departments"}>
                <h3 className="mb-3 text-sm font-bold text-[var(--color-brand)] dark:text-white">{isArabic ? "الأقسام" : "Departments"}</h3>
                <div className="space-y-1">
                    <Link href="/products" className={optionClass(false)}>{t("products.allProducts")}</Link>
                    {initialCategories.map((category) => (
                        <Link key={category.id} href={`/department/${category.slug}`} aria-current={activeDepartment.id === category.id ? "page" : undefined} className={optionClass(activeDepartment.id === category.id)}>
                            {isArabic ? category.name : category.description || category.name}
                        </Link>
                    ))}
                </div>
            </section> : <fieldset className="border-t border-slate-100 pt-5 dark:border-white/10">
                <legend className="mb-3 text-sm font-bold text-[var(--color-brand)] dark:text-white">{isArabic ? "الأقسام" : "Departments"}</legend>
                <div className="space-y-1">
                    <label className={optionClass(!mainCategoryId)}>
                        <input type="radio" name={`catalog-category-${scope}`} checked={!mainCategoryId} onChange={() => updateFilters({ mainCategoryId: "", categoryIds: [] })} className="size-4 shrink-0 accent-[var(--color-brand-hover)]" />
                        <span>{t("products.allProducts")}</span>
                    </label>
                    {initialCategories.map((category) => (
                        <label key={category.id} className={optionClass(mainCategoryId === category.id)}>
                            <input type="radio" name={`catalog-category-${scope}`} checked={mainCategoryId === category.id} onChange={() => updateFilters({ mainCategoryId: category.id })} className="size-4 shrink-0 accent-[var(--color-brand-hover)]" />
                            <span>{isArabic ? category.name : category.description || category.name}</span>
                        </label>
                    ))}
                </div>
            </fieldset>}

            <details className="group border-t border-slate-100 pt-5 dark:border-white/10" open={brandsOpen} onToggle={(event) => setBrandsOpen(event.currentTarget.open)}>
                <summary className="mb-3 flex cursor-pointer list-none items-center justify-between text-sm font-bold text-[var(--color-brand)] dark:text-white [&::-webkit-details-marker]:hidden">
                    <span>{isArabic ? "العلامات التجارية" : "Brands"} <span className="text-xs font-medium text-slate-400">({scopedBrands.length})</span></span>
                    <MdKeyboardArrowDown aria-hidden="true" className="text-xl text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                {scopedBrands.length > 6 && <div className="relative mb-3">
                    <MdSearch aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-3 my-auto text-lg text-slate-400" />
                    <input type="search" value={brandSearch} onChange={(event) => setBrandSearch(event.target.value)} placeholder={isArabic ? "ابحث عن علامة تجارية" : "Search brands"} aria-label={isArabic ? "ابحث عن علامة تجارية" : "Search brands"} className="h-10 w-full rounded-xl border border-slate-200 bg-white ps-9 pe-3 text-sm outline-none focus:border-[var(--color-brand-hover)] dark:border-white/15 dark:bg-zinc-900 dark:text-white" />
                </div>}
                <div className="space-y-1">
                    {shownBrands.map((brand) => (
                        <label key={brand.id} className={optionClass(brandIds.includes(brand.id))}>
                            <input type="checkbox" checked={brandIds.includes(brand.id)} onChange={() => toggleBrand(brand.id)} className="size-4 shrink-0 accent-[var(--color-brand-hover)]" />
                            <span className="min-w-0 truncate">{brandNames.get(brand.id)}</span>
                        </label>
                    ))}
                    {visibleBrands.length === 0 && <p className="px-3 py-2 text-sm text-slate-500">{isArabic ? "لا توجد علامات مطابقة" : "No matching brands"}</p>}
                </div>
                {!brandSearch.trim() && visibleBrands.length > 6 && <button type="button" onClick={() => setShowAllBrands((value) => !value)} aria-expanded={showAllBrands} className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs font-bold text-[var(--color-brand-hover)] hover:bg-[#edf5ef] dark:text-emerald-300 dark:hover:bg-white/5">
                    {showAllBrands ? (isArabic ? "عرض أقل" : "Show less") : (isArabic ? `عرض كل العلامات (${visibleBrands.length})` : `Show all brands (${visibleBrands.length})`)}
                    <MdKeyboardArrowDown aria-hidden="true" className={`text-lg transition-transform ${showAllBrands ? "rotate-180" : ""}`} />
                </button>}
            </details>

            <details className="group border-t border-slate-100 pt-5 dark:border-white/10" open={subcategoriesOpen} onToggle={(event) => setSubcategoriesOpen(event.currentTarget.open)}>
                <summary className="mb-3 flex cursor-pointer list-none items-center justify-between text-sm font-bold text-[var(--color-brand)] dark:text-white [&::-webkit-details-marker]:hidden">
                    <span>{isArabic ? "الأصناف الفرعية" : "Subcategories"} <span className="text-xs font-medium text-slate-400">({scopedSubcategories.length})</span></span>
                    <MdKeyboardArrowDown aria-hidden="true" className="text-xl text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                {scopedSubcategories.length > 8 && <div className="relative mb-3">
                    <MdSearch aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-3 my-auto text-lg text-slate-400" />
                    <input type="search" value={subcategorySearch} onChange={(event) => setSubcategorySearch(event.target.value)} placeholder={isArabic ? "ابحث عن صنف فرعي" : "Search subcategories"} aria-label={isArabic ? "ابحث عن صنف فرعي" : "Search subcategories"} className="h-10 w-full rounded-xl border border-slate-200 bg-white ps-9 pe-3 text-sm outline-none focus:border-[var(--color-brand-hover)] dark:border-white/15 dark:bg-zinc-900 dark:text-white" />
                </div>}
                <div className="space-y-1">
                    {shownSubcategories.map((category) => (
                        <label key={category.id} className={optionClass(categoryIds.includes(category.id))}>
                            <input type="checkbox" checked={categoryIds.includes(category.id)} onChange={() => updateFilters({ categoryIds: categoryIds.includes(category.id) ? categoryIds.filter((id) => id !== category.id) : [...categoryIds, category.id] })} className="size-4 shrink-0 accent-[var(--color-brand-hover)]" />
                            <span className="min-w-0 leading-snug"><span className="block">{isArabic ? category.name : category.description || category.name}</span>{brandIds.length === 0 && <span className="mt-0.5 block text-[11px] font-normal text-slate-500 dark:text-zinc-400">{brandNames.get(category.brandId)}</span>}</span>
                        </label>
                    ))}
                    {visibleSubcategories.length === 0 && <p className="px-3 py-2 text-sm text-slate-500">{isArabic ? "لا توجد أصناف مطابقة" : "No matching subcategories"}</p>}
                </div>
                {!subcategorySearch.trim() && visibleSubcategories.length > 6 && <button type="button" onClick={() => setShowAllSubcategories((value) => !value)} aria-expanded={showAllSubcategories} className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs font-bold text-[var(--color-brand-hover)] hover:bg-[#edf5ef] dark:text-emerald-300 dark:hover:bg-white/5">
                    {showAllSubcategories ? (isArabic ? "عرض أقل" : "Show less") : (isArabic ? `عرض كل الأصناف (${visibleSubcategories.length})` : `Show all subcategories (${visibleSubcategories.length})`)}
                    <MdKeyboardArrowDown aria-hidden="true" className={`text-lg transition-transform ${showAllSubcategories ? "rotate-180" : ""}`} />
                </button>}
            </details>

            <fieldset className="border-t border-slate-100 pt-5 dark:border-white/10">
                <legend className="mb-3 text-sm font-bold text-[var(--color-brand)] dark:text-white">{isArabic ? "التوفر والعروض" : "Availability & offers"}</legend>
                <div className="space-y-1">
                    {([
                        ["inStock", inStock, isArabic ? "متوفر الآن" : "In stock"],
                        ["onSale", onSale, isArabic ? "عروض" : "On sale"],
                        ["isTrending", isTrending, isArabic ? "منتجات رائجة" : "Trending"],
                    ] as const).map(([key, checked, label]) => (
                        <label key={key} className={optionClass(checked)}>
                            <input type="checkbox" checked={checked} onChange={(event) => updateFilters({ [key]: event.target.checked })} className="size-4 shrink-0 accent-[var(--color-brand-hover)]" />
                            <span>{label}</span>
                        </label>
                    ))}
                </div>
            </fieldset>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafbf9] pb-16 dark:bg-[var(--color-background-dark)]">
            <div className="container-custom pt-5 md:pt-7">
                <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                    <Link href="/" className="transition-colors hover:text-[var(--color-accent)]">{isArabic ? "الرئيسية" : "Home"}</Link>
                    <span aria-hidden="true">/</span>
                    {activeDepartment ? <><Link href="/products" className="transition-colors hover:text-[var(--color-accent)]">{t("products.allProducts")}</Link><span aria-hidden="true">/</span><span className="font-semibold text-[var(--color-brand)] dark:text-white">{isArabic ? activeDepartment.name : activeDepartment.description || activeDepartment.name}</span></> : <span className="font-semibold text-[var(--color-brand)] dark:text-white">{t("products.allProducts")}</span>}
                </nav>

                <div className="mb-6 flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-brand)] dark:text-white sm:text-3xl">{activeDepartment ? (isArabic ? activeDepartment.name : activeDepartment.description || activeDepartment.name) : t("products.allProducts")}</h1>
                    <p className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400" aria-live="polite">
                        {loading ? (isArabic ? "جارٍ تحديث النتائج" : "Updating results") : `${total.toLocaleString(isArabic ? "ar-SY-u-nu-latn" : "en-US")} ${isArabic ? "منتج" : "products"}`}
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[272px_minmax(0,1fr)] xl:grid-cols-[288px_minmax(0,1fr)] xl:gap-8">
                    <aside aria-label={isArabic ? "تصفية المنتجات" : "Product filters"} className="hidden self-start overscroll-contain rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-[top] duration-300 ease-out dark:border-white/10 dark:bg-[var(--color-surface-dark)] lg:sticky lg:top-[var(--site-header-sticky-offset)] lg:block lg:max-h-[calc(100vh-var(--site-header-sticky-offset)-1rem)] lg:overflow-y-auto xl:p-5">
                        {filtersPanel("desktop")}
                    </aside>

                <section aria-label={isArabic ? "كتالوج المنتجات" : "Product catalog"} className="min-w-0">
                    <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[var(--color-surface-dark)] sm:p-3.5 xl:flex-row xl:items-center xl:justify-between">
                        <form onSubmit={submitSearch} role="search" className="flex h-11 w-full overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-[var(--color-brand-hover)] focus-within:ring-2 focus-within:ring-[var(--color-brand-hover)]/10 dark:border-white/15 dark:bg-zinc-900 xl:max-w-[400px] 2xl:max-w-[480px]">
                            <MdSearch aria-hidden="true" className="mx-3.5 my-auto shrink-0 text-xl text-slate-400" />
                            <input
                                type="search"
                                value={draftSearch}
                                onChange={(event) => setDraftSearch(event.target.value)}
                                placeholder={isArabic ? "ابحث في المنتجات..." : "Search products..."}
                                aria-label={isArabic ? "ابحث في المنتجات" : "Search products"}
                                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-brand)] outline-none placeholder:text-slate-400 dark:text-white"
                            />
                            <button type="submit" className="m-1 rounded-lg bg-[var(--color-brand)] px-5 text-xs font-bold text-white transition-colors hover:bg-[var(--color-accent)] sm:text-sm">
                                {isArabic ? "بحث" : "Search"}
                            </button>
                        </form>

                        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 lg:flex lg:justify-end">
                            <button type="button" onClick={() => setMobileFiltersOpen(true)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 text-sm font-semibold text-[var(--color-brand)] transition-colors hover:border-[var(--color-brand-hover)] dark:border-white/15 dark:bg-zinc-900 dark:text-white lg:hidden sm:px-3" aria-label={isArabic ? "افتح الفلاتر" : "Open filters"}>
                                <MdFilterList aria-hidden="true" className="text-lg" />
                                <span>{isArabic ? "تصفية" : "Filters"}</span>{activeFilterCount > 0 && <span className="min-w-5 rounded-full bg-[var(--color-brand)] px-1.5 text-center text-[11px] leading-5 text-white">{activeFilterCount}</span>}
                            </button>
                            <div role="group" aria-label={isArabic ? "طريقة العرض" : "Catalog view"} className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-white/15 dark:bg-zinc-900">
                                <button type="button" onClick={() => updateFilters({ view: "grid" })} aria-label={isArabic ? "عرض الشبكة" : "Grid view"} aria-pressed={view === "grid"} className={`flex size-8 items-center justify-center rounded-lg text-lg transition-colors ${view === "grid" ? "bg-white text-[var(--color-brand)] shadow-sm dark:bg-zinc-700" : "text-slate-500 hover:text-[var(--color-brand)]"}`}><MdGridView /></button>
                                <button type="button" onClick={() => updateFilters({ view: "list" })} aria-label={isArabic ? "عرض قائمة الجملة" : "Wholesale list view"} aria-pressed={view === "list"} className={`flex size-8 items-center justify-center rounded-lg text-lg transition-colors ${view === "list" ? "bg-white text-[var(--color-brand)] shadow-sm dark:bg-zinc-700" : "text-slate-500 hover:text-[var(--color-brand)]"}`}><MdViewList /></button>
                            </div>
                            <label className="flex h-11 min-w-0 items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-300 sm:text-sm">
                                <span className="hidden shrink-0 sm:inline">{isArabic ? "ترتيب حسب" : "Sort by"}</span>
                                <select
                                    value={sort}
                                    onChange={(event) => updateFilters({ sort: event.target.value as CatalogSort })}
                                    aria-label={isArabic ? "ترتيب حسب" : "Sort by"}
                                    className="h-11 w-full min-w-0 max-w-[170px] cursor-pointer rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-[var(--color-brand)] outline-none transition-colors focus:border-[var(--color-brand-hover)] dark:border-white/15 dark:bg-zinc-900 dark:text-white sm:px-3 sm:text-sm sm:max-w-none"
                                >
                                <option value="newest">{t("products.newestArrivals")}</option>
                                <option value="bestselling">{t("products.bestSellers")}</option>
                                <option value="price_asc">{t("products.priceLowHigh")}</option>
                                    <option value="price_desc">{t("products.priceHighLow")}</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    {activeSelections.length > 0 && <div className="mb-5 flex flex-wrap items-center gap-2" aria-label={isArabic ? "الفلاتر المختارة" : "Applied filters"}>
                        {activeSelections.map((selection) => <button key={selection.key} type="button" onClick={selection.onRemove} className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#cfe3d6] bg-[#edf5ef] px-3 py-1.5 text-xs font-semibold text-[var(--color-brand)] transition-colors hover:border-[var(--color-brand-hover)] dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-white" aria-label={`${isArabic ? "إزالة" : "Remove"} ${selection.label}`}>
                            <span className="truncate">{selection.label}</span><MdClose aria-hidden="true" className="shrink-0 text-base" />
                        </button>)}
                        {activeSelections.length > 1 && <button type="button" onClick={resetFilters} className="px-2 py-1 text-xs font-bold text-[var(--color-brand-hover)] hover:underline dark:text-emerald-300">{isArabic ? "مسح الكل" : "Clear all"}</button>}
                    </div>}

                    {products.length === 0 && loading ? (
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-20 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-zinc-900" aria-busy="true">{isArabic ? "جارٍ تحميل المنتجات..." : "Loading products..."}</div>
                    ) : products.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-20 text-center dark:border-white/10 dark:bg-zinc-900">
                            <MdSearch className="mx-auto mb-3 text-3xl text-slate-400" />
                            <h2 className="text-lg font-semibold text-[var(--color-brand)] dark:text-white">{isArabic ? "لم نجد منتجات مطابقة" : "No matching products"}</h2>
                            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">{isArabic ? "جرّب تغيير البحث أو إزالة بعض الفلاتر." : "Try changing your search or clearing some filters."}</p>
                        </div>
                    ) : (
                        <div className={view === "list" ? "flex flex-col gap-3" : "grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4"} aria-busy={loading}>
                            {products.map((product) => view === "list" ? <WholesaleProductRow key={product.id} product={product} /> : <ProductCard key={product.id} product={product} variant="compact" />)}
                        </div>
                    )}

                    {products.length < total && (
                        <div ref={loadMoreRef} className="flex min-h-16 items-center justify-center py-5" aria-live="polite" aria-busy={loadingMore}>
                            {loadingMore && <span className="text-sm text-slate-500 dark:text-zinc-400">{isArabic ? "جارٍ تحميل المزيد من المنتجات..." : "Loading more products..."}</span>}
                        </div>
                    )}
                </section>
                </div>
            </div>
            {mobileFiltersOpen && <div className="fixed inset-0 z-[100] lg:hidden">
                <button type="button" aria-label={isArabic ? "أغلق الفلاتر" : "Close filters"} onClick={() => setMobileFiltersOpen(false)} className="absolute inset-0 bg-black/45" />
                <aside role="dialog" aria-modal="true" aria-label={isArabic ? "تصفية المنتجات" : "Product filters"} className="absolute inset-y-0 start-0 flex w-[min(90vw,400px)] flex-col bg-white shadow-2xl dark:bg-[var(--color-surface-dark)]">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-white/10">
                        <div className="flex items-center gap-2 text-base font-extrabold text-[var(--color-brand)] dark:text-white"><MdFilterList aria-hidden="true" className="text-xl" />{isArabic ? "تصفية المنتجات" : "Filter products"}</div>
                        <button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label={isArabic ? "أغلق الفلاتر" : "Close filters"} className="rounded-lg p-2 text-xl text-[var(--color-brand)] hover:bg-slate-100 dark:text-white dark:hover:bg-white/10"><MdClose /></button>
                    </div>
                    <div className="flex-1 overscroll-contain overflow-y-auto p-5">{filtersPanel("mobile")}</div>
                    <div className="border-t border-slate-100 p-4 dark:border-white/10"><button type="button" onClick={() => setMobileFiltersOpen(false)} className="w-full rounded-xl bg-[var(--color-brand-hover)] py-3 text-sm font-bold text-white">{loading ? (isArabic ? "جارٍ تحديث النتائج..." : "Updating results...") : (isArabic ? `عرض ${total} منتج` : `Show ${total} products`)}</button></div>
                </aside>
            </div>}
        </div>
    );
}

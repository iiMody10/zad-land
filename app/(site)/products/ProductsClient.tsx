"use client";

import React, { useEffect, useState, useRef } from "react";
import ProductsBreadcrumbs from "@/app/components/ProductsPageComponents/ProductsBreadcrumbs";
import BrandHeroHeader from "@/app/components/ProductsPageComponents/BrandHeroHeader";
import ProductsHeader from "@/app/components/ProductsPageComponents/ProductsHeader";
import CategorySelector from "@/app/components/ProductsPageComponents/CategorySelector";
import EditorialProductCard from "@/app/components/ProductsPageComponents/EditorialProductCard";
import CustomSortDropdown from "@/app/components/ProductsPageComponents/CustomSortDropdown";
import { useLanguage } from "@/app/context/LanguageContext";
import { SearchX as MdSearchOff } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
}

interface Product {
    id: string;
    slug: string;
    name: string;
    nameAr?: string | null;
    nameEn?: string | null;
    description: string | null;
    descriptionAr?: string | null;
    descriptionEn?: string | null;
    price: string;
    discountPrice?: string | null;
    images: string;
    brandId: string;
    categoryId: string;
    mainCategoryId?: string | null;
    options?: string | null;
    stock: number;
    isTrending: boolean;
    brand?: Brand | null;
}

interface Brand {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    group: string;
}

interface ProductsClientProps {
    initialCategories: Category[];
    initialProducts: Product[];
    initialTotal: number;
    activeCategory?: Category | null;
    activeBrand?: Brand | null;
    activeMainCategory?: { id: string; name: string; slug: string; description?: string | null; image?: string | null } | null;
}

const ProductsClient = ({
    initialCategories,
    initialProducts,
    initialTotal,
    activeCategory = null,
    activeBrand = null,
    activeMainCategory = null,
}: ProductsClientProps) => {
    const { t, language } = useLanguage();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [sort, setSort] = useState("best_sellers");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalProducts, setTotalProducts] = useState(initialTotal);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const observerRef = useRef<HTMLDivElement>(null);

    const hasMore = products.length < totalProducts;

    const fetchProducts = async (reset = false) => {
        setLoading(true);

        try {
            const currentPage = reset ? 1 : page;
            const categoryQuery = activeCategory ? `&categoryIds=${activeCategory.id}` : "";
            const brandQuery = activeBrand ? `&brandIds=${activeBrand.id}` : "";
            const mainCategoryQuery = activeMainCategory ? `&mainCategoryId=${activeMainCategory.id}` : "";

            let sortQuery = "";
            if (sort === "price_asc") sortQuery = "&sort=price_asc";
            else if (sort === "price_desc") sortQuery = "&sort=price_desc";
            else if (sort === "newest") sortQuery = "&sort=newest";

            const countParams = (!reset && currentPage > 1) ? `&knownTotal=${totalProducts}&skipCount=true` : "";
            const response = await fetch(`/api/products?page=${currentPage}&limit=12${categoryQuery}${brandQuery}${mainCategoryQuery}${sortQuery}${countParams}`);

            if (response.ok) {
                const data = await response.json();
                if (reset) {
                    setProducts(data.products);
                } else {
                    setProducts((previousProducts) => [...previousProducts, ...data.products]);
                }
                if (data.pagination?.total !== undefined) {
                    setTotalProducts(data.pagination.total);
                }
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isInitialRender) {
            setIsInitialRender(false);
            if (sort !== "best_sellers") {
                setPage(1);
                fetchProducts(true);
            }
            return;
        }

        setPage(1);
        fetchProducts(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort]);

    useEffect(() => {
        if (page > 1) {
            fetchProducts(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    // IntersectionObserver for Automatic Infinite Scroll
    useEffect(() => {
        if (!hasMore || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { rootMargin: "1000px" } // Early trigger 1000px before reaching the end for seamless loading
        );

        const currentRef = observerRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [hasMore, loading]);

    const sortOptions = [
        { id: "best_sellers", label: t('products.bestSellers') },
        { id: "newest", label: t('products.newestArrivals') },
        { id: "price_asc", label: language === 'ar' ? 'السعر: الأقل للأعلى' : 'Price: Low to High' },
        { id: "price_desc", label: language === 'ar' ? 'السعر: الأعلى للأقل' : 'Price: High to Low' },
    ];

    const getHeadingTitle = () => {
        if (activeCategory) {
            return language === 'ar' 
                ? activeCategory.name 
                : (activeCategory.description || (activeCategory as any).nameEn || activeCategory.name);
        }
        if (activeMainCategory) {
            return language === 'ar' 
                ? activeMainCategory.name 
                : (activeMainCategory.description || activeMainCategory.name);
        }
        if (activeBrand) {
            return activeBrand.name;
        }
        return t("products.allProducts");
    };

    return (
        <div className="flex-1 container-custom py-4 md:py-6">
            <ProductsBreadcrumbs 
                activeCategory={activeCategory} 
                activeBrand={activeBrand}
                activeMainCategory={activeMainCategory}
            />

            {activeBrand ? (
                <BrandHeroHeader brand={activeBrand} totalProducts={totalProducts} />
            ) : (
                <ProductsHeader />
            )}

            <CategorySelector 
                categories={initialCategories} 
                activeCategory={activeCategory} 
                activeMainCategory={activeMainCategory}
                activeBrand={activeBrand}
            />

            <div className="flex-1 mt-4">
                {/* Title & Sort Bar */}
                <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-gray-100 dark:border-white/10">
                    <div>
                        {!(activeBrand && !activeCategory && !activeMainCategory) && (
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                {getHeadingTitle()}
                            </h1>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                            {products.length} / {totalProducts} {t("products.results")}
                        </p>
                    </div>
                    
                    {/* Theme-Aligned Custom Dropdown Sort Menu */}
                    <CustomSortDropdown
                        sort={sort}
                        setSort={setSort}
                        options={sortOptions}
                    />
                </div>

                {/* Empty State */}
                {products.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-white/5 my-6">
                        <MdSearchOff className="text-4xl text-gray-400 mb-3" />
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                            {activeCategory ? t("products.noProductsInCategory") : t("products.noProducts")}
                        </h3>
                        <p className="text-xs text-gray-500">
                            Please check back later or try a different category.
                        </p>
                    </div>
                )}

                {/* Modern Clean Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                    {products.map((product) => (
                        <EditorialProductCard 
                            key={product.id} 
                            product={product} 
                        />
                    ))}
                </div>

                {/* Automatic Infinite Scroll Trigger & Spinner */}
                {hasMore && (
                    <div ref={observerRef} className="mt-10 py-6 flex items-center justify-center">
                        <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-900 px-4 py-2 rounded-full border border-gray-100 dark:border-white/5">
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <span>{language === 'ar' ? 'جاري تحميل المزيد من المنتجات...' : 'Loading more products...'}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsClient;

import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import CatalogClient from "./CatalogClient";
import { getCatalogBrands, getCatalogCategories, getCatalogInitialData } from "@/lib/catalog";
import { findCategoryByIdentifier } from "@/lib/category-utils";

import { Metadata } from "next";

export const revalidate = 60; // Revalidate cache every 60 seconds

export const metadata: Metadata = {
    title: "كتالوج المنتجات وعروض الجملة | Products Catalog - Zad Land",
    description: "تصفح كافة منتجات المواد الغذائية، المعلبات، اللحوم، الباستا، الحلويات، والمشروبات بأسعار الجملة المعتمدة لدى شركة زاد لاند.",
    alternates: {
        canonical: "/products",
    },
    openGraph: {
        title: "كتالوج المنتجات وعروض الجملة | Zad Land",
        description: "تصفح كافة منتجات المواد الغذائية والاستهلاكية بأسعار الجملة المعتمدة لدى شركة زاد لاند.",
        url: "/products",
        images: [
            {
                url: "/logo.png",
                width: 400,
                height: 267,
                type: "image/png",
                alt: "Zad Land logo | شعار زاد لاند",
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "كتالوج المنتجات وعروض الجملة | Zad Land",
        description: "تصفح كافة منتجات المواد الغذائية والاستهلاكية بأسعار الجملة المعتمدة لدى شركة زاد لاند.",
        images: ["/logo.png"],
    },
};

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const category = typeof params.category === "string" ? params.category : null;

    if (category) {
        const resolvedCategory = await findCategoryByIdentifier(category);
        redirect(resolvedCategory ? `/categories/${resolvedCategory.slug}` : "/products");
    }

    const { categories, products, totalProducts } = await getCatalogInitialData(undefined, undefined, undefined, 32);
    const [brands, subcategories] = await Promise.all([
        getCatalogBrands(),
        getCatalogCategories(),
    ]);
    const initialQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (typeof value === "string" && key !== "category") initialQuery.set(key, value);
    }

    return (
        <Suspense fallback={<CatalogLoadingFallback />}>
            <CatalogClient
                key={initialQuery.toString()}
                initialCategories={categories}
                initialSubcategories={subcategories.map(({ id, name, slug, description, brandId, mainCategoryId }) => ({ id, name, slug, description, brandId, mainCategoryId }))}
                initialBrands={brands.map(({ id, name, slug, mainCategory }) => ({ id, name, slug, mainCategoryId: mainCategory?.id || null }))}
                initialProducts={products}
                initialTotal={totalProducts}
                initialQuery={initialQuery.toString()}
            />
        </Suspense>
    );
}

function CatalogLoadingFallback() {
    return (
        <div className="min-h-screen bg-[#fafbf9] pb-16 dark:bg-[var(--color-background-dark)]" aria-busy="true">
            <div className="container-custom animate-pulse pt-5 md:pt-7">
                <div className="mb-4 h-3 w-36 rounded bg-gray-100 dark:bg-white/10" />
                <div className="mb-6 h-9 w-48 rounded bg-gray-100 dark:bg-white/10" />
                <div className="grid gap-6 lg:grid-cols-[272px_minmax(0,1fr)] xl:grid-cols-[288px_minmax(0,1fr)] xl:gap-8">
                    <div className="hidden h-[560px] rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 lg:block" />
                    <div>
                        <div className="mb-5 flex justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                            <div className="h-11 w-[440px] max-w-full rounded-xl bg-gray-100 dark:bg-white/10" />
                            <div className="h-11 w-44 rounded-xl bg-gray-100 dark:bg-white/10" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="rounded-2xl border border-gray-200 p-3 dark:border-white/10">
                                    <div className="aspect-square rounded-xl bg-gray-100 dark:bg-white/5" />
                                    <div className="space-y-3 pt-4">
                                        <div className="h-3 w-20 rounded bg-gray-100 dark:bg-white/10" />
                                        <div className="h-4 w-full rounded bg-gray-100 dark:bg-white/10" />
                                        <div className="h-4 w-2/3 rounded bg-gray-100 dark:bg-white/10" />
                                        <div className="h-9 rounded-xl bg-gray-100 dark:bg-white/10" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

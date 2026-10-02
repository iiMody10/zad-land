import { Metadata } from "next";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductsClient from "../../products/ProductsClient";
import { getCatalogInitialData, getCategoryBySlug } from "@/lib/catalog";

export const revalidate = 60; // Revalidate cache every 60 seconds

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const params = await props.params;
    const category = await getCategoryBySlug(params.slug);

    if (!category) {
        return {
            title: "Category Not Found | Zad Land",
        };
    }

    const title = `${category.name} | Zad Land - زاد لاند`;
    const description = category.description 
        ? `${category.name} (${category.description}). تسوق منتجات القسم بأسعار الجملة المعتمدة لدى شركة زاد لاند.`
        : `تصفح تشكيلة ${category.name} بأسعار الجملة المعتمدة لدى شركة زاد لاند لتجارة وتوزيع المواد الغذائية.`;
    const image = category.image || '/logo.png';

    return {
        title,
        description,
        alternates: {
            canonical: `/categories/${category.slug}`,
        },
        openGraph: {
            title,
            description,
            type: 'website',
            url: `/categories/${category.slug}`,
            images: [
                {
                    url: image,
                    alt: category.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    };
}

export default async function CategoryPage(
    props: { params: Promise<{ slug: string }> }
) {
    const params = await props.params;
    const activeCategory = await getCategoryBySlug(params.slug);

    if (!activeCategory) {
        notFound();
    }

    const { categories, products, totalProducts } = await getCatalogInitialData(
        activeCategory.id,
        activeCategory.brandId || undefined
    );

    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <ProductsClient
                key={activeCategory.slug}
                initialCategories={categories}
                initialProducts={products}
                initialTotal={totalProducts}
                activeCategory={activeCategory}
                activeBrand={activeCategory.brand}
            />
        </Suspense>
    );
}

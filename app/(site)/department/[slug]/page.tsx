import { cache } from "react";
import { notFound } from "next/navigation";
import { laravelJson } from "@/lib/laravel-server";
import CatalogClient from "../../products/CatalogClient";
import { getCatalogBrands, getCatalogCategories, getCatalogInitialData } from "@/lib/catalog";

export const revalidate = 60;

const getDepartment = cache(async (slug: string) => {
    const departments = await laravelJson<Array<Record<string, any>>>("/api/main-categories", [], { forwardSession: false });
    return departments.find((department) => department.slug === slug) || null;
});

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const department = await getDepartment(params.slug);

    if (!department) return { title: "Department Not Found | Zad Land" };

    const title = `${department.name} | Zad Land - زاد لاند`;
    const description = department.description || `تصفح منتجات قسم ${department.name} بأسعار الجملة المعتمدة لدى شركة زاد لاند لتجارة وتوزيع المواد الغذائية.`;
    const image = department.image || '/og-image.jpg';

    return {
        title,
        description,
        alternates: {
            canonical: `/department/${department.slug}`,
        },
        openGraph: {
            title,
            description,
            type: 'website',
            url: `/department/${department.slug}`,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: department.name,
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

export default async function DepartmentPage(props: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const [params, searchParams] = await Promise.all([props.params, props.searchParams]);
    const department = await getDepartment(params.slug);

    if (!department || !department.isActive) {
        notFound();
    }

    const { categories, products, totalProducts } = await getCatalogInitialData(undefined, undefined, department.id, 32);
    const [brands, subcategories] = await Promise.all([
        getCatalogBrands(),
        getCatalogCategories(),
    ]);
    const mainCategories = categories.some((category) => category.id === department.id)
        ? categories
        : [...categories, { id: department.id, name: department.name, slug: department.slug, description: department.description, image: department.image }];
    const initialQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
        if (typeof value === "string" && key !== "department" && key !== "mainCategoryId") initialQuery.set(key, value);
    }

    return (
        <CatalogClient
            key={`${department.id}-${initialQuery.toString()}`}
            activeDepartment={{
                id: department.id,
                name: department.name,
                slug: department.slug,
                description: department.description,
                image: department.image,
            }}
            initialCategories={mainCategories}
            initialSubcategories={subcategories.map(({ id, name, slug, description, brandId, mainCategoryId }) => ({ id, name, slug, description, brandId, mainCategoryId }))}
            initialBrands={brands.map(({ id, name, slug, mainCategory }) => ({ id, name, slug, mainCategoryId: mainCategory?.id || null }))}
            initialProducts={products}
            initialTotal={totalProducts}
            initialQuery={initialQuery.toString()}
        />
    );
}

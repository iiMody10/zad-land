import { Metadata } from "next";
import { notFound } from "next/navigation";
import BrandShowcaseClient from "@/app/components/BrandPageComponents/BrandShowcaseClient";
import { getBrandBySlug, getCatalogInitialData } from "@/lib/catalog";

export const revalidate = 60; // Revalidate cache every 60 seconds

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const params = await props.params;
    const brand = await getBrandBySlug(params.slug);

    if (!brand) {
        return {
            title: "Brand Not Found | Zad Land",
        };
    }

    const title = `${brand.name} | Zad Land - زاد لاند`;
    const description = brand.description || `تصفح كتالوج منتجات ${brand.name} بأسعار الجملة المعتمدة لدى شركة زاد لاند لتجارة وتوزيع المواد الغذائية.`;
    const image = brand.image || '/logo.png';

    return {
        title,
        description,
        alternates: {
            canonical: `/brands/${brand.slug}`,
        },
        openGraph: {
            title,
            description,
            type: 'website',
            url: `/brands/${brand.slug}`,
            images: [
                {
                    url: image,
                    alt: brand.name,
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

export default async function BrandPage(
    props: { params: Promise<{ slug: string }> }
) {
    const params = await props.params;
    const brand = await getBrandBySlug(params.slug);

    if (!brand) {
        notFound();
    }

    const { categories, products, totalProducts } = await getCatalogInitialData(undefined, brand.id, undefined, 12, "bestselling");

    return (
        <BrandShowcaseClient
            key={brand.slug}
            brand={brand}
            categories={categories}
            initialProducts={products}
            initialTotal={totalProducts}
        />
    );
}

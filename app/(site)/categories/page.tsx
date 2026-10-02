import React from "react";
import CategoriesContent from "./CategoriesContent";
import { getSiteSettings } from "@/lib/admin-actions";
import { getCatalogCategories } from "@/lib/catalog";
import { Metadata } from "next";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
    title: "فئات وأقسام المنتجات الغذائية | Food Categories - Zad Land",
    description: "استعرض كافة فئات المواد الغذائية والاستهلاكية بالجملة: لحوم مجمدة، معلبات، صلصات، حبوب إفطار، قهوة، وشوكولا ومخبوزات معتمدة.",
    alternates: {
        canonical: "/categories",
    },
    openGraph: {
        title: "فئات وأقسام المنتجات | Zad Land",
        description: "استعرض كافة فئات المواد الغذائية والاستهلاكية بالجملة لدى شركة زاد لاند.",
        url: "/categories",
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
        title: "فئات وأقسام المنتجات | Zad Land",
        description: "استعرض كافة فئات المواد الغذائية والاستهلاكية بالجملة لدى شركة زاد لاند.",
        images: ["/logo.png"],
    },
};

async function getAllCategories() {
    try {
        return await getCatalogCategories();
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}

export default async function CategoriesPage() {
    const [categories, siteSettings] = await Promise.all([
        getAllCategories(),
        getSiteSettings()
    ]);

    return (
        <CategoriesContent categories={categories} siteSettings={siteSettings} />
    );
}

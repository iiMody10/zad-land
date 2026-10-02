import React from "react";
import { getSiteSettings } from "@/lib/admin-actions";
import ShippingReturnsContent from "./ShippingReturnsContent";
import { Metadata } from "next";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
    title: "الشحن والتوصيل وسياسة التوريد | Shipping & Delivery Terms - Zad Land",
    description: "تعرف على شروط الشحن والتوريد المباشر لكافة المحافظات والمناطق وسياسة الاستلام المعتمدة لدى شركة زاد لاند لتجارة وتوزيع المواد الغذائية.",
    alternates: {
        canonical: "/shipping-returns",
    },
    openGraph: {
        title: "الشحن والتوصيل وسياسة التوريد | Zad Land",
        description: "تعرف على شروط الشحن والتوريد المباشر وسياسة الاستلام المعتمدة لدى شركة زاد لاند.",
        url: "/shipping-returns",
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
        title: "الشحن والتوصيل وسياسة التوريد | Zad Land",
        description: "تعرف على شروط الشحن والتوريد المباشر وسياسة الاستلام المعتمدة لدى شركة زاد لاند.",
        images: ["/logo.png"],
    },
};

export default async function ShippingReturnsPage() {
    const siteSettings = await getSiteSettings();

    return (
        <ShippingReturnsContent siteSettings={siteSettings} />
    );
}

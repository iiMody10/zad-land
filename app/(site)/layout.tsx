import Header from "../components/Header";
import Footer from "../components/Footer";
import FooterInfoBar from "../components/FooterInfoBar";
import AnnouncementBar from "../components/AnnouncementBar";
import BottomNav from "../components/BottomNav";
import { getI18n } from "@/lib/i18n";
import { getCatalogBrands, getCatalogCategories } from "@/lib/catalog";
import { getNavigationData } from "@/lib/navigation";
import { getSiteSettings } from "@/lib/admin-actions";
import { getDefaultHeaderNavItems, parseHeaderNavItems, resolveHeaderNavItems } from "@/lib/header-navigation";

import React, { Suspense } from "react";
import NavigationProgressBar from "../components/NavigationProgressBar";

async function getCategories() {
    try {
        return await getCatalogCategories();
    } catch (error) {
        console.error("Failed to fetch categories for header:", error);
        return [];
    }
}

export default async function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [categories, brands, navData, siteSettings, { t, dir, language }] = await Promise.all([
        getCategories(),
        getCatalogBrands(),
        getNavigationData(),
        getSiteSettings(),
        getI18n(),
    ]);
    const configuredItems = siteSettings?.headerNavItems == null
        ? getDefaultHeaderNavItems(categories, brands)
        : parseHeaderNavItems(siteSettings.headerNavItems);
    const headerNavItems = resolveHeaderNavItems(
        configuredItems,
        categories,
        brands,
    );

    return (
        <div className="min-h-screen flex flex-col" dir={dir}>
            {/* Instant Navigation Progress Bar */}
            <Suspense fallback={null}>
                <NavigationProgressBar />
            </Suspense>

            {/* Header with Server-Side Pre-rendered Navigation Data */}
            <Header
                initialQuickNavItems={headerNavItems}
                initialNavData={navData}
                dir={dir}
                language={language}
            />

            {/* Main Content */}
            <main className="flex-1 pb-24 md:pb-0">
                {children}
            </main>

            {/* Footer */}
            <Footer t={t} language={language} />

            {/* Mobile Bottom Navigation Bar */}
            <BottomNav />
        </div>
    );
}

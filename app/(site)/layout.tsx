import Header from "../components/Header";
import Footer from "../components/Footer";
import FooterInfoBar from "../components/FooterInfoBar";
import AnnouncementBar from "../components/AnnouncementBar";
import BottomNav from "../components/BottomNav";
import { getI18n } from "@/lib/i18n";
import { getCatalogBrands } from "@/lib/catalog";
import { getNavigationData } from "@/lib/navigation";
import { getSiteSettings } from "@/lib/admin-actions";
import { getConfiguredHeaderNavItems, resolveHeaderNavItems } from "@/lib/header-navigation";

import React, { Suspense } from "react";
import NavigationProgressBar from "../components/NavigationProgressBar";

export default async function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [brands, navData, siteSettings, { t, dir, language }] = await Promise.all([
        getCatalogBrands(),
        getNavigationData(),
        getSiteSettings(),
        getI18n(),
    ]);
    const configuredItems = getConfiguredHeaderNavItems(siteSettings?.headerNavItems, brands);
    const headerNavItems = resolveHeaderNavItems(
        configuredItems,
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

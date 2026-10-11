import { getAdminMainCategories, getAdminCategories, getAdminSiteSettings } from "../../../../lib/admin-actions";
import { getConfiguredHeaderNavItems } from "@/lib/header-navigation";
import SiteContentClient from "./SiteContentClient";
import { getLaravelAdmin } from "@/lib/laravel-server";
import { redirect } from "next/navigation";

export default async function SiteContentPage({
    searchParams,
}: {
    searchParams?: Promise<{ tab?: string | string[] }>;
}) {
    const session = await getLaravelAdmin();

    if (!session || session.role !== 'SUPER_ADMIN') {
        redirect('/admin/dashboard');
    }

    const [siteSettings, categoriesData, mainCategories] = await Promise.all([
        getAdminSiteSettings(),
        getAdminCategories(1, 500),
        getAdminMainCategories(),
    ]);
    const activeMainCategories = mainCategories.filter((category: { isActive?: boolean }) => category.isActive !== false);
    const headerNavItems = getConfiguredHeaderNavItems(siteSettings?.headerNavItems, activeMainCategories);
    const params = await searchParams;
    const tabParam = Array.isArray(params?.tab) ? params?.tab[0] : params?.tab;
    const validTabs = ["navigation", "business", "footer", "banners", "shipping", "about", "contact", "featured"] as const;
    const initialTab = tabParam && validTabs.includes(tabParam as any) ? (tabParam as typeof validTabs[number]) : undefined;
    
    return (
        <SiteContentClient
            initialSettings={siteSettings}
            categories={categoriesData.categories.map((category) => ({
                id: category.id,
                name: category.name,
            }))}
            mainCategories={activeMainCategories.map((category: { id: string; name: string; description?: string | null }) => ({ id: category.id, name: category.name, nameEn: category.description || undefined }))}
            initialHeaderNavItems={headerNavItems}
            initialTab={initialTab}
        />
    );
}

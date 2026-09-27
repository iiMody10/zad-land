import { getAdminCategories, getAdminSiteSettings } from "../../../../lib/admin-actions";
import { getConfiguredHeaderNavItems } from "@/lib/header-navigation";
import { getNavigationData } from "@/lib/navigation";
import SiteContentClient from "./SiteContentClient";
import { getLaravelAdmin } from "@/lib/laravel-server";
import { redirect } from "next/navigation";

export default async function SiteContentPage() {
    const session = await getLaravelAdmin();

    if (!session || session.role !== 'SUPER_ADMIN') {
        redirect('/admin/dashboard');
    }

    const [siteSettings, categoriesData, mainCategories] = await Promise.all([
        getAdminSiteSettings(),
        getAdminCategories(1, 500),
        getNavigationData(),
    ]);
    const headerNavItems = getConfiguredHeaderNavItems(siteSettings?.headerNavItems, mainCategories);
    
    return (
        <SiteContentClient
            initialSettings={siteSettings}
            categories={categoriesData.categories.map((category) => ({
                id: category.id,
                name: category.name,
            }))}
            mainCategories={mainCategories.map((category) => ({ id: category.id, name: category.name, nameEn: category.nameEn }))}
            initialHeaderNavItems={headerNavItems}
        />
    );
}

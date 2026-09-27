import { getAdminBrands, getAdminCategories, getAdminSiteSettings } from "../../../../lib/admin-actions";
import { getConfiguredHeaderNavItems } from "@/lib/header-navigation";
import SiteContentClient from "./SiteContentClient";
import { getLaravelAdmin } from "@/lib/laravel-server";
import { redirect } from "next/navigation";

export default async function SiteContentPage() {
    const session = await getLaravelAdmin();

    if (!session || session.role !== 'SUPER_ADMIN') {
        redirect('/admin/dashboard');
    }

    const [siteSettings, categoriesData, catalogBrands] = await Promise.all([
        getAdminSiteSettings(),
        getAdminCategories(1, 500),
        getAdminBrands(),
    ]);
    const headerNavItems = getConfiguredHeaderNavItems(siteSettings?.headerNavItems, catalogBrands);
    
    return (
        <SiteContentClient
            initialSettings={siteSettings}
            categories={categoriesData.categories.map((category) => ({
                id: category.id,
                name: category.name,
            }))}
            brands={catalogBrands.map((brand) => ({ id: brand.id, name: brand.name }))}
            initialHeaderNavItems={headerNavItems}
        />
    );
}

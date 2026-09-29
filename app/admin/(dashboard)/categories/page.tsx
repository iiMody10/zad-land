import { getAdminBrands, getAdminCategories, getAdminMainCategories } from "../../../../lib/admin-actions";
import CategoriesClient from "./CategoriesClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
    const [data, brands, mainCategories] = await Promise.all([
        getAdminCategories(),
        getAdminBrands(),
        getAdminMainCategories(),
    ]);

    return <CategoriesClient categories={data.categories} brands={brands} mainCategories={mainCategories} />;
}

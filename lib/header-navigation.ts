import type { CatalogBrand, CatalogCategory } from "@/lib/catalog";

export type HeaderNavItemRef = {
    type: "category" | "brand";
    id: string;
};

export type HeaderNavItem = HeaderNavItemRef & {
    name: string;
    nameEn?: string | null;
    slug: string;
    href: string;
};

export function getDefaultHeaderNavItems(
    categories: Array<Pick<CatalogCategory, "id" | "isFeatured">>,
    brands: Array<Pick<CatalogBrand, "id" | "isFeatured">>,
): HeaderNavItemRef[] {
    const featuredCategories = categories.filter((item) => item.isFeatured);
    const featuredBrands = brands.filter((item) => item.isFeatured);
    const categoryChoices = (featuredCategories.length ? featuredCategories : categories).slice(0, 2);
    const brandChoices = (featuredBrands.length ? featuredBrands : brands).slice(0, 2);

    return [
        ...categoryChoices.map(({ id }) => ({ type: "category" as const, id })),
        ...brandChoices.map(({ id }) => ({ type: "brand" as const, id })),
    ];
}

export function parseHeaderNavItems(value: unknown): HeaderNavItemRef[] {
    if (typeof value !== "string" || !value.trim()) return [];

    try {
        const parsed: unknown = JSON.parse(value);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter((item): item is HeaderNavItemRef =>
            Boolean(item)
            && typeof item === "object"
            && ((item as HeaderNavItemRef).type === "category" || (item as HeaderNavItemRef).type === "brand")
            && typeof (item as HeaderNavItemRef).id === "string"
            && (item as HeaderNavItemRef).id.length > 0,
        ).slice(0, 12);
    } catch {
        return [];
    }
}

export function resolveHeaderNavItems(
    refs: HeaderNavItemRef[],
    categories: CatalogCategory[],
    brands: CatalogBrand[],
): HeaderNavItem[] {
    return refs.flatMap((ref) => {
        if (ref.type === "category") {
            const category = categories.find((candidate) => candidate.id === ref.id);
            return category ? [{
                ...ref,
                name: category.name,
                slug: category.slug,
                href: `/categories/${category.slug}`,
            }] : [];
        }

        const brand = brands.find((candidate) => candidate.id === ref.id);
        return brand ? [{
            ...ref,
            name: brand.name,
            slug: brand.slug,
            href: `/brands/${brand.slug}`,
        }] : [];
    });
}

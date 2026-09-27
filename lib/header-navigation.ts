import type { CatalogBrand, CatalogCategory } from "@/lib/catalog";

export type HeaderNavItemRef = {
    type: "brand";
    id: string;
};

export type HeaderNavItem = HeaderNavItemRef & {
    name: string;
    nameEn?: string | null;
    slug: string;
    href: string;
    catalogHref: string;
    image: string | null;
    categories: Array<{
        id: string;
        name: string;
        slug: string;
        href: string;
    }>;
};

export function getDefaultHeaderNavItems(
    brands: Array<Pick<CatalogBrand, "id" | "isFeatured">>,
): HeaderNavItemRef[] {
    const featuredBrands = brands.filter((item) => item.isFeatured);
    const brandChoices = (featuredBrands.length ? featuredBrands : brands).slice(0, 4);

    return brandChoices.map(({ id }) => ({ type: "brand", id }));
}

export function parseHeaderNavItems(value: unknown): HeaderNavItemRef[] {
    if (typeof value !== "string" || !value.trim()) return [];

    try {
        const parsed: unknown = JSON.parse(value);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter((item): item is HeaderNavItemRef =>
            Boolean(item)
            && typeof item === "object"
            && (item as HeaderNavItemRef).type === "brand"
            && typeof (item as HeaderNavItemRef).id === "string"
            && (item as HeaderNavItemRef).id.length > 0,
        ).slice(0, 12);
    } catch {
        return [];
    }
}

/**
 * Old settings may contain category links. Replace those legacy links with
 * the brand defaults, while preserving an intentionally empty navigation.
 */
export function getConfiguredHeaderNavItems(
    value: unknown,
    brands: Array<Pick<CatalogBrand, "id" | "isFeatured">>,
): HeaderNavItemRef[] {
    if (value == null) return getDefaultHeaderNavItems(brands);

    const configured = parseHeaderNavItems(value);
    if (configured.length > 0) return configured;

    if (typeof value === "string") {
        try {
            const parsed: unknown = JSON.parse(value);
            if (Array.isArray(parsed) && parsed.some((item) =>
                Boolean(item) && typeof item === "object" && (item as { type?: unknown }).type === "category",
            )) {
                return getDefaultHeaderNavItems(brands);
            }
        } catch {
            // Leave invalid or deliberately empty settings empty.
        }
    }

    return [];
}

export function resolveHeaderNavItems(
    refs: HeaderNavItemRef[],
    brands: CatalogBrand[],
    categories: CatalogCategory[],
): HeaderNavItem[] {
    return refs.flatMap((ref) => {
        const brand = brands.find((candidate) => candidate.id === ref.id);
        return brand ? [{
            ...ref,
            name: brand.name,
            slug: brand.slug,
            href: `/brands/${brand.slug}`,
            catalogHref: `/products?brandIds=${encodeURIComponent(brand.id)}`,
            image: brand.image,
            categories: categories
                .filter((category) => category.brandId === brand.id)
                .sort((left, right) => left.name.localeCompare(right.name))
                .map((category) => ({
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    href: `/products?brandIds=${encodeURIComponent(brand.id)}&categoryIds=${encodeURIComponent(category.id)}`,
                })),
        }] : [];
    });
}

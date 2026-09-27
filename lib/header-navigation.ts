import type { NavMainCategory } from '@/lib/navigation';

export type HeaderNavItemRef = {
    type: 'mainCategory';
    id: string;
};

export function getDefaultHeaderNavItems(mainCategories: Array<Pick<NavMainCategory, 'id'>>): HeaderNavItemRef[] {
    return mainCategories.slice(0, 6).map(({ id }) => ({ type: 'mainCategory', id }));
}

export function parseHeaderNavItems(value: unknown): HeaderNavItemRef[] {
    if (typeof value !== 'string' || !value.trim()) return [];

    try {
        const parsed: unknown = JSON.parse(value);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter((item): item is HeaderNavItemRef =>
            Boolean(item)
            && typeof item === 'object'
            && (item as HeaderNavItemRef).type === 'mainCategory'
            && typeof (item as HeaderNavItemRef).id === 'string'
            && (item as HeaderNavItemRef).id.length > 0,
        ).slice(0, 12);
    } catch {
        return [];
    }
}

/**
 * Migrate saved brand/category links to main-category navigation. Intentionally
 * empty arrays stay empty so an admin can hide all configured category links.
 */
export function getConfiguredHeaderNavItems(
    value: unknown,
    mainCategories: Array<Pick<NavMainCategory, 'id'>>,
): HeaderNavItemRef[] {
    if (value == null) return getDefaultHeaderNavItems(mainCategories);

    const configured = parseHeaderNavItems(value);
    if (configured.length > 0) return configured;

    if (typeof value === 'string') {
        try {
            const parsed: unknown = JSON.parse(value);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return getDefaultHeaderNavItems(mainCategories);
            }
        } catch {
            // Keep invalid settings empty rather than inventing navigation.
        }
    }

    return [];
}

export function selectHeaderNavigationItems(
    refs: HeaderNavItemRef[],
    mainCategories: NavMainCategory[],
): NavMainCategory[] {
    return refs.flatMap((ref) => {
        const mainCategory = mainCategories.find((candidate) => candidate.id === ref.id);
        return mainCategory ? [mainCategory] : [];
    });
}

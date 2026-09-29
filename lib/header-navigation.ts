import type { NavMainCategory } from '@/lib/navigation';

export type HeaderNavItemRef =
    | { type: 'home'; id: 'home'; enabled: boolean }
    | { type: 'mainCategory'; id: string };

const defaultHomeNavItem: HeaderNavItemRef = { type: 'home', id: 'home', enabled: true };

export function getDefaultHeaderNavItems(mainCategories: Array<Pick<NavMainCategory, 'id' | 'showInNav'>>): HeaderNavItemRef[] {
    const categoriesWithLegacyVisibility = mainCategories.filter((category) => 'showInNav' in category && category.showInNav);
    const defaults = categoriesWithLegacyVisibility.length > 0 ? categoriesWithLegacyVisibility : mainCategories;
    return [defaultHomeNavItem, ...defaults.slice(0, 6).map(({ id }) => ({ type: 'mainCategory' as const, id }))];
}

export function parseHeaderNavItems(value: unknown): HeaderNavItemRef[] {
    if (typeof value !== 'string' || !value.trim()) return [];

    try {
        const parsed: unknown = JSON.parse(value);
        if (!Array.isArray(parsed)) return [];

        return parsed.flatMap((item): HeaderNavItemRef[] => {
            if (!item || typeof item !== 'object') return [];
            const candidate = item as { type?: unknown; id?: unknown; enabled?: unknown };
            if (candidate.type === 'home' && candidate.id === 'home') {
                return [{ type: 'home', id: 'home', enabled: candidate.enabled !== false }];
            }
            if (candidate.type === 'mainCategory' && typeof candidate.id === 'string' && candidate.id.length > 0) {
                return [{ type: 'mainCategory', id: candidate.id }];
            }
            return [];
        }).slice(0, 12);
    } catch {
        return [];
    }
}

/** Migrate older saved category-only navigation settings to the current links. */
export function getConfiguredHeaderNavItems(
    value: unknown,
    mainCategories: Array<Pick<NavMainCategory, 'id' | 'showInNav'>>,
): HeaderNavItemRef[] {
    if (value == null) return getDefaultHeaderNavItems(mainCategories);

    const configured = parseHeaderNavItems(value);
    if (configured.some((item) => item.type === 'home')) return configured;

    // Older saved navigation had no explicit home item. Add it once during
    // migration; the admin stores an explicit disabled item when switched off.
    if (configured.length > 0) return [defaultHomeNavItem, ...configured].slice(0, 12);

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

    return [defaultHomeNavItem];
}

export function selectHeaderNavigationItems(
    refs: HeaderNavItemRef[],
    mainCategories: NavMainCategory[],
): NavMainCategory[] {
    return refs.flatMap((ref) => {
        if (ref.type !== 'mainCategory') return [];
        const mainCategory = mainCategories.find((candidate) => candidate.id === ref.id);
        return mainCategory ? [mainCategory] : [];
    });
}

import "server-only";
import { laravelJson } from "@/lib/laravel-server";

const CATEGORY_SLUG_FALLBACK = "category";

export function createCategorySlugBase(name: string) {
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return slug || CATEGORY_SLUG_FALLBACK;
}

export async function generateUniqueCategorySlug(name: string, excludeId?: string) {
    const categories = await laravelJson<Array<{ id: string; slug: string }>>("/api/categories?limit=1000", []);
    const base = createCategorySlugBase(name);
    return categories.some((category) => category.slug === base && category.id !== excludeId)
        ? `${base}-${crypto.randomUUID().slice(0, 8)}`
        : base;
}

export async function findCategoryByIdentifier(identifier: string) {
    if (!identifier) return null;
    const categories = await laravelJson<Array<Record<string, unknown>>>("/api/categories?limit=1000", []);
    return categories.find((category) =>
        category.id === identifier ||
        String(category.slug || "").toLocaleLowerCase() === identifier.toLocaleLowerCase() ||
        String(category.name || "").toLocaleLowerCase() === identifier.toLocaleLowerCase(),
    ) || null;
}

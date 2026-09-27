import "server-only";
import { laravelJson } from "@/lib/laravel-server";

const BRAND_SLUG_FALLBACK = "brand";

export function createBrandSlugBase(name: string) {
    const slug = name.toLowerCase().trim().replace(/&/g, "g").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return slug || BRAND_SLUG_FALLBACK;
}

export async function generateUniqueBrandSlug(name: string, excludeId?: string) {
    const brands = await laravelJson<Array<{ id: string; slug: string }>>("/api/brands", []);
    const base = createBrandSlugBase(name);
    return brands.some((brand) => brand.slug === base && brand.id !== excludeId)
        ? `${base}-${crypto.randomUUID().slice(0, 8)}`
        : base;
}

export async function getZadLandBrandId() {
    const brands = await laravelJson<Array<{ id: string; slug: string }>>("/api/brands", []);
    const brand = brands.find(({ slug }) => slug === "zad-land");
    if (!brand) throw new Error("The Zad Land brand has not been created yet.");
    return brand.id;
}

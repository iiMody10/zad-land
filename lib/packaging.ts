type Language = "ar" | "en";

/** The purchasable wholesale unit; stock and minimum order count these units. */
export function formatPackaging(value: string | null | undefined, language: Language, short = false) {
    const raw = value?.trim() || "طرد";
    const key = raw.toLowerCase();
    if (["طرد", "كرتون", "كرتونة", "carton", "cartons", "ctn", "case"].includes(key)) {
        return language === "ar" ? (raw === "كرتونة" ? "كرتونة" : "طرد") : short ? "ctn" : "Carton";
    }
    if (["صندوق", "box", "boxes"].includes(key)) return language === "ar" ? "صندوق" : short ? "box" : "Box";
    if (["كيس", "شوال", "bag", "sack"].includes(key)) return language === "ar" ? "كيس" : short ? "bag" : "Bag";
    if (["باكيت", "عبوة", "pack", "package"].includes(key)) return language === "ar" ? "عبوة" : short ? "pack" : "Pack";
    if (["قطعة", "piece", "pc"].includes(key)) return language === "ar" ? "قطعة" : short ? "pc" : "Piece";
    return raw;
}

export function formatPackageQuantity(quantity: number, packaging: string | null | undefined, language: Language) {
    const unit = formatPackaging(packaging, language);
    if (language === "ar" || quantity === 1) return `${quantity} ${unit}`;
    return `${quantity} ${unit === "Box" ? "Boxes" : `${unit}s`}`;
}

export function formatItemsPerPackage(value: string | null | undefined, packaging: string | null | undefined, language: Language) {
    const raw = value?.trim();
    if (!raw) return null;
    if (/^\d+$/.test(raw)) return `${raw} ${language === "ar" ? "قطعة" : "pcs"}/${formatPackaging(packaging, language, true)}`;
    return raw;
}

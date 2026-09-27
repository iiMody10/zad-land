"use client";

import { Heart as MdFavorite, Heart as MdFavoriteBorder } from 'lucide-react';
import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { useWishlist } from "@/app/context/WishlistContext";

export default function WishlistButton({ productId, className = "", showLabel = false }: { productId: string; className?: string; showLabel?: boolean }) {
    const { ids, ready, toggle } = useWishlist();
    const { language } = useLanguage();
    const [saving, setSaving] = useState(false);
    const saved = ids.has(productId);
    const label = saved
        ? language === "ar" ? "إزالة من المفضلة" : "Remove from saved products"
        : language === "ar" ? "حفظ المنتج" : "Save product";
    return <button
        type="button"
        disabled={!ready || saving}
        onClick={async (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (saving) return;
            setSaving(true);
            try {
                await toggle(productId);
            } finally {
                setSaving(false);
            }
        }}
        aria-label={label}
        title={label}
        aria-pressed={saved}
        className={`inline-flex items-center justify-center gap-2 disabled:opacity-50 ${className}`}
    >
        {saved ? <MdFavorite fill="currentColor" aria-hidden="true" /> : <MdFavoriteBorder aria-hidden="true" />}
        {showLabel && <span>{label}</span>}
    </button>;
}

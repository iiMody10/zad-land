"use client";

import React from "react";
import PriceText from "@/app/components/PriceText";
import { useLanguage } from "@/app/context/LanguageContext";

interface ProductPriceProps {
    price: string | null;
    discountPrice?: string | null;
}

const ProductPrice = ({ price, discountPrice }: ProductPriceProps) => {
    const { language } = useLanguage();

    const hasDiscount = price != null && discountPrice != null && Number(discountPrice) < Number(price);
    const discountPercentage = hasDiscount ? Math.round((1 - Number(discountPrice) / Number(price)) * 100) : 0;

    return (
        <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="flex items-center gap-3">
                <PriceText amount={hasDiscount ? discountPrice : price} className="text-2xl font-extrabold leading-none text-zinc-900 dark:text-white sm:text-3xl" />
                {hasDiscount && (
                    <PriceText amount={price} className="text-lg font-medium leading-none text-gray-400 line-through" />
                )}
            </div>

            {hasDiscount && (
                <div>
                    <span className="bg-[var(--color-brand-hover)] text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center leading-none">
                        -{discountPercentage}% {language === 'ar' ? 'خصم' : 'OFF'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ProductPrice;

"use client";

import React from 'react';
import ResilientImage from '@/app/components/ResilientImage';
import { useLanguage } from '@/app/context/LanguageContext';


interface BrandHeroHeaderProps {
    brand: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        image: string | null;
    };
    totalProducts: number;
}

export default function BrandHeroHeader({ brand, totalProducts }: BrandHeroHeaderProps) {
    const { language, dir } = useLanguage();
    const isArabic = language === 'ar';

    // Parse bilingual name formatted as "Alicafe - علي كافيه"
    const nameParts = brand.name.split("-");
    const primaryName = isArabic && nameParts.length > 1
        ? nameParts[1].trim()
        : (nameParts[0]?.trim() || brand.name);

    const secondaryName = nameParts.length > 1
        ? (isArabic ? nameParts[0].trim() : nameParts[1].trim())
        : null;

    return (
        <div className="relative rounded-2xl bg-white dark:bg-[var(--color-surface-dark)] border border-slate-200/80 dark:border-white/10 p-5 sm:p-7 mb-6 shadow-xs overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--color-brand)] via-[var(--color-accent)] to-[var(--color-brand)]" />

            <div className={`flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative z-10 ${dir === 'rtl' ? 'sm:text-right' : 'sm:text-left'} text-center`}>
                {/* Brand Logo Plinth */}
                <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-3 bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center justify-center">
                    <ResilientImage
                        src={brand.image}
                        alt={brand.name}
                        showSkeleton={false}
                        className="max-w-full max-h-full object-contain"
                        priority
                    />
                </div>

                {/* Brand Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 mb-1.5">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {totalProducts} {isArabic ? 'منتج جملة متاح' : 'Wholesale Products'}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-x-3 gap-y-1 mb-2">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--color-brand)] dark:text-white tracking-tight">
                            {primaryName}
                        </h1>
                        {secondaryName && (
                            <span className="text-sm sm:text-base font-medium text-slate-400 dark:text-slate-500">
                                {secondaryName}
                            </span>
                        )}
                    </div>

                    {brand.description && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                            {brand.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

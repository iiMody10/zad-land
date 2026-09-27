"use client";

import React from "react";
import Link from "next/link";
import ResilientImage from "@/app/components/ResilientImage";
import { useLanguage } from "@/app/context/LanguageContext";
import { ChevronRight as MdChevronRight, ChevronLeft as MdChevronLeft } from 'lucide-react';

interface BrandMastheadProps {
    brand: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        image: string | null;
        group?: string;
        isFeatured?: boolean;
        mainCategory?: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
        } | null;
    };
    totalProducts?: number;
}

export default function BrandMasthead({ brand }: BrandMastheadProps) {
    const { language, dir } = useLanguage();
    const isArabic = language === "ar";
    const isRtl = dir === "rtl";

    const fallbackImage = "/placeholder.svg";
    const brandImage = brand.image || fallbackImage;

    // Parse bilingual name formatted as "Alicafe - علي كافيه"
    const nameParts = brand.name.split("-");
    const primaryName = isArabic && nameParts.length > 1
        ? nameParts[1].trim()
        : (nameParts[0]?.trim() || brand.name);

    const secondaryName = nameParts.length > 1
        ? (isArabic ? nameParts[0].trim() : nameParts[1].trim())
        : null;

    const sectorName = brand.mainCategory 
        ? (isArabic ? brand.mainCategory.name : (brand.mainCategory.description || brand.mainCategory.name))
        : null;

    const naturalSubtitle = isArabic
        ? `تسوق قائمة منتجات ${primaryName} بأسعار الجملة المباشرة وتفاصيل التعبئة لكل طرد.`
        : `Explore ${primaryName} products available for wholesale ordering with case packaging specifications.`;

    const displayDescription = brand.description && brand.description.trim().length > 0
        ? brand.description
        : naturalSubtitle;

    return (
        <section className="mb-8" aria-label="Brand Overview">
            {/* Clean Breadcrumb Strip */}
            <nav 
                className="flex items-center flex-wrap gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4"
                aria-label="Breadcrumb"
            >
                <Link 
                    href="/" 
                    className="hover:text-[var(--color-brand)] dark:hover:text-white transition-colors py-1"
                >
                    {isArabic ? "الرئيسية" : "Home"}
                </Link>
                {isRtl ? (
                    <MdChevronLeft className="text-slate-400 dark:text-slate-600 text-sm shrink-0" />
                ) : (
                    <MdChevronRight className="text-slate-400 dark:text-slate-600 text-sm shrink-0" />
                )}
                <Link 
                    href="/brands" 
                    className="hover:text-[var(--color-brand)] dark:hover:text-white transition-colors py-1"
                >
                    {isArabic ? "العلامات التجارية" : "Brands"}
                </Link>
                {isRtl ? (
                    <MdChevronLeft className="text-slate-400 dark:text-slate-600 text-sm shrink-0" />
                ) : (
                    <MdChevronRight className="text-slate-400 dark:text-slate-600 text-sm shrink-0" />
                )}
                <span className="text-[var(--color-brand)] dark:text-white font-bold truncate max-w-[200px] sm:max-w-none">
                    {primaryName}
                </span>
            </nav>

            {/* Architectural Masthead Card */}
            <div className="relative rounded-2xl md:rounded-3xl bg-white dark:bg-[var(--color-surface-dark)] border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
                {/* Refined Top Accent Bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--color-brand)] via-[var(--color-accent)] to-[var(--color-brand)]" />

                <div className="p-5 sm:p-7 md:p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-7">
                        {/* Logo Plinth Tile */}
                        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-white/10 shadow-sm p-3.5 flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-[1.02]">
                            <div className="relative w-full h-full flex items-center justify-center">
                                <ResilientImage
                                    src={brandImage}
                                    alt={brand.name}
                                    showSkeleton={false}
                                    className="max-w-full max-h-full object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Brand Details */}
                        <div className={`flex-1 min-w-0 ${isRtl ? "text-right" : "text-left"} text-center sm:text-start`}>
                            {/* Sector / Department */}
                            {sectorName && (
                                <p className="text-xs font-bold text-[var(--color-accent)] dark:text-[var(--color-accent-light)] mb-1.5 uppercase tracking-wider">
                                    {sectorName}
                                </p>
                            )}

                            {/* Dual-Language Title Treatment */}
                            <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-x-3 gap-y-1 mb-2">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-brand)] dark:text-white tracking-tight">
                                    {primaryName}
                                </h1>
                                {secondaryName && (
                                    <span className="text-sm sm:text-base md:text-lg font-medium text-slate-400 dark:text-slate-500 tracking-wider">
                                        {secondaryName}
                                    </span>
                                )}
                            </div>

                            {/* Natural, Real Subtitle */}
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                                {displayDescription}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

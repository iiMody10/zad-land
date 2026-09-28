"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import ResilientImage from "@/app/components/ResilientImage";
import { Star as MdStar } from 'lucide-react';

interface Brand {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    isFeatured: boolean;
}

interface BrandsClientProps {
    brands: Brand[];
}

const fallbackImage = "/placeholder.svg";

export default function BrandsClient({ brands }: BrandsClientProps) {
    const { language, dir } = useLanguage();
    const isArabic = language === 'ar';

    const featuredBrands = brands.filter((brand) => brand.isFeatured);

    const renderBrandCard = (brand: Brand, isHighlight = false) => {
        // Separate English and Arabic if name is formatted as "DE CECCO - دي سيكو"
        const nameParts = brand.name.split('-');
        const displayName = isArabic && nameParts.length > 1
            ? nameParts[1].trim()
            : (nameParts[0]?.trim() || brand.name);

        const subName = nameParts.length > 1
            ? (isArabic ? nameParts[0].trim() : nameParts[1].trim())
            : null;

        return (
            <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className={`group flex min-h-[160px] flex-col justify-between rounded-2xl border transition-all duration-300 hover:-translate-y-1 p-3 sm:p-4 ${
                    isHighlight
                        ? "border-[var(--color-accent)]/30 bg-gradient-to-b from-[var(--color-canvas)]/60 to-white shadow-xs hover:border-[var(--color-accent)] hover:shadow-md dark:border-[var(--color-accent)]/20 dark:from-[var(--color-accent)]/5 dark:to-white/5"
                        : "border-slate-200/80 bg-white hover:border-[var(--color-brand)] hover:shadow-md dark:border-white/10 dark:bg-white/5"
                }`}
            >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-white dark:bg-white/5 p-3 flex items-center justify-center border border-slate-100 dark:border-white/5">
                    <ResilientImage
                        src={brand.image || fallbackImage}
                        alt={brand.name}
                        showSkeleton={false}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    {brand.isFeatured && (
                        <span className="absolute top-2 end-2 size-5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300 flex items-center justify-center shadow-xs">
                            <MdStar className="text-xs" />
                        </span>
                    )}
                </div>
                <div className="pt-3 text-center">
                    <p className="line-clamp-1 text-xs sm:text-sm font-bold text-slate-900 transition-colors group-hover:text-[var(--color-accent)] dark:text-white dark:group-hover:text-[var(--color-accent-light)]">
                        {displayName}
                    </p>
                    {subName && (
                        <p className="line-clamp-1 text-[10px] sm:text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                            {subName}
                        </p>
                    )}
                </div>
            </Link>
        );
    };

    return (
        <main className="container-custom py-6 md:py-10">
            {/* Breadcrumbs Navigation */}
            <nav className="relative z-20 flex items-center flex-wrap gap-y-2 text-[11px] md:text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6" aria-label="Breadcrumb">
                <Link 
                    href="/" 
                    className="inline-flex items-center py-1.5 px-1 -my-1.5 text-[var(--color-brand)] dark:text-white/80 hover:text-[var(--color-accent)] dark:hover:text-[var(--color-accent-light)] cursor-pointer touch-manipulation transition-colors"
                >
                    {isArabic ? 'الرئيسية' : 'HOME'}
                </Link>
                <span className="mx-2 md:mx-3 text-gray-300 dark:text-white/20 select-none">/</span>
                <span className="text-[var(--color-accent)] dark:text-[var(--color-accent-light)]">
                    {isArabic ? 'العلامات التجارية' : 'BRANDS'}
                </span>
            </nav>

            {/* Header Area */}
            <div className="mb-8 md:mb-10 border-b border-slate-200/80 pb-6 dark:border-white/10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-brand)] dark:text-white tracking-tight">
                        {isArabic ? 'العلامات التجارية' : 'Brands'}
                    </h1>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {brands.length} {isArabic ? 'علامة تجارية معتمدة' : 'Brands Available'}
                </span>
            </div>

            {/* Featured Brands (if any) */}
            {featuredBrands.length > 0 && (
                <section className="mb-10 md:mb-12">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="size-2.5 rounded-full bg-[var(--color-accent)]" />
                        <h2 className="text-lg sm:text-xl font-bold text-[var(--color-brand)] dark:text-white">
                            {isArabic ? 'العلامات المميزة' : 'Featured Brands'}
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {featuredBrands.map((brand) => renderBrandCard(brand, true))}
                    </div>
                </section>
            )}

            {/* All Brands Directory */}
            <section>
                <div className="mb-4 flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-[var(--color-brand)] dark:bg-white/40" />
                    <h2 className="text-lg sm:text-xl font-bold text-[var(--color-brand)] dark:text-white">
                        {isArabic ? 'كافة العلامات التجارية' : 'All Brands'}
                    </h2>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {brands.map((brand) => renderBrandCard(brand))}
                </div>
            </section>
        </main>
    );
}

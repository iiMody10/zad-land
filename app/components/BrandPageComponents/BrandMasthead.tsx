"use client";

import React, { useState } from "react";
import Link from "next/link";
import ResilientImage from "@/app/components/ResilientImage";
import { useLanguage } from "@/app/context/LanguageContext";
import { ChevronRight as MdChevronRight, ChevronLeft as MdChevronLeft } from "lucide-react";

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

export default function BrandMasthead({ brand, totalProducts = 0 }: BrandMastheadProps) {
    const { language, dir } = useLanguage();
    const isArabic = language === "ar";
    const isRtl = dir === "rtl";
    const [showLogo, setShowLogo] = useState(Boolean(brand.image?.trim() && brand.image !== "/placeholder.svg"));

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
    const productCount = new Intl.NumberFormat(isArabic ? "ar" : "en").format(totalProducts);

    return (
        <section className="mb-5" aria-label={isArabic ? "معلومات العلامة التجارية" : "Brand information"}>
            <nav
                className="mb-2 flex flex-wrap items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs"
                aria-label={isArabic ? "مسار التنقل" : "Breadcrumb"}
            >
                <Link href="/" className="py-1 transition-colors hover:text-[var(--color-brand)] dark:hover:text-white">
                    {isArabic ? "الرئيسية" : "Home"}
                </Link>
                {isRtl
                    ? <MdChevronLeft aria-hidden="true" className="size-3 shrink-0 text-slate-400" />
                    : <MdChevronRight aria-hidden="true" className="size-3 shrink-0 text-slate-400" />}
                <Link href="/brands" className="py-1 transition-colors hover:text-[var(--color-brand)] dark:hover:text-white">
                    {isArabic ? "العلامات التجارية" : "Brands"}
                </Link>
                {isRtl
                    ? <MdChevronLeft aria-hidden="true" className="size-3 shrink-0 text-slate-400" />
                    : <MdChevronRight aria-hidden="true" className="size-3 shrink-0 text-slate-400" />}
                <span className="max-w-[200px] truncate font-bold text-[var(--color-brand)] dark:text-white sm:max-w-none">
                    {primaryName}
                </span>
            </nav>

            <div className="overflow-hidden rounded-xl border border-slate-200/80 border-s-[4px] border-s-[var(--color-brand)] bg-white shadow-xs dark:border-white/10 dark:border-s-[var(--color-accent)] dark:bg-[var(--color-surface-dark)]">
                <div className="flex min-h-[88px] items-center gap-4 px-4 py-3 sm:px-5">
                    {showLogo && brand.image && (
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-slate-200/80 bg-white p-1.5 dark:border-white/10 dark:bg-zinc-800 sm:size-16">
                            <ResilientImage
                                src={brand.image}
                                alt={brand.name}
                                showSkeleton={false}
                                className="object-contain"
                                sizes="64px"
                                priority
                                onError={() => setShowLogo(false)}
                            />
                        </div>
                    )}

                    <div className="min-w-0 flex-1 text-start">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            {sectorName && (
                                <span className="w-full text-[11px] font-semibold text-[var(--color-accent)] dark:text-[var(--color-accent-light)] sm:w-auto">
                                    {sectorName}
                                </span>
                            )}
                            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-[var(--color-brand)] dark:text-white sm:text-3xl">
                                {primaryName}
                            </h1>
                            {secondaryName && (
                                <span className="text-sm font-medium text-slate-400 dark:text-slate-500 sm:text-base">
                                    {secondaryName}
                                </span>
                            )}
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                                {productCount} {isArabic ? "منتج" : "products"}
                            </span>
                        </div>
                        {brand.description?.trim() && (
                            <p className="mt-1 line-clamp-2 max-w-3xl text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
                                {brand.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

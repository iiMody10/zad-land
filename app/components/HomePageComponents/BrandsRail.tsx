'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import ResilientImage from '@/app/components/ResilientImage';
import { ChevronLeft as MdChevronLeft, ChevronRight as MdChevronRight } from 'lucide-react';
import type { RailBrand } from '@/lib/admin-actions';

interface BrandsRailProps {
    brands?: RailBrand[];
}

// Specialization subtitles matching exact brand category mapping
const BRAND_SUBTITLES: Record<string, { ar: string; en: string }> = {
    'sanino-doro': { ar: 'سانينو دورو', en: 'Sanino D\'Oro' },
    'captain-fisher': { ar: 'مفرزات كابتن فيشر', en: 'Captain Fisher Frozen' },
    'de-cecco-italy': { ar: 'دي سيكو ايطالي', en: 'De Cecco Italian' },
    'rio-mare': { ar: 'ريو ماري ايطالي', en: 'Rio Mare Italian' },
    'americana': { ar: 'امريكانا مفرزات', en: 'Americana Quality' },
    'ottima': { ar: 'اوتيما معكرونة إيطالي', en: 'Ottima Italian Pasta' },
    'mr-brownie': { ar: 'مستر براوني', en: 'Mr. Brownie Cakes' },
    'tat': { ar: 'تات تركي', en: 'Tat Turkish Goods' },
    'american-garden': { ar: 'صوصات أميركان جاردن', en: 'American Garden Sauces' },
    'alicafe': { ar: 'قهوة علي كافيه', en: 'Ali Cafe Coffee' },
    'hygiene': { ar: 'هايجين', en: 'Hygiene Care' },
    'milaf': { ar: 'مشروب ميلاف', en: 'Milaf Beverages' },
    'sante': { ar: 'سانتي', en: 'Sante Healthy' },
    'go-on': { ar: 'غو ان', en: 'Go On Protein' },
    'nabil': { ar: 'نبيل مفرزات', en: 'Nabil Frozen Foods' },
    'master-chef': { ar: 'ماستر شيف', en: 'Master Chef' },
    'pepsi': { ar: 'بيبسي', en: 'Pepsi Beverages' },
    'uludag': { ar: 'اولداغ تركي', en: 'Uludag Drinks' },
    'lovege': { ar: 'حليب لوفيج', en: 'Lovege Plant Milk' },
    'gourmet': { ar: 'غورمت', en: 'Gourmet Foods' },
    'boom-boom': { ar: 'بوم بوم طاقة', en: 'Boom Boom Energy' },
};

export default function BrandsRail({ brands = [] }: BrandsRailProps) {
    const { dir, language } = useLanguage();
    const isArabic = language === 'ar' || dir === 'rtl';
    const desktopCarouselRef = React.useRef<HTMLDivElement>(null);

    if (!brands || brands.length === 0) {
        return null;
    }

    const getBrandLabel = (brand: RailBrand) => {
        if (brand.slug && BRAND_SUBTITLES[brand.slug]) {
            return isArabic ? BRAND_SUBTITLES[brand.slug].ar : BRAND_SUBTITLES[brand.slug].en;
        }

        const nameParts = (brand.name || '').split('-');
        if (isArabic && nameParts.length > 1) {
            return nameParts[1].trim();
        }
        return nameParts[0]?.trim() || brand.name;
    };

    // Desktop order matching the featured partner strip in the reference design.
    const desktopBrandOrder = ['mersin', 'american-garden', 'hygiene', 'captain-fisher', 'sante', 'americana'];
    const orderedDesktopBrands = desktopBrandOrder
        .map((slug) => brands.find((brand) => brand.slug === slug))
        .filter((brand): brand is RailBrand => Boolean(brand));
    const desktopBrands = [
        ...orderedDesktopBrands,
        ...brands.filter((brand) => !desktopBrandOrder.includes(brand.slug || '')),
    ];

    const scrollDesktopBrands = (direction: 'left' | 'right') => {
        desktopCarouselRef.current?.scrollBy({
            left: direction === 'left' ? -desktopCarouselRef.current.clientWidth * 0.8 : desktopCarouselRef.current.clientWidth * 0.8,
            behavior: 'smooth',
        });
    };

    const renderBrandCard = (brand: RailBrand, isCompact = false, prioritizeImage = false) => {
        const brandLabel = getBrandLabel(brand);

        return (
            <Link
                key={brand.id || brand.slug}
                href={`/brands/${brand.slug}`}
                className={`group flex flex-col items-center justify-between bg-white dark:bg-[var(--color-background-dark)] border border-[var(--color-accent)]/20 dark:border-white/10 hover:border-[var(--color-accent)] hover:shadow-sm rounded-lg transition-all duration-300 ${
                    isCompact ? 'min-h-[124px] w-full min-w-[145px] shrink-0 snap-start p-3 md:flex-[0_0_calc(25%_-_12px)] lg:flex-[0_0_calc(16.666%_-_14px)]' : 'p-2.5 sm:p-3 min-h-[105px] sm:min-h-[115px]'
                }`}
            >
                {/* Brand Logo Container with High Visual Impact */}
                <div className={`relative w-full flex items-center justify-center overflow-hidden ${
                    isCompact ? 'h-[76px]' : 'h-[44px] sm:h-[50px] md:h-[54px]'
                }`}>
                    <ResilientImage
                        src={brand.image}
                        alt=""
                        priority={prioritizeImage}
                        loading={prioritizeImage ? 'eager' : 'lazy'}
                        showSkeleton
                        skeletonClassName="bg-[#f4f6f3] dark:bg-zinc-800"
                        sizes="(max-width: 768px) 140px, 160px"
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                </div>

                {/* Brand Subtitle / Category Label */}
                <span className="text-[10px] lg:text-[11px] font-bold text-slate-800 dark:text-gray-200 text-center line-clamp-1 group-hover:text-[var(--color-accent)] dark:group-hover:text-[var(--color-accent-light)] transition-colors mt-1 leading-snug">
                    {brandLabel}
                </span>
            </Link>
        );
    };

    // Order brands for mobile to match target screenshot: Mersin, American Garden, HiGeen, Captain Fisher, Sante
    const targetMobileOrder = ['mersin', 'american-garden', 'hygiene', 'captain-fisher', 'sante'];
    const mobileBrands = [...brands].sort((a, b) => {
        const idxA = targetMobileOrder.indexOf(a.slug || '');
        const idxB = targetMobileOrder.indexOf(b.slug || '');
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return 0;
    });

    return (
        <section className="relative z-20 -mt-8 w-full rounded-t-[32px] border-b border-gray-100 bg-white pt-4 pb-3 dark:border-white/5 dark:bg-[var(--color-background-dark)] sm:-mt-10 sm:rounded-t-[38px] md:z-auto md:mt-0 md:rounded-t-none md:pt-6 md:pb-8">
            <div className="container-custom">
                {/* 1. Mobile Header (< md) */}
                <div className="relative mb-3 flex items-center justify-center px-2 text-[var(--color-accent)] md:hidden">
                    {/* View All Link - Fixed on the left side */}
                    <Link
                        href="/brands"
                        dir="ltr"
                        className="absolute left-2 top-1/2 z-10 flex -translate-y-1/2 items-center gap-0.5 text-[11px] font-bold text-gray-500 transition-colors hover:text-[var(--color-accent)] dark:text-gray-400"
                    >
                        <span className="text-base leading-none">‹</span>
                        <span>{isArabic ? 'عرض الكل' : 'View All'}</span>
                    </Link>

                    {/* Center Ornamental Title */}
                    <div className="flex w-full items-center justify-center gap-3 pointer-events-none sm:gap-4 md:gap-6">
                        <div className="h-[1.5px] flex-1 max-w-[36px] bg-gradient-to-r from-transparent via-[var(--color-accent-light)]/40 to-[var(--color-accent)] sm:max-w-[90px] md:max-w-[200px] dark:to-[var(--color-accent-light)]" />
                        <svg className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 2C11.5 4 10.5 6 9 7.5C10.5 9 11.5 11 12 13C12.5 11 13.5 9 15 7.5C13.5 6 12.5 4 12 2Z" opacity="0.9" />
                            <path d="M7 6C6.5 8 5.5 10 4 11.5C5.5 13 6.5 15 7 17C7.5 15 8.5 13 10 11.5C8.5 10 7.5 8 7 6Z" />
                            <path d="M17 6C16.5 8 15.5 10 14 11.5C15.5 13 16.5 15 17 17C17.5 15 18.5 13 20 11.5C18.5 10 17.5 8 17 6Z" />
                            <path d="M12 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <h2 className="whitespace-nowrap px-1 text-base font-extrabold tracking-tight text-[var(--color-brand)] sm:text-2xl md:text-[28px] dark:text-white">
                            {isArabic ? 'شركائنا العالميون' : 'Our Global Partners'}
                        </h2>
                        <svg className="h-4 w-4 shrink-0 scale-x-[-1] sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 2C11.5 4 10.5 6 9 7.5C10.5 9 11.5 11 12 13C12.5 11 13.5 9 15 7.5C13.5 6 12.5 4 12 2Z" opacity="0.9" />
                            <path d="M7 6C6.5 8 5.5 10 4 11.5C5.5 13 6.5 15 7 17C7.5 15 8.5 13 10 11.5C8.5 10 7.5 8 7 6Z" />
                            <path d="M17 6C16.5 8 15.5 10 14 11.5C15.5 13 16.5 15 17 17C17.5 15 18.5 13 20 11.5C18.5 10 17.5 8 17 6Z" />
                            <path d="M12 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <div className="h-[1.5px] flex-1 max-w-[36px] bg-gradient-to-l from-transparent via-[var(--color-accent-light)]/40 to-[var(--color-accent)] sm:max-w-[90px] md:max-w-[200px] dark:to-[var(--color-accent-light)]" />
                    </div>
                </div>

                {/* 2. Desktop Section Header (>= md) */}
                <div className="mb-6 hidden px-2 md:block">
                    <div className="mb-3 flex items-center justify-center gap-3 text-[var(--color-accent)] sm:gap-4 md:mb-5 md:gap-6">
                        <div className="h-[1.5px] max-w-[36px] flex-1 bg-gradient-to-r from-transparent via-[var(--color-accent-light)]/40 to-[var(--color-accent)] sm:max-w-[90px] md:max-w-[200px] dark:to-[var(--color-accent-light)]" />
                        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 2C11.5 4 10.5 6 9 7.5C10.5 9 11.5 11 12 13C12.5 11 13.5 9 15 7.5C13.5 6 12.5 4 12 2Z" opacity="0.9" />
                            <path d="M7 6C6.5 8 5.5 10 4 11.5C5.5 13 6.5 15 7 17C7.5 15 8.5 13 10 11.5C8.5 10 7.5 8 7 6Z" />
                            <path d="M17 6C16.5 8 15.5 10 14 11.5C15.5 13 16.5 15 17 17C17.5 15 18.5 13 20 11.5C18.5 10 17.5 8 17 6Z" />
                            <path d="M12 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <h2 className="whitespace-nowrap px-1 text-base font-extrabold tracking-tight text-[var(--color-brand)] sm:text-2xl md:text-[28px] dark:text-white">
                            {isArabic ? 'شركائنا العالميون' : 'Global Partner Brands'}
                        </h2>
                        <svg className="h-4 w-4 shrink-0 scale-x-[-1] sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 2C11.5 4 10.5 6 9 7.5C10.5 9 11.5 11 12 13C12.5 11 13.5 9 15 7.5C13.5 6 12.5 4 12 2Z" opacity="0.9" />
                            <path d="M7 6C6.5 8 5.5 10 4 11.5C5.5 13 6.5 15 7 17C7.5 15 8.5 13 10 11.5C8.5 10 7.5 8 7 6Z" />
                            <path d="M17 6C16.5 8 15.5 10 14 11.5C15.5 13 16.5 15 17 17C17.5 15 18.5 13 20 11.5C18.5 10 17.5 8 17 6Z" />
                            <path d="M12 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <div className="h-[1.5px] max-w-[36px] flex-1 bg-gradient-to-l from-transparent via-[var(--color-accent-light)]/40 to-[var(--color-accent)] sm:max-w-[90px] md:max-w-[200px] dark:to-[var(--color-accent-light)]" />
                    </div>
                    <div className="flex items-center justify-center text-center">
                        <Link
                            href="/brands"
                            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--color-accent)]/25 bg-[var(--color-canvas)] px-3 py-1 text-xs font-bold text-[var(--color-brand)] transition-colors hover:border-[var(--color-accent)]/60 hover:text-[var(--color-accent)] dark:bg-white/5 dark:text-[var(--color-accent-light)]"
                        >
                            <span>{isArabic ? 'عرض جميع الشركات' : 'View All Brands'}</span>
                            <MdChevronRight className={`text-base transition-transform ${isArabic ? 'rotate-180' : ''}`} />
                        </Link>
                    </div>
                </div>

                {/* Legacy desktop ornament retained for mobile-only layout compatibility */}
                <div className="hidden">
                    {/* Left Ornamental Line */}
                    <div className="h-[1.5px] flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[200px] bg-gradient-to-r from-transparent via-[var(--color-accent-light)]/40 to-[var(--color-accent)] dark:to-[var(--color-accent-light)]" />

                    {/* Wheat / Olive Leaf Left */}
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-accent)] dark:text-[var(--color-accent-light)] shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 2C11.5 4 10.5 6 9 7.5C10.5 9 11.5 11 12 13C12.5 11 13.5 9 15 7.5C13.5 6 12.5 4 12 2Z" opacity="0.9" />
                        <path d="M7 6C6.5 8 5.5 10 4 11.5C5.5 13 6.5 15 7 17C7.5 15 8.5 13 10 11.5C8.5 10 7.5 8 7 6Z" />
                        <path d="M17 6C16.5 8 15.5 10 14 11.5C15.5 13 16.5 15 17 17C17.5 15 18.5 13 20 11.5C18.5 10 17.5 8 17 6Z" />
                        <path d="M12 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>

                    {/* Section Title */}
                    <h2 className="text-base sm:text-2xl md:text-[28px] font-extrabold text-[var(--color-brand)] dark:text-white tracking-tight whitespace-nowrap px-1">
                        {isArabic ? 'شركائنا العالميون' : 'Global Partner Brands'}
                    </h2>

                    {/* Wheat / Olive Leaf Right */}
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-accent)] dark:text-[var(--color-accent-light)] shrink-0 scale-x-[-1]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 2C11.5 4 10.5 6 9 7.5C10.5 9 11.5 11 12 13C12.5 11 13.5 9 15 7.5C13.5 6 12.5 4 12 2Z" opacity="0.9" />
                        <path d="M7 6C6.5 8 5.5 10 4 11.5C5.5 13 6.5 15 7 17C7.5 15 8.5 13 10 11.5C8.5 10 7.5 8 7 6Z" />
                        <path d="M17 6C16.5 8 15.5 10 14 11.5C15.5 13 16.5 15 17 17C17.5 15 18.5 13 20 11.5C18.5 10 17.5 8 17 6Z" />
                        <path d="M12 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>

                    {/* Right Ornamental Line */}
                    <div className="h-[1.5px] flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[200px] bg-gradient-to-l from-transparent via-[var(--color-accent-light)]/40 to-[var(--color-accent)] dark:to-[var(--color-accent-light)]" />
                </div>

                {/* 1. Mobile Experience (< md): Single Row Horizontal Scroll matching Target Design */}
                <div className="md:hidden">
                    <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide py-1">
                        <div className="flex items-center gap-2.5 snap-x">
                            {mobileBrands.map((brand, index) => {
                                const isMersin = brand.slug === 'mersin';
                                return (
                                    <Link
                                        key={brand.id || brand.slug}
                                        href={`/brands/${brand.slug}`}
                                        className="group shrink-0 w-[84px] sm:w-[92px] h-[78px] sm:h-[84px] bg-white dark:bg-zinc-800/90 rounded-2xl border border-gray-200/70 dark:border-white/10 hover:border-[var(--color-accent)] p-2 flex flex-col items-center justify-center snap-start transition-all shadow-2xs hover:shadow-xs"
                                    >
                                        <div className={`w-full flex items-center justify-center relative overflow-hidden ${isMersin ? 'h-[44px]' : 'h-[52px]'}`}>
                                            <ResilientImage
                                                src={brand.image}
                                                alt={brand.name}
                                                priority={index < 5}
                                                loading={index < 5 ? 'eager' : 'lazy'}
                                                showSkeleton
                                                skeletonClassName="bg-[#f4f6f3] dark:bg-zinc-800"
                                                sizes="90px"
                                                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                                            />
                                        </div>
                                        {isMersin && (
                                            <span className="text-[10px] font-bold text-slate-800 dark:text-gray-200 text-center truncate w-full mt-0.5">
                                                Mersin
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 2. Desktop & Tablet Experience (>= md): scrollable partner carousel */}
                <div className="hidden items-center gap-2 md:flex" dir="ltr">
                    <button
                        type="button"
                        onClick={() => scrollDesktopBrands('left')}
                        aria-label={isArabic ? 'الشركات السابقة' : 'Previous brands'}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-accent)]/30 bg-white text-[var(--color-accent)] shadow-sm transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-canvas)]"
                    >
                        <MdChevronLeft className="text-xl" />
                    </button>

                    <div
                        ref={desktopCarouselRef}
                        className="min-w-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-1 scrollbar-hide"
                    >
                        <div className="flex min-w-full gap-4">
                            {desktopBrands.map((brand, index) => renderBrandCard(brand, true, index < 6))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => scrollDesktopBrands('right')}
                        aria-label={isArabic ? 'الشركات التالية' : 'Next brands'}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-accent)]/30 bg-white text-[var(--color-accent)] shadow-sm transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-canvas)]"
                    >
                        <MdChevronRight className="text-xl" />
                    </button>
                </div>
            </div>
        </section>
    );
}

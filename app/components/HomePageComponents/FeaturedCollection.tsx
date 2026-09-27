'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from '../ProductsPageComponents/ProductCard';
import { ChevronRight as MdChevronRight } from 'lucide-react';

import { useLanguage } from '@/app/context/LanguageContext';
import { useProductRail } from './useProductRail';

interface Product {
    id: string;
    slug: string;
    name: string;
    nameAr?: string | null;
    nameEn?: string | null;
    description: string | null;
    descriptionAr?: string | null;
    descriptionEn?: string | null;
    options?: string | null;
    price: number;
    discountPrice?: number | null;
    images: string;
    categoryId: string;
    isTrending: boolean;
    stock: number;
    brand?: {
        id: string;
        name: string;
        slug: string;
        group?: string;
    } | null;
}

interface TabData {
    key: string;
    labelKey: string;
    products: Product[];
    labelEnglish: string | null;
    labelArabic: string | null;
    enabled: boolean;
}

interface FeaturedCollectionProps {
    newArrivals: Product[];
    bestSellers: Product[];
    settings?: Record<string, unknown> | null;
}

const FeaturedCollection = ({ newArrivals, bestSellers, settings }: FeaturedCollectionProps) => {
    const { t, dir } = useLanguage();
    const [activeTab, setActiveTab] = useState(0);

    const { railRef, progressBarRef, canScrollForward, canScrollBackward, scrollForward, scrollBackward } = useProductRail(dir);

    const tabs: TabData[] = useMemo(() => [
        {
            key: 'new-arrivals', labelKey: 'home.featuredTabNewArrivals', products: newArrivals,
            labelEnglish: typeof settings?.featuredCollectionNewArrivalsLabel === 'string' ? settings.featuredCollectionNewArrivalsLabel : null,
            labelArabic: typeof settings?.featuredCollectionNewArrivalsLabelAr === 'string' ? settings.featuredCollectionNewArrivalsLabelAr : null,
            enabled: settings?.featuredCollectionNewArrivalsEnabled !== false,
        },
        {
            key: 'best-sellers', labelKey: 'home.featuredTabBestSellers', products: bestSellers,
            labelEnglish: typeof settings?.featuredCollectionBestSellersLabel === 'string' ? settings.featuredCollectionBestSellersLabel : null,
            labelArabic: typeof settings?.featuredCollectionBestSellersLabelAr === 'string' ? settings.featuredCollectionBestSellersLabelAr : null,
            enabled: settings?.featuredCollectionBestSellersEnabled !== false,
        },
    ].filter((tab) => tab.enabled && tab.products.length > 0), [newArrivals, bestSellers, settings]);

    const activeIndex = Math.min(activeTab, Math.max(0, tabs.length - 1));
    const activeItem = tabs[activeIndex];
    const activeProducts = activeItem?.products || [];

    React.useEffect(() => {
        if (activeTab !== activeIndex) setActiveTab(activeIndex);
        if (railRef.current) {
            railRef.current.scrollTo({ left: 0, behavior: 'auto' });
        }
    }, [activeTab, activeIndex, railRef]);

    if (settings?.featuredCollectionEnabled === false || tabs.length === 0) {
        return null;
    }

    const isArabic = dir === 'rtl';
    const settingText = (englishKey: string, arabicKey: string, fallback: string) => {
        const value = settings?.[isArabic ? arabicKey : englishKey];
        return typeof value === 'string' && value.trim() ? value : fallback;
    };
    const title = settingText('featuredCollectionTitle', 'featuredCollectionTitleAr', t('home.featuredCollection'));
    const allProductsLabel = settingText('featuredCollectionAllProductsLabel', 'featuredCollectionAllProductsLabelAr', t('products.allProducts'));
    const allProductsHref = typeof settings?.featuredCollectionAllProductsUrl === 'string' && settings.featuredCollectionAllProductsUrl.trim()
        ? settings.featuredCollectionAllProductsUrl.trim()
        : activeItem?.key === 'best-sellers' ? '/products?isTrending=true' : '/products?sort=newest';

    return (
        <section className="container-custom">
            <div className="mb-6 px-2">
                <div className="mb-3 flex items-center justify-center gap-3 text-[var(--color-accent)] sm:gap-4 md:mb-5 md:gap-6">
                    <div className="h-[1.5px] flex-1 max-w-[36px] bg-gradient-to-r from-transparent via-[var(--color-accent-light)]/40 to-[var(--color-accent)] sm:max-w-[90px] md:max-w-[200px] dark:to-[var(--color-accent-light)]" />
                    <svg className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2C11.5 4 10.5 6 9 7.5C10.5 9 11.5 11 12 13C12.5 11 13.5 9 15 7.5C13.5 6 12.5 4 12 2Z" opacity="0.9" />
                        <path d="M7 6C6.5 8 5.5 10 4 11.5C5.5 13 6.5 15 7 17C7.5 15 8.5 13 10 11.5C8.5 10 7.5 8 7 6Z" />
                        <path d="M17 6C16.5 8 15.5 10 14 11.5C15.5 13 16.5 15 17 17C17.5 15 18.5 13 20 11.5C18.5 10 17.5 8 17 6Z" />
                        <path d="M12 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <h2 id="featured-collection-title" className="whitespace-nowrap px-1 text-base font-extrabold tracking-tight text-[var(--color-brand)] sm:text-2xl md:text-[28px] dark:text-white">
                        {title}
                    </h2>
                    <svg className="h-4 w-4 shrink-0 scale-x-[-1] sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2C11.5 4 10.5 6 9 7.5C10.5 9 11.5 11 12 13C12.5 11 13.5 9 15 7.5C13.5 6 12.5 4 12 2Z" opacity="0.9" />
                        <path d="M7 6C6.5 8 5.5 10 4 11.5C5.5 13 6.5 15 7 17C7.5 15 8.5 13 10 11.5C8.5 10 7.5 8 7 6Z" />
                        <path d="M17 6C16.5 8 15.5 10 14 11.5C15.5 13 16.5 15 17 17C17.5 15 18.5 13 20 11.5C18.5 10 17.5 8 17 6Z" />
                        <path d="M12 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <div className="h-[1.5px] flex-1 max-w-[36px] bg-gradient-to-l from-transparent via-[var(--color-accent-light)]/40 to-[var(--color-accent)] sm:max-w-[90px] md:max-w-[200px] dark:to-[var(--color-accent-light)]" />
                </div>

                <div className="flex items-center justify-between gap-3">
                    <div className="tabs-nav min-w-0 flex-1 overflow-x-auto scrollbar-hide" role="tablist">
                        <div className="flex gap-4 md:gap-2">
                            {tabs.map((tab, index) => (
                                <button
                                    key={tab.key}
                                    role="tab"
                                    aria-selected={activeTab === index}
                                    onClick={() => setActiveTab(index)}
                                    className={`tabs__btn whitespace-nowrap px-6 py-2.5 text-[15px] transition-all border-b-2 ${activeTab === index
                                        ? 'border-[var(--color-accent)] text-[var(--color-accent)] dark:text-[var(--color-accent-light)] font-bold'
                                        : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 font-medium'
                                        }`}
                                >
                                    {(isArabic ? tab.labelArabic : tab.labelEnglish) || t(tab.labelKey)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeProducts.length > 0 && <Link
                        href={allProductsHref}
                        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-canvas)] px-4 py-2 text-xs font-bold text-[var(--color-brand)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] dark:bg-white/5 dark:text-[var(--color-accent-light)]"
                    >
                        <span>{allProductsLabel}</span>
                        <MdChevronRight className={`text-base ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </Link>}
                </div>
            </div>

            <div className="relative">
                <div
                    ref={railRef}
                    className="-mx-4 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:px-0"
                >
                    <div className="flex snap-x snap-mandatory gap-4 pb-2 md:gap-5">
                        {activeProducts.map((product) => (
                            <div
                                key={product.id}
                                className="w-[180px] md:w-[calc((100%-40px)/3)] xl:w-[calc((100%-60px)/4)] 2xl:w-[calc((100%-80px)/5)] flex-none snap-start"
                            >
                                <ProductCard
                                    product={product}
                                    variant="compact"
                                    showBadge={activeItem?.key === 'new-arrivals'}
                                    badge={activeItem?.key === 'new-arrivals' ? t('home.newArrival') : undefined}
                                />
                            </div>
                        ))}
                        {/* Spacer to prevent cutoff of the last item on mobile */}
                        <div className="w-[1px] shrink-0 sm:hidden"></div>
                    </div>
                </div>
                
                {/* Only show rail controls when there are enough products to scroll through. */}
                {activeProducts.length > 4 && <div className="mt-8 flex items-center gap-4 px-2 w-full">
                    {/* Previous Button (White -> Dark Hover) */}
                    <button
                        onClick={scrollBackward}
                        disabled={!canScrollBackward}
                        className="hidden md:flex w-12 h-12 shrink-0 rounded-full border border-gray-200 bg-white items-center justify-center text-[#000000] disabled:opacity-50 disabled:cursor-not-allowed order-2 btn-curved-fill"
                        aria-label="Previous slide"
                    >
                        <svg className={`w-5 h-5 ${dir === 'rtl' ? '-scale-x-100' : ''}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.5 16.25L6.25 10L12.5 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </button>
                    
                    {/* Progress Bar */}
                    <div className="flex-1 h-[2px] bg-gray-200 dark:bg-gray-800 relative overflow-hidden rounded-full order-1">
                        <div 
                            ref={progressBarRef}
                            className="absolute top-0 bottom-0 bg-[#000000] dark:bg-gray-300 rounded-full"
                            style={{ 
                                width: '100%',
                                transformOrigin: dir === 'rtl' ? 'right' : 'left',
                                transform: 'scaleX(0)'
                            }}
                        />
                    </div>

                    {/* Next Button (White -> Dark Hover) */}
                    <button
                        onClick={scrollForward}
                        disabled={!canScrollForward}
                        className="hidden md:flex w-12 h-12 shrink-0 rounded-full border border-gray-200 bg-white items-center justify-center text-[#000000] disabled:opacity-50 disabled:cursor-not-allowed order-3 btn-curved-fill"
                        aria-label="Next slide"
                    >
                        <svg className={`w-5 h-5 ${dir === 'rtl' ? '-scale-x-100' : ''}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 3.75L13.75 10L7.5 16.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </button>
                </div>}
            </div>
        </section>
    );
};

export default FeaturedCollection;

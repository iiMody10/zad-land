'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight as MdChevronRight } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import PriceText from '@/app/components/PriceText';
import ResilientImage from '@/app/components/ResilientImage';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
    id: string;
    slug: string;
    name: string;
    nameAr?: string | null;
    nameEn?: string | null;
    description: string | null;
    price: number | null;
    discountPrice?: number | null;
    images: string;
    categoryId: string;
    stock: number;
    isTrending: boolean;
    brand?: {
        id: string;
        name: string;
        slug: string;
        group?: string;
    } | null;
}

interface TrendingWeeklyProps {
    products: Product[];
}

const TrendingWeekly = ({ products }: TrendingWeeklyProps) => {
    const { dir } = useLanguage();
    const isArabic = dir === 'rtl';
    const [showAll, setShowAll] = useState(false);

    if (!products || products.length === 0) {
        return null;
    }

    // On mobile show 5-6 products initially; on desktop show up to 9
    const initialCount = 6;
    const visibleProducts = showAll ? products : products.slice(0, initialCount);

    const getFirstImage = (images: string) => {
        try {
            const parsed = JSON.parse(images);
            return Array.isArray(parsed) ? parsed[0] : images;
        } catch {
            return images.split(',')[0]?.trim() || images;
        }
    };

    const getBrandName = (name?: string | null) => {
        if (!name) return null;
        const parts = name.split('-');
        if (isArabic) {
            return parts[1]?.trim() || parts[0]?.trim();
        }
        return parts[0]?.trim();
    };

    return (
        <section className="container-custom" dir={dir}>
            <div className="mb-6 px-2">
                <div className="mb-3 flex items-center justify-center gap-3 text-[var(--color-accent)] sm:gap-4 md:mb-5 md:gap-6">
                    <div className="h-[1.5px] max-w-[36px] flex-1 bg-gradient-to-r from-transparent via-[var(--color-accent-light)]/40 to-[var(--color-accent)] sm:max-w-[90px] md:max-w-[200px] dark:to-[var(--color-accent-light)]" />
                    <svg className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2C11.5 4 10.5 6 9 7.5C10.5 9 11.5 11 12 13C12.5 11 13.5 9 15 7.5C13.5 6 12.5 4 12 2Z" opacity="0.9" />
                        <path d="M7 6C6.5 8 5.5 10 4 11.5C5.5 13 6.5 15 7 17C7.5 15 8.5 13 10 11.5C8.5 10 7.5 8 7 6Z" />
                        <path d="M17 6C16.5 8 15.5 10 14 11.5C15.5 13 16.5 15 17 17C17.5 15 18.5 13 20 11.5C18.5 10 17.5 8 17 6Z" />
                        <path d="M12 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <h2 id="trending-weekly-title" className="whitespace-nowrap px-1 text-base font-extrabold tracking-tight text-[var(--color-brand)] sm:text-2xl md:text-[28px] dark:text-white">
                        {isArabic ? 'تريندات هذا الأسبوع' : 'Trending This Week'}
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
                        href="/products"
                        className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--color-accent)]/25 bg-[var(--color-canvas)] px-3 py-1 text-xs font-bold text-[var(--color-brand)] transition-colors hover:border-[var(--color-accent)]/60 hover:text-[var(--color-accent)] dark:bg-white/5 dark:text-[var(--color-accent-light)]"
                    >
                        <span>{isArabic ? 'تسوق كل المنتجات' : 'View All'}</span>
                        <MdChevronRight className={`text-base transition-transform ${isArabic ? 'rotate-180' : ''}`} />
                    </Link>
                </div>
            </div>

            {/* Product Grid */}
            <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    <AnimatePresence initial={false}>
                        {visibleProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.25 }}
                                className="group flex items-center gap-3 sm:gap-4 bg-[var(--color-canvas)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-accent)]/15 hover:border-[var(--color-accent)]/50 rounded-2xl p-3 sm:p-4 h-[112px] transition-all duration-300 shadow-2xs hover:shadow-xs"
                            >
                                {/* Product Image */}
                                <Link
                                    href={`/products/${product.slug}`}
                                    className="w-[84px] h-[84px] shrink-0 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 p-1.5 border border-gray-100 dark:border-white/5 flex items-center justify-center"
                                >
                                    <ResilientImage
                                        src={getFirstImage(product.images)}
                                        alt={product.name}
                                        sizes="84px"
                                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                                        loading="lazy"
                                    />
                                </Link>

                                {/* Product Info */}
                                <div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
                                    {/* Brand */}
                                    {product.brand && (
                                        <p className="text-[10px] sm:text-[11px] font-bold text-[var(--color-accent)] dark:text-[var(--color-accent-light)] mb-0.5 truncate uppercase tracking-wider">
                                            {getBrandName(product.brand.name)}
                                        </p>
                                    )}
                                    {/* Product Name */}
                                    <h3 className="text-xs sm:text-sm font-bold text-[var(--color-brand)] dark:text-white truncate leading-snug mb-1">
                                        <Link
                                            href={`/products/${product.slug}`}
                                            className="hover:text-[var(--color-accent)] transition-colors"
                                        >
                                            {isArabic ? (product.nameAr || product.name) : (product.nameEn || product.name)}
                                        </Link>
                                    </h3>
                                    {/* Price */}
                                    <div className="flex items-center gap-2">
                                        {product.discountPrice ? (
                                            <>
                                                <span className="text-xs sm:text-sm md:text-base font-extrabold text-[var(--color-brand-hover)] dark:text-[var(--color-brand-light)]">
                                                    <PriceText amount={product.discountPrice} />
                                                </span>
                                                <span className="text-[11px] text-gray-400 line-through">
                                                    <PriceText amount={product.price} />
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-xs sm:text-sm md:text-base font-extrabold text-[var(--color-brand)] dark:text-white">
                                                <PriceText amount={product.price} />
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Arrow Button */}
                                <Link
                                    href={`/products/${product.slug}`}
                                    aria-label={isArabic ? `عرض تفاصيل ${product.nameAr || product.name}` : `View details for ${product.nameEn || product.name}`}
                                    className="shrink-0 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-all group-hover:bg-[var(--color-accent)] group-hover:border-[var(--color-accent)] group-hover:text-white shadow-2xs"
                                >
                                    <svg className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.5 3.75L13.75 10L7.5 16.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Show More / Less Toggle Button */}
            {products.length > initialCount && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="px-8 py-2.5 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white rounded-full font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xs cursor-pointer"
                    >
                        {showAll
                            ? (isArabic ? 'عرض أقل' : 'Show Less')
                            : (isArabic ? `عرض المزيد (${products.length - initialCount}+)` : `Show More (${products.length - initialCount}+)`)
                        }
                    </button>
                </div>
            )}
        </section>
    );
};

export default TrendingWeekly;

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MdChevronRight } from 'react-icons/md';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCurrency } from '@/app/context/CurrencyContext';
import ResilientImage from '@/app/components/ResilientImage';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
    id: string;
    slug: string;
    name: string;
    nameAr?: string | null;
    nameEn?: string | null;
    description: string | null;
    price: number;
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
    const { dir, language } = useLanguage();
    const isArabic = dir === 'rtl';
    const [showAll, setShowAll] = useState(false);
    const { formatPrice } = useCurrency();

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
        <section className="container-custom">
            {/* Header */}
            <div 
                className={`flex items-center justify-between mb-6 md:mb-8 px-1 gap-2 ${isArabic ? 'flex-row' : 'flex-row'}`}
            >
                <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#B8860B] dark:text-[#E5B54A] block mb-1">
                        {isArabic ? 'الأكثر طلباً هذا الأسبوع' : 'High Volume Demand'}
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#072835] dark:text-white leading-tight">
                        {isArabic ? 'تريندات هذا الأسبوع' : 'Trending This Week'}
                    </h2>
                </div>

                <Link
                    href="/products"
                    className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#072835] dark:text-[#E5B54A] hover:text-[#B8860B] transition-colors whitespace-nowrap"
                >
                    <span>{isArabic ? 'تسوق كل المنتجات' : 'View All'}</span>
                    <MdChevronRight className={`text-lg transition-transform ${isArabic ? 'rotate-180' : ''}`} />
                </Link>
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
                                className="group flex items-center gap-3 sm:gap-4 bg-[#FAF9F5] dark:bg-[#1E1E16] border border-[#B8860B]/15 hover:border-[#B8860B]/50 rounded-2xl p-3 sm:p-4 h-[112px] transition-all duration-300 shadow-2xs hover:shadow-xs"
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
                                        <p className="text-[10px] sm:text-[11px] font-bold text-[#B8860B] dark:text-[#E5B54A] mb-0.5 truncate uppercase tracking-wider">
                                            {getBrandName(product.brand.name)}
                                        </p>
                                    )}
                                    {/* Product Name */}
                                    <h3 className="text-xs sm:text-sm font-bold text-[#072835] dark:text-white truncate leading-snug mb-1">
                                        <Link
                                            href={`/products/${product.slug}`}
                                            className="hover:text-[#B8860B] transition-colors"
                                        >
                                            {isArabic ? (product.nameAr || product.name) : (product.nameEn || product.name)}
                                        </Link>
                                    </h3>
                                    {/* Price */}
                                    <div className="flex items-center gap-2">
                                        {product.discountPrice ? (
                                            <>
                                                <span className="text-xs sm:text-sm md:text-base font-extrabold text-[#2E7D32] dark:text-[#4ade80]">
                                                    {formatPrice(Number(product.discountPrice))}
                                                </span>
                                                <span className="text-[11px] text-gray-400 line-through">
                                                    {formatPrice(Number(product.price))}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-xs sm:text-sm md:text-base font-extrabold text-[#072835] dark:text-white">
                                                {formatPrice(Number(product.price))}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Arrow Button */}
                                <Link
                                    href={`/products/${product.slug}`}
                                    aria-label={isArabic ? `عرض تفاصيل ${product.nameAr || product.name}` : `View details for ${product.nameEn || product.name}`}
                                    className="shrink-0 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-all group-hover:bg-[#B8860B] group-hover:border-[#B8860B] group-hover:text-white shadow-2xs"
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
                        className="px-8 py-2.5 bg-[#072835] hover:bg-[#0c4054] text-white rounded-full font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xs cursor-pointer"
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

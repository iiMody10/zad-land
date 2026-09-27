'use client';

import React, { useState } from 'react';
import ResilientImage from '@/app/components/ResilientImage';
import { useLanguage } from '@/app/context/LanguageContext';
import Link from 'next/link';

export interface ReviewItem {
    id: string;
    name: string;
    feedback: string;
    rating: number;
    image?: string;
    productNameAr?: string;
    productNameEn?: string;
    productSlug?: string;
}

const StarIcons = () => (
    <div className="flex text-[var(--color-accent)] gap-1 mb-3 rtl:justify-end ltr:justify-start">
        {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16">
                <path d="M8 0.5L10.0784 5.63932L15.6085 6.02786L11.3629 9.59268L12.7023 14.9721L8 12.036L3.29772 14.9721L4.63706 9.59268L0.391548 6.02786L5.92159 5.63932L8 0.5Z" />
            </svg>
        ))}
    </div>
);

import { useProductRail } from '@/app/components/HomePageComponents/useProductRail';

interface Product {
    id: string;
    slug: string;
    name: string;
    images: string;
}

interface TestimonialsMasonryProps {
    reviews?: ReviewItem[];
    products?: Product[];
}

const TestimonialsMasonry = ({ reviews = [], products }: TestimonialsMasonryProps) => {
    const { language } = useLanguage();
    const { railRef, progressBarRef } = useProductRail(language === 'ar' ? 'rtl' : 'ltr');

    if (!reviews || reviews.length === 0) {
        return null;
    }

    return (
        <section className="w-full bg-white dark:bg-[#121212] overflow-hidden pb-10 md:pb-16">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
                    <h2 className="text-2xl md:text-[32px] font-bold text-[var(--color-brand)] dark:text-white leading-tight">
                        {language === 'ar' 
                            ? 'آراء وتقييمات شركائنا في التوزيع' 
                            : 'Verified Wholesale Customer Reviews'}
                    </h2>
                </div>

                {/* Scroll Wrapper */}
                <div className="relative">
                    <div 
                        ref={railRef}
                        className="-mx-4 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:px-0 md:overflow-visible"
                    >
                        {/* On desktop, we use columns. On mobile, we use flex snap-x */}
                        <div className="flex md:block md:columns-2 lg:columns-3 snap-x snap-mandatory gap-4 pb-2 md:gap-6">
                            {reviews.map((review) => {
                                const productUrl = review.productSlug ? `/products/${review.productSlug}` : '/products';
                                const productImg = review.image || '/placeholder.svg';
                                const productName = language === 'ar' 
                                    ? (review.productNameAr || review.productNameEn || 'منتجات زاد لاند') 
                                    : (review.productNameEn || review.productNameAr || 'Zad Land Products');

                                return (
                                    <div 
                                        key={review.id} 
                                        className="w-[300px] shrink-0 snap-start md:w-auto break-inside-avoid mb-0 md:mb-6 bg-[var(--color-canvas)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-accent)]/15 hover:border-[var(--color-accent)]/40 rounded-2xl p-5 md:p-6 flex flex-col h-fit text-right transition-all shadow-xs"
                                        style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                                    >
                                        <div className="flex flex-col mb-3">
                                            <h3 className="font-bold text-[var(--color-brand)] dark:text-white text-base md:text-lg">
                                                {language === 'ar' 
                                                    ? review.name.split('-')[0].trim() 
                                                    : (review.name.split('-')[1]?.trim() || review.name.split('-')[0].trim())}
                                            </h3>
                                            <span className="text-xs text-[var(--color-brand-hover)] dark:text-[var(--color-brand-light)] font-semibold mt-0.5 flex items-center gap-1">
                                                <span>✓</span>
                                                <span>{language === 'ar' ? 'عميل جملة معتمد' : 'Verified Wholesale Buyer'}</span>
                                            </span>
                                        </div>

                                        <StarIcons />

                                        <p className="text-[#4a4a3e] dark:text-[var(--color-text-muted-dark)] text-sm md:text-base leading-relaxed mb-6">
                                            {review.feedback}
                                        </p>

                                        <Link href={productUrl} className="mt-auto pt-4 border-t border-gray-200/80 dark:border-white/10 group flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 shadow-xs border border-gray-100 p-1">
                                                <ResilientImage
                                                    src={productImg}
                                                    alt=""
                                                    sizes="48px"
                                                    className="w-full h-full object-contain"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-[var(--color-brand)] dark:text-white line-clamp-2 text-right flex-1 group-hover:text-[var(--color-accent)] transition-colors">
                                                <span>{productName}</span>
                                            </span>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Mobile Progress Bar */}
                <div className="mt-8 flex items-center gap-4 px-2 w-full md:hidden">
                    <div className="flex-1 h-[2px] bg-gray-200 relative overflow-hidden rounded-full">
                        <div 
                            ref={progressBarRef}
                            className="absolute top-0 bottom-0 bg-[#000000] rounded-full" 
                            style={{ 
                                width: '100%', 
                                transformOrigin: language === 'ar' ? 'right center' : 'left center', 
                                transform: `scaleX(0)`, 
                                willChange: 'transform' 
                            }} 
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default TestimonialsMasonry;

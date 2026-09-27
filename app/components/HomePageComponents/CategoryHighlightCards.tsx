'use client';

import React from 'react';
import Link from 'next/link';
import ResilientImage from '@/app/components/ResilientImage';
import type { HomeMainCategory } from '@/lib/admin-actions';

interface CategoryHighlightCardsProps {
    categories?: HomeMainCategory[];
    language?: 'en' | 'ar';
}

const CategoryHighlightCards = ({ categories = [], language = 'ar' }: CategoryHighlightCardsProps) => {
    const isArabic = language === 'ar';
    const hasDesktopOverflow = categories.length > 5;
    const categoriesRailRef = React.useRef<HTMLDivElement>(null);

    const scrollCategories = (direction: 'left' | 'right') => {
        categoriesRailRef.current?.scrollBy({
            left: direction === 'left' ? -320 : 320,
            behavior: 'smooth',
        });
    };

    if (!categories.length) return null;

    return (
        <section className="container-custom px-2.5 py-1 sm:px-3.5 sm:py-2 md:px-4 md:py-4" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="mb-5 px-2">
                <div className="mb-3 flex items-center justify-center gap-3 text-[var(--color-accent)] sm:gap-4 md:mb-5 md:gap-6">
                    <div className="h-[1.5px] flex-1 max-w-[36px] bg-gradient-to-r from-transparent via-[var(--color-accent-light)]/40 to-[var(--color-accent)] sm:max-w-[90px] md:max-w-[200px] dark:to-[var(--color-accent-light)]" />
                    <svg className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2C11.5 4 10.5 6 9 7.5C10.5 9 11.5 11 12 13C12.5 11 13.5 9 15 7.5C13.5 6 12.5 4 12 2Z" opacity="0.9" />
                        <path d="M7 6C6.5 8 5.5 10 4 11.5C5.5 13 6.5 15 7 17C7.5 15 8.5 13 10 11.5C8.5 10 7.5 8 7 6Z" />
                        <path d="M17 6C16.5 8 15.5 10 14 11.5C15.5 13 16.5 15 17 17C17.5 15 18.5 13 20 11.5C18.5 10 17.5 8 17 6Z" />
                        <path d="M12 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <h2 className="whitespace-nowrap px-1 text-base font-extrabold tracking-tight text-[var(--color-brand)] sm:text-2xl md:text-[28px] dark:text-white">
                        {isArabic ? 'أقسامنا الرئيسية' : 'Our Main Categories'}
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

            {/* Category rail: touch-scrollable on mobile, button-controlled on larger screens */}
            <div className="relative">
                <div
                    ref={categoriesRailRef}
                    className={`-mx-2.5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-2.5 scrollbar-hide sm:-mx-3.5 sm:gap-3 sm:px-3.5 md:mx-0 md:gap-4 lg:gap-5 ${hasDesktopOverflow ? 'md:overflow-x-auto md:px-8 md:scroll-smooth' : 'md:grid md:grid-cols-5 md:overflow-visible md:px-0'}`}
                >
                {categories.map((category) => {
                    const title = isArabic ? category.nameAr : category.nameEn;
                    return (
                        <Link
                            key={category.id}
                            href={`/department/${category.slug}`}
                            dir={isArabic ? 'rtl' : 'ltr'}
                            className={`group relative flex w-[140px] shrink-0 snap-start flex-col aspect-[100/136] sm:w-[160px] sm:aspect-[100/132] ${hasDesktopOverflow ? 'md:w-[240px] md:aspect-[1/1.22]' : 'md:w-full md:shrink md:aspect-[1/1.22]'} lg:aspect-[1/1.18] bg-[var(--color-canvas)] dark:bg-[var(--color-surface-dark)] rounded-2xl sm:rounded-[22px] md:rounded-2xl lg:rounded-3xl overflow-hidden border border-[var(--color-accent)]/25 hover:border-[var(--color-accent)]/70 shadow-xs hover:shadow-sm transition-colors duration-200 active:scale-[0.99] text-center`}
                        >
                            {/* Top Image: Full-bleed top portion with increased height */}
                            <div className="relative w-full h-[68%] sm:h-[70%] overflow-hidden rounded-t-2xl sm:rounded-t-[22px] md:rounded-t-3xl lg:rounded-t-[32px] bg-[var(--color-canvas)] dark:bg-[var(--color-surface-dark)]">
                                <ResilientImage
                                    src={category.image}
                                    alt={title}
                                    sizes="(max-width: 768px) 25vw, 350px"
                                    className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                                />
                            </div>

                            {/* Bottom Text: Pure cream background with 2 lines of bold, larger Arabic typography */}
                            <div className="w-full h-[32%] sm:h-[30%] flex items-center justify-center px-1 sm:px-2 md:px-4 pb-1 sm:pb-2 text-center bg-[var(--color-canvas)] dark:bg-[var(--color-surface-dark)]">
                                <h3 className="text-[11.5px] sm:text-[13px] md:text-sm lg:text-base font-bold text-[var(--color-brand)] dark:text-gray-100 text-center leading-[1.25] sm:leading-[1.3] md:leading-[1.35] whitespace-pre-line group-hover:text-[var(--color-accent)] transition-colors">
                                    {title}
                                </h3>
                            </div>
                        </Link>
                    );
                })}
                </div>

                {hasDesktopOverflow && (
                    <>
                        <button
                            type="button"
                            onClick={() => scrollCategories('left')}
                            aria-label={isArabic ? 'الفئات السابقة' : 'Previous categories'}
                            className="absolute left-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-accent)]/25 bg-white/95 text-2xl leading-none text-[var(--color-accent)] shadow-md transition-colors hover:bg-[var(--color-canvas)] md:flex"
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollCategories('right')}
                            aria-label={isArabic ? 'الفئات التالية' : 'Next categories'}
                            className="absolute right-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-accent)]/25 bg-white/95 text-2xl leading-none text-[var(--color-accent)] shadow-md transition-colors hover:bg-[var(--color-canvas)] md:flex"
                        >
                            ›
                        </button>
                    </>
                )}
            </div>
        </section>
    );
};

export default CategoryHighlightCards;

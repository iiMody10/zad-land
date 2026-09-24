import React from 'react';
import Link from 'next/link';
import ResilientImage from '@/app/components/ResilientImage';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

interface Category {
    id: string;
    name: string;
    nameEn?: string;
    slug: string;
    description: string | null;
    image: string | null;
    brandId: string;
    isFeatured: boolean;
    brand?: {
        id: string;
        name: string;
        slug: string;
    } | null;
}

interface FeaturedCategoriesGridProps {
    categories: Category[];
    language?: 'en' | 'ar';
    dir?: 'rtl' | 'ltr';
}

const FeaturedCategoriesGrid = ({ categories, language = 'ar', dir = 'rtl' }: FeaturedCategoriesGridProps) => {
    const isArabic = language === 'ar';

    if (!categories || categories.length === 0) {
        return null;
    }

    const CATEGORY_NAMES_EN: Record<string, string> = {
        'مشروبات باردة': 'Cold Beverages',
        'مشروب ايس كوفي': 'Iced Coffee',
        'مشروب غازي': 'Soft Drinks',
        'مشروب ميلاف': 'Milaf Beverages',
        'معكرونة': 'Pasta',
        'مفرزات': 'Frozen Foods',
        'صوصات': 'Sauces & Condiments',
        'تونة': 'Tuna & Seafood',
        'أرز': 'Rice',
        'زيوت': 'Cooking Oils',
        'شوكولاتة وسكاكر': 'Confectionery & Sweets',
        'بسكويت': 'Biscuits & Cookies',
        'منظفات': 'Detergents & Cleaners',
        'عناية شخصية': 'Personal Care',
        'شاي وأعشاب': 'Tea & Herbs',
        'حليب وألبان': 'Dairy Products',
        'مكسرات': 'Nuts & Seeds',
    };

    const getDisplayName = (cat: Category) => {
        if (isArabic) {
            return cat.name;
        }
        if (CATEGORY_NAMES_EN[cat.name]) {
            return CATEGORY_NAMES_EN[cat.name];
        }
        if (cat.nameEn && !cat.nameEn.startsWith('Products for')) {
            return cat.nameEn;
        }
        if (cat.description && !cat.description.startsWith('Products for')) {
            return cat.description;
        }
        return cat.name;
    };

    const getBrandName = (cat: Category) => {
        if (!cat.brand?.name) return null;
        const parts = cat.brand.name.split('-');
        if (isArabic) {
            return parts[1]?.trim() || parts[0]?.trim();
        }
        return parts[0]?.trim();
    };

    return (
        <section className="container-custom pb-5 pt-6 md:pb-8 md:pt-10" dir={dir}>
            {/* Shared ornamental section header */}
            <div className="mb-6 px-2">
                <div className="mb-3 flex items-center justify-center gap-3 text-[#B8860B] sm:gap-4 md:mb-5 md:gap-6">
                    <div className="h-[1.5px] flex-1 max-w-[36px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-[#B8860B] sm:max-w-[90px] md:max-w-[200px] dark:to-[#E5B54A]" />
                    <svg className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2C11.5 4 10.5 6 9 7.5C10.5 9 11.5 11 12 13C12.5 11 13.5 9 15 7.5C13.5 6 12.5 4 12 2Z" opacity="0.9" />
                        <path d="M7 6C6.5 8 5.5 10 4 11.5C5.5 13 6.5 15 7 17C7.5 15 8.5 13 10 11.5C8.5 10 7.5 8 7 6Z" />
                        <path d="M17 6C16.5 8 15.5 10 14 11.5C15.5 13 16.5 15 17 17C17.5 15 18.5 13 20 11.5C18.5 10 17.5 8 17 6Z" />
                        <path d="M12 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <h2 id="featured-categories-title" className="whitespace-nowrap px-1 text-base font-extrabold tracking-tight text-[#072835] sm:text-2xl md:text-[28px] dark:text-white">
                        {isArabic ? 'أهم الفئات والأكثر طلباً' : 'Top Categories & Best Sellers'}
                    </h2>
                    <svg className="h-4 w-4 shrink-0 scale-x-[-1] sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2C11.5 4 10.5 6 9 7.5C10.5 9 11.5 11 12 13C12.5 11 13.5 9 15 7.5C13.5 6 12.5 4 12 2Z" opacity="0.9" />
                        <path d="M7 6C6.5 8 5.5 10 4 11.5C5.5 13 6.5 15 7 17C7.5 15 8.5 13 10 11.5C8.5 10 7.5 8 7 6Z" />
                        <path d="M17 6C16.5 8 15.5 10 14 11.5C15.5 13 16.5 15 17 17C17.5 15 18.5 13 20 11.5C18.5 10 17.5 8 17 6Z" />
                        <path d="M12 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <div className="h-[1.5px] flex-1 max-w-[36px] bg-gradient-to-l from-transparent via-[#C5A059]/40 to-[#B8860B] sm:max-w-[90px] md:max-w-[200px] dark:to-[#E5B54A]" />
                </div>

                <div className="flex items-center justify-center text-center">
                    <Link
                        href="/products"
                        className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#B8860B]/25 bg-[#FAF6ED] px-3 py-1 text-xs font-bold text-[#072835] transition-colors hover:border-[#B8860B]/60 hover:text-[#B8860B] dark:bg-white/5 dark:text-[#E5B54A]"
                    >
                        <span>{isArabic ? 'تصفح كافة الأقسام' : 'View All Categories'}</span>
                        <MdChevronRight className={`text-base transition-transform ${isArabic ? 'rotate-180' : ''}`} />
                    </Link>
                </div>
            </div>

            {/* Swipeable category carousel on mobile, multi-column grid on larger screens */}
            <div className="-mx-2.5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-2.5 scrollbar-hide sm:-mx-3.5 sm:gap-4 sm:px-3.5 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-5 xl:grid-cols-6">
                {categories.map((category) => {
                    const brandName = getBrandName(category);
                    const displayName = getDisplayName(category);

                    return (
                        <div key={category.id} className="w-[218px] shrink-0 snap-start sm:w-[240px] md:w-auto">
                            <Link
                                href={`/categories/${category.slug}`}
                                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#B8860B]/20 bg-white dark:bg-[#1E1E16] shadow-xs hover:border-[#B8860B]/60 transition-colors duration-200"
                            >
                                {/* Product/category image */}
                                <div className="relative aspect-[1.15] w-full overflow-hidden bg-[#FAF9F5] dark:bg-zinc-900">
                                    {category.image ? (
                                        <ResilientImage
                                            src={category.image}
                                            alt={displayName}
                                            sizes="(max-width: 640px) 218px, (max-width: 1024px) 25vw, 240px"
                                            className="h-full w-full object-contain p-2.5 transition-transform duration-300 group-hover:scale-[1.03]"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-[#F8F7F2] dark:bg-zinc-800" />
                                    )}
                                </div>

                                {/* Clear catalog details */}
                                <div className="flex flex-1 flex-col justify-between gap-3 p-3.5 text-start sm:p-4">
                                    <div className="min-w-0">
                                        {brandName && (
                                            <span className="mb-1 block truncate text-[9px] font-bold uppercase tracking-[0.16em] text-[#B8860B] dark:text-[#E5B54A] sm:text-[10px]">
                                                {brandName}
                                            </span>
                                        )}
                                        <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-[#072835] transition-colors group-hover:text-[#B8860B] dark:text-white sm:text-base">
                                            {displayName}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 border-t border-[#B8860B]/15 pt-2.5 text-[10px] font-bold text-[#B8860B] dark:border-white/10 dark:text-[#E5B54A] sm:text-[11px]">
                                        <span>{isArabic ? 'تسوق القسم' : 'Shop Category'}</span>
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FAF6ED] transition-colors group-hover:bg-[#B8860B] group-hover:text-white dark:bg-white/5">
                                            {isArabic ? (
                                                <MdChevronLeft className="text-base" />
                                            ) : (
                                                <MdChevronRight className="text-base" />
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default FeaturedCategoriesGrid;

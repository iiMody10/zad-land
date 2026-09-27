import Link from 'next/link';
import React from 'react';
import { getI18n } from '@/lib/i18n';
import type { HomeBrand } from '@/lib/admin-actions';
import ResilientImage from '@/app/components/ResilientImage';

interface ShopByCategoryProps {
    mainBrands: HomeBrand[];
}

// Display type that doesn't depend on Prisma enums
interface DisplayCategory {
    id: string;
    name: string;
    slug: string;
    image: string | null;
}

const ShopByCategory = async ({ mainBrands }: ShopByCategoryProps) => {
    const { t, language } = await getI18n();

    // Desired order for the 4 main categories
    const categoryOrder = ['pasta-grains', 'canned-fish', 'sauces-condiments', 'frozen-foods'];

    const localizedNames: Record<string, { en: string; ar: string }> = {
        'pasta-grains': { en: 'Pasta & Grains', ar: 'المعكرونة والحبوب' },
        'canned-fish': { en: 'Canned Fish & Tuna', ar: 'التونة والأسماك المعلبة' },
        'sauces-condiments': { en: 'Sauces & Condiments', ar: 'الصلصات والتوابل' },
        'frozen-foods': { en: 'Frozen Foods', ar: 'المفرزات والبحريات' },
    };

    const getLocalizedName = (slug: string): string => {
        return language === 'ar'
            ? localizedNames[slug]?.ar || localizedNames[slug]?.en || slug
            : localizedNames[slug]?.en || slug;
    };

    // Build display categories in the desired order
    const displayCategories: DisplayCategory[] = categoryOrder.map(slug => {
        const brand = mainBrands.find(b => b.slug === slug);
        return {
            id: brand?.id || slug,
            name: getLocalizedName(slug),
            slug,
            image: brand?.image || null,
        };
    });

    return (
        <section className="container-custom py-6 md:py-10">
            <div className="w-full">
                <h3 className="text-2xl md:text-3xl font-bold text-text-main-light dark:text-text-main-dark mb-8 text-center">
                    {t('home.shopByCategory')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                    {displayCategories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="group flex flex-col items-center gap-3 transition-all duration-300"
                        >
                            {/* Card Image Container - Rectangular like the design */}
                            <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-50 dark:bg-white/5 shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                                <ResilientImage
                                    src={category.image}
                                    alt={category.name}
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Subtle gradient overlay on hover */}
                                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Category Name & Shop Now CTA */}
                            <div className="flex flex-col items-center text-center gap-1">
                                <h4 className="text-sm md:text-base font-bold text-text-main-light dark:text-text-main-dark transition-colors">
                                    <span className="group-hover-underline-animated">{category.name}</span>
                                </h4>
                                <span className="text-xs text-primary font-medium">
                                    {t('home.shopNowCta')}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShopByCategory;


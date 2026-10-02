import React from 'react';
import dynamic from 'next/dynamic';
import type { HomeBrand, HomepageBanner, RailBrand } from '@/lib/admin-actions';
import BrandsRail from './BrandsRail';

import FeaturedCollection from './FeaturedCollection';
import PromoBanner from './PromoBanner';
import TrendingWeekly from './TrendingWeekly';
import FeaturedCategoriesGrid from './FeaturedCategoriesGrid';
import CategoryHighlightCards from './CategoryHighlightCards';
import AboutSupplyBanner from './AboutSupplyBanner';
import ScrollReveal from '../ScrollReveal';
import { getI18n } from '@/lib/i18n';

import HeroCarousel from './HeroCarousel';

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
    price: number | null;
    discountPrice?: number | null;
    images: string;
    categoryId: string;
    stock: number | null;
    pricingNeedsReview?: boolean;
    isTrending: boolean;
    category: {
        name: string;
    } | null;
    brand?: {
        id: string;
        name: string;
        slug: string;
        group?: string;
    } | null;
}

import type { HomeMainCategory } from '@/lib/admin-actions';

interface FeaturedCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    brandId: string;
    isFeatured: boolean;
}

interface MainProps {
    banners: HomepageBanner[];
    mainBrands: HomeBrand[];
    railBrands: RailBrand[];
    mainCategories: HomeMainCategory[];
    featuredNewArrivals: Product[];
    featuredBestSellers: Product[];
    trendingWeekly: Product[];
    featuredCategories: FeaturedCategory[];
    settings: any;
}

const Main = async ({
    banners,
    mainBrands,
    railBrands,
    mainCategories,
    featuredNewArrivals,
    featuredBestSellers,
    trendingWeekly,
    featuredCategories,
    settings,
}: MainProps) => {
    const { dir, language } = await getI18n();

    return (
        <main className="w-full flex flex-col gap-y-6 md:gap-y-[80px] pb-12">
            {/* Redesigned Showcase Zone matching Target Design */}
            <div className="flex flex-col gap-y-3 sm:gap-y-4 md:gap-y-6">
                {/* 1 & 2. Hero Carousel + Overlapping Brands Rail */}
                <div className="relative w-full">
                    <HeroCarousel banners={banners} />
                    <BrandsRail brands={railBrands} />
                </div>

                {/* 3. Global Products Banner */}
                <PromoBanner settings={settings} dir={dir} language={language} />

                {/* 4. Category Highlight Cards */}
                <CategoryHighlightCards categories={mainCategories} language={language} />
            </div>

            {/* 5. الجديد والمحبوب (New Arrivals & Best Sellers) */}
            <ScrollReveal>
                <FeaturedCollection
                    newArrivals={featuredNewArrivals}
                    bestSellers={featuredBestSellers}
                    settings={settings}
                />
            </ScrollReveal>

            {/* About Zad Land banner */}
            <ScrollReveal className="relative z-20">
                <AboutSupplyBanner language={language} dir={dir} />
            </ScrollReveal>

            {/* Featured Categories Grid (Top Categories. Best Sellers) */}
            <ScrollReveal>
                <FeaturedCategoriesGrid categories={featuredCategories} language={language} dir={dir} />
            </ScrollReveal>

            {/* 7. Trending This Week - Horizontal Product Cards */}
            <ScrollReveal>
                <TrendingWeekly products={trendingWeekly} />
            </ScrollReveal>

        </main>
    );
};

export default Main;

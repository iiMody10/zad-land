import Main from "../components/HomePageComponents/Main";
import {
    getActiveBanners,
    getMainCategoryBrands,
    getHomeRailBrands,
    getHomeRailCategories,
    getBestSellerProducts,
    getOnSaleProducts,
    getNewArrivalProducts,
    getSiteSettings,
    getTrendingWeeklyProducts,
    getFeaturedCategories,
} from "../../lib/admin-actions";

// Keep the homepage fresh enough to recover after transient data-source failures.
export const revalidate = 300;

async function loadHomeSection<T>(name: string, load: () => Promise<T>, fallback: T): Promise<T> {
    try {
        return await load();
    } catch (error) {
        console.error(`Failed to load homepage ${name}:`, error);
        return fallback;
    }
}

export default async function Home() {
    const [
        banners,
        mainBrands,
        railBrands,
        mainCategories,
        featuredBestSellers,
        featuredNewArrivals,
        featuredBundles,
        settings,
        trendingWeekly,
        featuredCategories,
    ] = await Promise.all([
        loadHomeSection("banners", getActiveBanners, []),
        loadHomeSection("main brands", getMainCategoryBrands, []),
        loadHomeSection("brand rail", getHomeRailBrands, []),
        loadHomeSection("main categories", getHomeRailCategories, []),
        loadHomeSection("best sellers", getBestSellerProducts, []),
        loadHomeSection("new arrivals", getNewArrivalProducts, []),
        loadHomeSection("sale products", getOnSaleProducts, []),
        loadHomeSection("site settings", getSiteSettings, null),
        loadHomeSection("weekly trends", getTrendingWeeklyProducts, []),
        loadHomeSection("featured categories", getFeaturedCategories, []),
    ]);

    const firstBannerImage = banners?.[0]?.image;

    return (
        <>
            {firstBannerImage && (
                <link rel="preload" as="image" href={firstBannerImage} fetchPriority="high" />
            )}
            <section>
                <Main
                    banners={banners}
                    mainBrands={mainBrands}
                    railBrands={railBrands}
                    mainCategories={mainCategories}
                    featuredNewArrivals={featuredNewArrivals}
                    featuredBundles={featuredBundles}
                    featuredBestSellers={featuredBestSellers}
                    settings={settings}
                    trendingWeekly={trendingWeekly}
                    featuredCategories={featuredCategories}
                />
            </section>
        </>
    );
}

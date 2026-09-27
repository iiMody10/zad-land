import { MetadataRoute } from 'next';
import { laravelJson } from '@/lib/laravel-server';

export const revalidate = 3600; // Revalidate sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zadland.com';

    try {
        // 1. Static high-priority routes
        const staticRoutes: MetadataRoute.Sitemap = [
            {
                url: `${baseUrl}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            },
            {
                url: `${baseUrl}/products`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/brands`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/categories`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/about-us`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            },
            {
                url: `${baseUrl}/shipping-returns`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
            },
        ];

        const catalog = await laravelJson<{
            products: { slug: string; updatedAt: string }[];
            departments: { slug: string; updatedAt: string }[];
            brands: { slug: string; updatedAt: string }[];
            categories: { slug: string; updatedAt: string }[];
        }>("/api/sitemap", { products: [], departments: [], brands: [], categories: [] }, { forwardSession: false });

        const productRoutes: MetadataRoute.Sitemap = catalog.products.map((product) => ({
            url: `${baseUrl}/products/${product.slug}`,
            lastModified: new Date(product.updatedAt),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        // 3. Fetch all active Main Categories (Departments)
        const departmentRoutes: MetadataRoute.Sitemap = catalog.departments.map((dept) => ({
            url: `${baseUrl}/department/${dept.slug}`,
            lastModified: new Date(dept.updatedAt),
            changeFrequency: 'weekly',
            priority: 0.85,
        }));

        // 4. Fetch all active Brands
        const brandRoutes: MetadataRoute.Sitemap = catalog.brands.map((brand) => ({
            url: `${baseUrl}/brands/${brand.slug}`,
            lastModified: new Date(brand.updatedAt),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        // 5. Fetch all active Categories
        const categoryRoutes: MetadataRoute.Sitemap = catalog.categories.map((cat) => ({
            url: `${baseUrl}/categories/${cat.slug}`,
            lastModified: new Date(cat.updatedAt),
            changeFrequency: 'weekly',
            priority: 0.75,
        }));

        return [
            ...staticRoutes,
            ...departmentRoutes,
            ...productRoutes,
            ...brandRoutes,
            ...categoryRoutes,
        ];
    } catch (error) {
        console.error('Failed to generate dynamic sitemap:', error);
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            },
        ];
    }
}

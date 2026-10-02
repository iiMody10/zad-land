import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zad-land.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/products',
                    '/products/*',
                    '/department/*',
                    '/categories/*',
                    '/brands/*',
                    '/about-us',
                    '/shipping-returns',
                    '/privacy-policy',
                ],
                disallow: [
                    '/admin/',
                    '/admin/*',
                    '/api/',
                    '/api/*',
                    '/cart',
                    '/place-order',
                    '/complete-order',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

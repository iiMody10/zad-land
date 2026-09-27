import { getSiteSettings } from "@/lib/admin-actions";
import AboutUsClient from "./AboutUsClient";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
    const [settings, cookieStore] = await Promise.all([getSiteSettings(), cookies()]);
    const isEnglish = cookieStore.get('language')?.value === 'en';
    const title = (isEnglish ? settings?.aboutSeoTitle : settings?.aboutSeoTitleAr)?.trim()
        || (isEnglish ? "About Zad Land | Wholesale distribution" : "من نحن | زاد لاند لتجارة وتوزيع المواد الغذائية");
    const description = (isEnglish ? settings?.aboutSeoDescription : settings?.aboutSeoDescriptionAr)?.trim()
        || (isEnglish ? "Learn how Zad Land connects trusted food and consumer brands with retailers and businesses." : "تعرف على زاد لاند وشبكة التوريد التي تربط العلامات التجارية بالمتاجر وأصحاب الأعمال.");

    return {
        title,
        description,
        alternates: {
            canonical: "/about-us",
        },
        openGraph: {
            title,
            description,
            url: "/about-us",
            images: [
                {
                    url: "/og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: isEnglish ? "About Zad Land" : "من نحن في زاد لاند",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/og-image.jpg"],
        },
    };
}

export default async function AboutUsPage() {
    const settings = await getSiteSettings();
    if (settings?.aboutPageEnabled === false) notFound();

    return <AboutUsClient settings={settings} />;
}

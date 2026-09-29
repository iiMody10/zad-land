import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getI18n } from '@/lib/i18n';
import { getSiteSettings } from '@/lib/admin-actions';
import { parseContactPageContent } from '@/lib/contact-page-content';
import ContactClient from './ContactClient';

export async function generateMetadata(): Promise<Metadata> {
    const [{ language }, settings] = await Promise.all([getI18n(), getSiteSettings()]);
    const content = parseContactPageContent(settings?.contactPageContent);
    const title = language === 'ar' ? content.seoTitleAr : content.seoTitleEn;
    const description = language === 'ar' ? content.seoDescriptionAr : content.seoDescriptionEn;

    return {
        title,
        description,
        alternates: { canonical: '/contact' },
        openGraph: { title, description, url: '/contact' },
    };
}

export default async function ContactPage() {
    const [{ language, dir }, settings] = await Promise.all([getI18n(), getSiteSettings()]);
    const content = parseContactPageContent(settings?.contactPageContent);
    if (!content.pageEnabled) notFound();

    return <ContactClient language={language} dir={dir} settings={settings} content={content} />;
}

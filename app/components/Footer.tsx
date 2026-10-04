import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import PlatformIcon from '@/app/components/PlatformIcon';
import { Mail as LuMail, MapPin as LuMapPin, Phone as LuPhone } from 'lucide-react';
import { parseCompanyContacts, toWhatsAppUrl } from '@/lib/business-contact';
import CompanyContacts from './CompanyContacts';
import { getFooterCategories } from '@/lib/catalog';
import { getSiteSettings } from '@/lib/admin-actions';

interface FooterProps {
    t: (key: string) => string;
    language: string;
}

function isExternalUrl(url: string) {
    return /^(https?:\/\/|mailto:|tel:)/i.test(url);
}

function getLocalizedValue(language: string, englishValue?: string | null, arabicValue?: string | null) {
    if (language === 'ar') {
        return arabicValue || englishValue || "";
    }

    return englishValue || arabicValue || "";
}

const Footer = async ({ t, language }: FooterProps) => {
    const settings = await getSiteSettings();
    const footerCategories = await getFooterCategories([
        settings?.footerCategory1Id || "",
        settings?.footerCategory2Id || "",
        settings?.footerCategory3Id || "",
        settings?.footerCategory4Id || "",
    ]).catch(() => []);

    const brandTitle = getLocalizedValue(language, settings?.footerBrandTitle, settings?.footerBrandTitleAr) || t('header.brandName');
    const brandDescription = getLocalizedValue(language, settings?.footerBrandDescription, settings?.footerBrandDescriptionAr) || t('footer.brandDescription');
    const copyright = getLocalizedValue(language, settings?.footerCopyright, settings?.footerCopyrightAr) || t('footer.copyright');
    const shopTitle = getLocalizedValue(language, settings?.footerShopTitle, settings?.footerShopTitleAr) || t('footer.shop');
    const contactTitle = getLocalizedValue(language, settings?.footerContactTitle, settings?.footerContactTitleAr) || (language === 'ar' ? 'معلومات التواصل' : 'Contact Information');
    const contactAddress = getLocalizedValue(language, settings?.footerAddress, settings?.footerAddressAr);
    const contactPhone = settings?.footerPhone || '';
    const companyContacts = parseCompanyContacts(settings?.companyContacts);
    const contactEmail = settings?.footerEmail || '';
    const whatsappLabel = getLocalizedValue(language, settings?.footerWhatsappLabel, settings?.footerWhatsappLabelAr);
    const whatsappUrl = settings?.footerWhatsappUrl && settings.footerWhatsappUrl !== '#'
        ? settings.footerWhatsappUrl
        : toWhatsAppUrl(contactPhone);
    const phoneHref = contactPhone.replace(/[^\d+]/g, '');

    const socialLinks = [
        {
            href: settings?.footerInstagramUrl || "#",
            platform: 'instagram' as const,
            label: "Instagram",
        },
        {
            href: settings?.footerFacebookUrl || "#",
            platform: 'facebook' as const,
            label: "Facebook",
        },
        {
            href: whatsappUrl,
            platform: 'whatsapp' as const,
            label: "WhatsApp",
        },
    ].filter((link) => link.href && link.href !== "#");

    const isArabic = language === 'ar';
    const companyTitle = getLocalizedValue(language, settings?.footerCompanyTitle, settings?.footerCompanyTitleAr) || (isArabic ? 'عن زاد لاند' : 'About Zad Land');
    const companyDefaults = [
        { en: 'About Us', ar: 'من نحن', href: '/about-us' },
        { en: 'Our Brands', ar: 'علاماتنا التجارية', href: '/brands' },
        { en: 'Contact Us', ar: 'تواصل معنا', href: '/contact' },
    ];
    const companyLinks = companyDefaults.map((fallback, index) => {
        const slot = index + 1;
        return {
            label: getLocalizedValue(language, settings?.[`footerCompanyLink${slot}Label`], settings?.[`footerCompanyLink${slot}LabelAr`]) || (isArabic ? fallback.ar : fallback.en),
            href: settings?.[`footerCompanyLink${slot}Url`] && settings[`footerCompanyLink${slot}Url`] !== '#'
                ? settings[`footerCompanyLink${slot}Url`]
                : fallback.href,
        };
    });

    const supportTitle = getLocalizedValue(language, settings?.footerSupportTitle, settings?.footerSupportTitleAr) || (isArabic ? 'الدعم والسياسات' : 'Support & Policies');
    const configuredSupportLinks = [1, 2, 3].flatMap((slot) => {
        const href = settings?.[`footerSupportLink${slot}Url`];
        const label = getLocalizedValue(language, settings?.[`footerSupportLink${slot}Label`], settings?.[`footerSupportLink${slot}LabelAr`]);
        return href && href !== '#' && label ? [{ label, href }] : [];
    });
    const supportDefaults = [
        { en: 'Shipping & Returns', ar: 'الشحن والتوصيل', href: '/shipping-returns' },
        { en: 'Privacy Policy', ar: 'سياسة الخصوصية', href: '/privacy-policy' },
    ];
    const supportLinks = [...configuredSupportLinks];
    supportDefaults.forEach((fallback) => {
        const normalizedFallback = fallback.href.replace(/\/$/, '');
        if (!supportLinks.some((link) => link.href.replace(/\/$/, '') === normalizedFallback)) {
            supportLinks.push({ label: isArabic ? fallback.ar : fallback.en, href: fallback.href });
        }
    });

    const renderNavLink = (label: string, href: string) => {
        if (isExternalUrl(href)) {
            return (
                <a className="hover:text-[var(--color-accent-light)] transition-colors" href={href} target="_blank" rel="noopener noreferrer">
                    {label}
                </a>
            );
        }

        return (
            <Link className="hover:text-[var(--color-accent-light)] transition-colors" href={href}>
                {label}
            </Link>
        );
    };

    const FOOTER_CAT_TRANSLATIONS: Record<string, string> = {
        'مشروبات باردة': 'Cold Beverages',
        'مشروب ايس كوفي': 'Iced Coffee',
        'مشروب غازي': 'Soft Drinks',
        'معكرونة': 'Pasta',
        'مفرزات': 'Frozen Foods',
        'صوصات': 'Sauces & Condiments',
        'تونة': 'Tuna & Seafood',
        'أرز': 'Rice',
        'شوكولاتة وسكاكر': 'Sweets & Confectionery',
        'منظفات': 'Detergents & Cleaners',
        'عناية شخصية': 'Personal Care',
        'حليب وألبان': 'Dairy Products',
        'بسكويت': 'Biscuits & Cookies',
    };

    return (
        <footer
            className="relative overflow-hidden border-t-2 border-[var(--color-accent)]/70 bg-[var(--color-brand)] text-white"
            dir={isArabic ? 'rtl' : 'ltr'}
        >
            <div className="absolute inset-0 bg-[var(--color-brand)] bg-[url('/images/footer-bg.webp')] bg-cover bg-center bg-no-repeat opacity-90" aria-hidden="true" />
            <div className="absolute inset-0 bg-[var(--color-brand)]/45" aria-hidden="true" />

            <div className="relative">
                <div className="container-custom px-4 py-6 sm:py-8 md:py-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.9fr_0.85fr_0.9fr_1.1fr_0.8fr] lg:gap-0">
                        {/* Brand */}
                        <div className="flex flex-col items-center text-center sm:col-span-2 lg:col-span-1 lg:items-start lg:border-e lg:border-[var(--color-accent)]/25 lg:pe-10 lg:text-start">
                            <Link href="/" className="group mb-3 inline-flex">
                                <Image
                                    src="/images/zad-land-white-logo.webp"
                                    alt={brandTitle}
                                    width={1535}
                                    height={1025}
                                    className="h-auto w-32 object-contain sm:w-36"
                                />
                            </Link>
                            <p className="max-w-xs text-xs leading-relaxed text-[var(--color-text-main-dark)]/85 sm:text-sm">
                                {brandDescription}
                            </p>
                            <p className="mt-2 text-xs font-bold text-[var(--color-accent-light)]">
                                {isArabic ? 'من سوريا .. إلى كل الأسواق' : 'From Syria to every market'}
                            </p>
                            <div className="mt-4 flex items-center gap-2.5">
                                {socialLinks.map((social) => {
                                    return (
                                        <a
                                            key={social.label}
                                            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-accent)]/35 bg-black/10 text-sm text-[var(--color-accent-light)] transition-all hover:border-[var(--color-accent-light)] hover:bg-[var(--color-accent)] hover:text-white"
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                        >
                                            <PlatformIcon platform={social.platform} className="size-4" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="text-center lg:border-e lg:border-[var(--color-accent)]/25 lg:px-5">
                            <h5 className="mb-4 text-sm font-extrabold text-[var(--color-accent-light)]">{companyTitle}</h5>
                            <ul className="flex flex-col gap-2 text-xs font-medium text-[var(--color-text-main-dark)]/85 sm:text-sm">
                                {companyLinks.map((link) => (
                                    <li key={link.href}>{renderNavLink(link.label, link.href)}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Shipping and privacy policies */}
                        <div className="text-center lg:border-e lg:border-[var(--color-accent)]/25 lg:px-5">
                            <h5 className="mb-4 text-sm font-extrabold text-[var(--color-accent-light)]">{supportTitle}</h5>
                            <ul className="flex flex-col gap-2 text-xs font-medium text-[var(--color-text-main-dark)]/85 sm:text-sm">
                                {supportLinks.map((link) => (
                                    <li key={`${link.href}-${link.label}`}>{renderNavLink(link.label, link.href)}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Shop Categories */}
                        <div className="text-center lg:border-e lg:border-[var(--color-accent)]/25 lg:px-6">
                            <h5 className="mb-4 text-sm font-extrabold text-[var(--color-accent-light)]">{shopTitle}</h5>
                            <ul className="flex flex-col gap-2 text-xs font-medium text-[var(--color-text-main-dark)]/85 sm:text-sm">
                                {footerCategories.length > 0 ? (
                                    footerCategories.slice(0, 5).map((category) => {
                                        const catLabel = isArabic ? category.name : (FOOTER_CAT_TRANSLATIONS[category.name] || category.name);
                                        return (
                                            <li key={category.id}>
                                                <Link className="transition-colors hover:text-[var(--color-accent-light)]" href={`/categories/${category.slug}`}>
                                                    {catLabel}
                                                </Link>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li><Link className="transition-colors hover:text-[var(--color-accent-light)]" href="/products">{t('products.allProducts')}</Link></li>
                                )}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="text-center lg:border-e lg:border-[var(--color-accent)]/25 lg:px-6">
                            <h5 className="mb-4 text-sm font-extrabold text-[var(--color-accent-light)]">{contactTitle}</h5>
                            <div className="flex flex-col items-center gap-3 text-xs text-[var(--color-text-main-dark)]/90 sm:text-sm">
                                <CompanyContacts contacts={companyContacts} language={language} compact />
                                {contactAddress && <div className="flex items-center gap-2">
                                    <LuMapPin className="shrink-0 text-[var(--color-accent-light)]" />
                                    <span>{contactAddress}</span>
                                </div>}
                                {contactPhone && <a className="flex items-center gap-2 transition-colors hover:text-[var(--color-accent-light)]" href={`tel:${phoneHref}`}>
                                    <LuPhone className="shrink-0 text-[var(--color-accent-light)]" />
                                    <span dir="ltr">{contactPhone}</span>
                                </a>}
                                {contactEmail && <a className="flex items-center gap-2 transition-colors hover:text-[var(--color-accent-light)]" href={`mailto:${contactEmail}`}>
                                    <LuMail className="shrink-0 text-[var(--color-accent-light)]" />
                                    <span>{contactEmail}</span>
                                </a>}
                                {whatsappUrl !== '#' && whatsappLabel && <a className="mt-1 inline-flex items-center gap-1.5 font-bold text-[var(--color-accent-light)] transition-colors hover:text-white" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                    <PlatformIcon platform="whatsapp" className="size-4" />
                                    <span>{whatsappLabel}</span>
                                </a>}
                            </div>
                        </div>

                        {/* Quality message */}
                        <div className="flex flex-col items-center justify-center text-center lg:items-start lg:justify-self-end lg:ps-8 lg:text-start">
                            <span className="mb-2 text-base font-extrabold text-[var(--color-accent-light)] sm:text-lg">
                                {isArabic ? 'جودة عالمية' : 'Global Quality'}
                            </span>
                            <p className="max-w-[180px] text-xs leading-relaxed text-[var(--color-text-main-dark)]/85 sm:text-sm">
                                {isArabic ? 'في خدمة السوق السوري' : 'Serving the Syrian market'}
                            </p>
                            <div className="mt-4 h-px w-20 bg-gradient-to-r from-transparent via-[var(--color-accent-light)] to-transparent" />
                        </div>
                    </div>
                </div>

                {/* Copyright strip */}
                <div className="border-t border-[var(--color-accent)]/55 bg-black/15 px-4 py-3 text-center text-[11px] font-medium text-[var(--color-text-main-dark)]/80 sm:text-xs">
                    {copyright}
                </div>
            </div>
        </footer>
    );
};

export default Footer;

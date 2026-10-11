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
    initialSettings?: any;
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

const Footer = async ({ t, language, initialSettings }: FooterProps) => {
    const settings = initialSettings ?? (await getSiteSettings());
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
    const whatsappLabel = getLocalizedValue(language, settings?.footerWhatsappLabel, settings?.footerWhatsappLabelAr) || (language === 'ar' ? 'تواصل معنا عبر واتساب' : 'Contact us on WhatsApp');
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
                <div className="container-custom px-4 py-7 sm:py-8 md:py-9">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.1fr_1.2fr] lg:gap-0">
                        {/* Brand */}
                        <div className="flex flex-col items-center border-b border-white/10 pb-6 text-center sm:col-span-2 lg:col-span-1 lg:items-start lg:border-b-0 lg:border-e lg:border-[var(--color-accent)]/25 lg:pb-0 lg:pe-10 lg:text-start">
                            <Link href="/" className="group mb-2.5 inline-flex flex-col items-center lg:items-start transition-transform hover:opacity-95">
                                <Image
                                    src="/images/zad-land-white-logo.webp"
                                    alt={brandTitle || "Zad Land"}
                                    width={1535}
                                    height={1025}
                                    className="h-auto w-32 object-contain sm:w-36 drop-shadow-sm"
                                />
                                {brandTitle ? (
                                    <span className="mt-2 text-xl font-black tracking-tight text-[var(--color-accent-light)] transition-colors group-hover:text-amber-300 sm:text-2xl drop-shadow-xs">
                                        {brandTitle}
                                    </span>
                                ) : null}
                            </Link>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/35 bg-black/20 px-3.5 py-1 text-[11px] font-bold text-[var(--color-accent-light)] shadow-xs">
                                <span>🌾</span>
                                <span>{isArabic ? 'من سوريا .. إلى كل الأسواق' : 'From Syria to every market'}</span>
                                <span>🌾</span>
                            </div>
                            {brandDescription ? (
                                <p className="max-w-xs text-xs leading-relaxed text-[var(--color-text-main-dark)]/90 sm:text-sm">
                                    {brandDescription}
                                </p>
                            ) : null}
                            {socialLinks.length > 0 && <div className="mt-4 flex items-center gap-2.5">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-accent)]/35 bg-black/15 text-sm text-[var(--color-accent-light)] transition-all hover:border-[var(--color-accent-light)] hover:bg-[var(--color-accent)] hover:text-white"
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                    >
                                        <PlatformIcon platform={social.platform} className="size-4" />
                                    </a>
                                ))}
                            </div>}
                        </div>

                        {/* Navigation Links - 2 Columns on Mobile, native columns on Desktop */}
                        <div className="grid grid-cols-2 gap-4 sm:col-span-2 sm:gap-6 lg:contents">
                            {/* Quick Links */}
                            <div className="text-start lg:border-e lg:border-[var(--color-accent)]/25 lg:px-5 lg:text-center">
                                <h5 className="mb-3 text-xs sm:text-sm font-extrabold text-[var(--color-accent-light)]">{companyTitle}</h5>
                                <ul className="flex flex-col gap-2.5 text-xs font-medium text-[var(--color-text-main-dark)]/85 sm:text-sm">
                                    {companyLinks.map((link) => (
                                        <li key={link.href}>{renderNavLink(link.label, link.href)}</li>
                                    ))}
                                </ul>
                                {/* Shop Categories */}
                                <div className="mt-6 border-t border-white/10 pt-5">
                                    <h5 className="mb-3 text-xs sm:text-sm font-extrabold text-[var(--color-accent-light)] text-start lg:text-center">{shopTitle}</h5>
                                    {/* Mobile & Tablet: Modern touch badge pills */}
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:hidden">
                                        {footerCategories.length > 0 ? (
                                            footerCategories.slice(0, 6).map((category) => {
                                                const catLabel = isArabic ? category.name : (FOOTER_CAT_TRANSLATIONS[category.name] || category.name);
                                                return (
                                                    <Link
                                                        key={category.id}
                                                        className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-white/90 transition-colors hover:border-[var(--color-accent-light)] hover:bg-[var(--color-accent)] hover:text-white"
                                                        href={`/categories/${category.slug}`}
                                                    >
                                                        {catLabel}
                                                    </Link>
                                                );
                                            })
                                        ) : (
                                            <Link className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/90 hover:bg-[var(--color-accent)]" href="/products">
                                                {t('products.allProducts')}
                                            </Link>
                                        )}
                                    </div>
                                    {/* Desktop: Standard vertical list */}
                                    <ul className="hidden flex-col gap-2.5 text-xs font-medium text-[var(--color-text-main-dark)]/85 sm:text-sm lg:flex">
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
                            </div>

                            {/* Shipping and privacy policies */}
                            <div className="text-start lg:border-e lg:border-[var(--color-accent)]/25 lg:px-5 lg:text-center">
                                <h5 className="mb-3 text-xs sm:text-sm font-extrabold text-[var(--color-accent-light)]">{supportTitle}</h5>
                                <ul className="flex flex-col gap-2.5 text-xs font-medium text-[var(--color-text-main-dark)]/85 sm:text-sm">
                                    {supportLinks.map((link) => (
                                        <li key={`${link.href}-${link.label}`}>{renderNavLink(link.label, link.href)}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Company representatives */}
                        {companyContacts.some((contact) => contact.enabled) && (
                            <div className="text-start lg:border-e lg:border-[var(--color-accent)]/25 lg:px-5">
                                <h5 className="mb-3 text-xs font-extrabold text-[var(--color-accent-light)] sm:text-sm">{contactTitle}</h5>
                                <CompanyContacts contacts={companyContacts} language={language} compact />
                            </div>
                        )}

                        {/* Office contact details */}
                        <div className="col-span-1 text-start">
                            <div className="rounded-2xl border border-[var(--color-accent)]/30 bg-black/25 p-4 sm:p-5 lg:rounded-none lg:border-none lg:bg-transparent lg:p-0 lg:ps-6">
                                <h5 className="mb-3 flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[var(--color-accent-light)]">
                                    <LuPhone className="size-3.5 shrink-0" />
                                    <span>{isArabic ? "العنوان والتواصل" : "Office & Contact"}</span>
                                </h5>
                                <div className="flex w-full flex-col gap-3 text-xs text-[var(--color-text-main-dark)]/90 sm:text-sm">
                                    {(contactAddress || contactPhone || contactEmail) && (
                                        <div className="flex w-full flex-col gap-3">
                                            {contactAddress && (
                                                <div className="flex min-w-0 items-start gap-2">
                                                    <LuMapPin className="shrink-0 text-[var(--color-accent-light)]" />
                                                    <span className="min-w-0 text-xs sm:text-sm">{contactAddress}</span>
                                                </div>
                                            )}
                                            {contactPhone && (
                                                <a className="inline-flex min-w-0 items-center gap-2 font-bold text-[var(--color-accent-light)] transition-colors hover:text-white" href={`tel:${phoneHref}`}>
                                                    <LuPhone className="shrink-0" />
                                                    <span dir="ltr" className="min-w-0 whitespace-nowrap">{contactPhone}</span>
                                                </a>
                                            )}
                                            {contactEmail && (
                                                <a className="flex min-w-0 items-start gap-2 transition-colors hover:text-[var(--color-accent-light)]" href={`mailto:${contactEmail}`}>
                                                    <LuMail className="shrink-0 text-[var(--color-accent-light)]" />
                                                    <span className="min-w-0 break-all text-xs sm:text-sm">{contactEmail}</span>
                                                </a>
                                            )}
                                        </div>
                                    )}
                                    {whatsappUrl !== '#' && whatsappLabel && (
                                        <a
                                            className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-900/60 hover:text-white"
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <PlatformIcon platform="whatsapp" className="size-4 shrink-0" />
                                            <span>{whatsappLabel}</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Copyright strip with safe padding above mobile BottomNav */}
                <div className="border-t border-[var(--color-accent)]/40 bg-black/25 px-4 pt-4 pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))] md:py-3.5 text-center text-[11px] font-medium text-[var(--color-text-main-dark)]/85 sm:text-xs">
                    <div className="container-custom flex flex-col items-center justify-center gap-1.5">
                        <div className="flex items-center justify-center gap-2 text-[var(--color-accent-light)]/60 text-xs pointer-events-none">
                            <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[var(--color-accent-light)]/40" />
                            <span>🌾</span>
                            <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[var(--color-accent-light)]/40" />
                        </div>
                        <p className="leading-relaxed">{copyright}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

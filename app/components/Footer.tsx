import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { LuMail, LuMapPin, LuPhone } from 'react-icons/lu';
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
    ]);

    const brandTitle = getLocalizedValue(language, settings?.footerBrandTitle, settings?.footerBrandTitleAr) || t('header.brandName');
    const brandDescription = getLocalizedValue(language, settings?.footerBrandDescription, settings?.footerBrandDescriptionAr) || t('footer.brandDescription');
    const copyright = getLocalizedValue(language, settings?.footerCopyright, settings?.footerCopyrightAr) || t('footer.copyright');
    const shopTitle = getLocalizedValue(language, settings?.footerShopTitle, settings?.footerShopTitleAr) || t('footer.shop');

    const socialLinks = [
        {
            href: settings?.footerInstagramUrl || "#",
            icon: FaInstagram,
            label: "Instagram",
        },
        {
            href: settings?.footerFacebookUrl || "#",
            icon: FaFacebook,
            label: "Facebook",
        },
        {
            href: settings?.footerWhatsappUrl || "#",
            icon: FaWhatsapp,
            label: "WhatsApp",
        },
    ].filter((link) => link.href);

    const renderNavLink = (label: string, href: string) => {
        if (isExternalUrl(href)) {
            return (
                <a className="hover:text-[#E5B54A] transition-colors" href={href} target="_blank" rel="noopener noreferrer">
                    {label}
                </a>
            );
        }

        return (
            <Link className="hover:text-[#E5B54A] transition-colors" href={href}>
                {label}
            </Link>
        );
    };

    const isArabic = language === 'ar';
    const quickLinks = [
        { label: isArabic ? 'الرئيسية' : 'Home', href: '/' },
        { label: isArabic ? 'من نحن' : 'About Us', href: '/about-us' },
        { label: isArabic ? 'المنتجات' : 'Products', href: '/products' },
        { label: isArabic ? 'الشركات العالمية' : 'Global Brands', href: '/brands' },
        { label: isArabic ? 'تواصل معنا' : 'Contact Us', href: '/contact' },
    ];

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
            className="relative overflow-hidden border-t-2 border-[#B8860B]/70 bg-[#003c30] text-white"
            dir={isArabic ? 'rtl' : 'ltr'}
        >
            <div className="absolute inset-0 bg-[#003c30] bg-[url('/images/footer-bg.webp')] bg-cover bg-center bg-no-repeat opacity-90" aria-hidden="true" />
            <div className="absolute inset-0 bg-[#003c30]/45" aria-hidden="true" />

            <div className="relative">
                <div className="container-custom px-4 py-6 sm:py-8 md:py-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.95fr_1.15fr_1fr] lg:gap-0">
                        {/* Brand */}
                        <div className="flex flex-col items-center text-center sm:col-span-2 lg:col-span-1 lg:items-start lg:border-e lg:border-[#B8860B]/25 lg:pe-10 lg:text-start">
                            <Link href="/" className="group mb-3 inline-flex">
                                <Image
                                    src="/images/logo.png"
                                    alt={brandTitle}
                                    width={150}
                                    height={90}
                                    className="h-auto w-32 object-contain sm:w-36"
                                />
                            </Link>
                            <p className="max-w-xs text-xs leading-relaxed text-[#E6E8D5]/85 sm:text-sm">
                                {brandDescription}
                            </p>
                            <p className="mt-2 text-xs font-bold text-[#E5B54A]">
                                {isArabic ? 'من سوريا .. إلى كل الأسواق' : 'From Syria to every market'}
                            </p>
                            <div className="mt-4 flex items-center gap-2.5">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={social.label}
                                            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#B8860B]/35 bg-black/10 text-sm text-[#F4E6B0] transition-all hover:border-[#E5B54A] hover:bg-[#B8860B] hover:text-white"
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                        >
                                            <Icon />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="text-center lg:border-e lg:border-[#B8860B]/25 lg:px-6">
                            <h5 className="mb-4 text-sm font-extrabold text-[#E5B54A]">{isArabic ? 'روابط سريعة' : 'Quick Links'}</h5>
                            <ul className="flex flex-col gap-2 text-xs font-medium text-[#E6E8D5]/85 sm:text-sm">
                                {quickLinks.map((link) => (
                                    <li key={link.href}>{renderNavLink(link.label, link.href)}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Shop Categories */}
                        <div className="text-center lg:border-e lg:border-[#B8860B]/25 lg:px-6">
                            <h5 className="mb-4 text-sm font-extrabold text-[#E5B54A]">{shopTitle}</h5>
                            <ul className="flex flex-col gap-2 text-xs font-medium text-[#E6E8D5]/85 sm:text-sm">
                                {footerCategories.length > 0 ? (
                                    footerCategories.slice(0, 5).map((category) => {
                                        const catLabel = isArabic ? category.name : (FOOTER_CAT_TRANSLATIONS[category.name] || category.name);
                                        return (
                                            <li key={category.id}>
                                                <Link className="transition-colors hover:text-[#E5B54A]" href={`/categories/${category.slug}`}>
                                                    {catLabel}
                                                </Link>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li><Link className="transition-colors hover:text-[#E5B54A]" href="/products">{t('products.allProducts')}</Link></li>
                                )}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="text-center lg:border-e lg:border-[#B8860B]/25 lg:px-6">
                            <h5 className="mb-4 text-sm font-extrabold text-[#E5B54A]">{isArabic ? 'معلومات التواصل' : 'Contact Information'}</h5>
                            <div className="flex flex-col items-center gap-3 text-xs text-[#E6E8D5]/90 sm:text-sm">
                                <div className="flex items-center gap-2">
                                    <LuMapPin className="shrink-0 text-[#E5B54A]" />
                                    <span>{isArabic ? 'حمص، سوريا' : 'Homs, Syria'}</span>
                                </div>
                                <a className="flex items-center gap-2 transition-colors hover:text-[#E5B54A]" href="tel:+963933254796">
                                    <LuPhone className="shrink-0 text-[#E5B54A]" />
                                    <span dir="ltr">+963 933 254 796</span>
                                </a>
                                <a className="flex items-center gap-2 transition-colors hover:text-[#E5B54A]" href="mailto:info@zadland.com">
                                    <LuMail className="shrink-0 text-[#E5B54A]" />
                                    <span>info@zadland.com</span>
                                </a>
                                <a className="mt-1 inline-flex items-center gap-1.5 font-bold text-[#E5B54A] transition-colors hover:text-white" href="https://wa.me/963933254796" target="_blank" rel="noopener noreferrer">
                                    <FaWhatsapp />
                                    <span>{isArabic ? 'تواصل معنا عبر واتساب' : 'Chat on WhatsApp'}</span>
                                </a>
                            </div>
                        </div>

                        {/* Quality message */}
                        <div className="flex flex-col items-center justify-center text-center lg:items-start lg:justify-self-end lg:ps-8 lg:text-start">
                            <span className="mb-2 text-base font-extrabold text-[#E5B54A] sm:text-lg">
                                {isArabic ? 'جودة عالمية' : 'Global Quality'}
                            </span>
                            <p className="max-w-[180px] text-xs leading-relaxed text-[#E6E8D5]/85 sm:text-sm">
                                {isArabic ? 'في خدمة السوق السوري' : 'Serving the Syrian market'}
                            </p>
                            <div className="mt-4 h-px w-20 bg-gradient-to-r from-transparent via-[#E5B54A] to-transparent" />
                        </div>
                    </div>
                </div>

                {/* Copyright strip */}
                <div className="border-t border-[#B8860B]/55 bg-black/15 px-4 py-3 text-center text-[11px] font-medium text-[#E6E8D5]/80 sm:text-xs">
                    {copyright}
                </div>
            </div>
        </footer>
    );
};

export default Footer;

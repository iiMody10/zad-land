"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { ChevronLeft as MdKeyboardArrowLeft, ChevronRight as MdKeyboardArrowRight, Plus as MdAdd } from 'lucide-react';

interface MobileCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    brandId?: string;
    brand?: {
        id: string;
        name: string;
        slug: string;
        group: string;
    } | null;
}

interface NavBrand {
    id: string;
    name: string;
    slug: string;
}

interface NavCategory {
    id: string;
    name: string;
    slug: string;
}

interface NavMainCategory {
    id: string;
    name: string;
    slug: string;
    brands: NavBrand[];
    categories: NavCategory[];
}

interface MobileMenuProps {
    initialCategories: MobileCategory[];
    navData?: NavMainCategory[];
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
    isSearchOpen?: boolean;
    setIsSearchOpen?: (open: boolean) => void;
    hideTriggers?: boolean;
    headerHeight?: number;
}

const MobileMenu = ({
    navData: incomingNavData,
    isOpen: externalIsOpen,
    setIsOpen: externalSetIsOpen,
    headerHeight,
}: MobileMenuProps) => {
    const { dir, language } = useLanguage();
    const isRtl = dir === 'rtl';

    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isMobileMenuOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
    const setIsMobileMenuOpen = externalSetIsOpen !== undefined ? externalSetIsOpen : setInternalIsOpen;

    const navData = incomingNavData || [];
    const [activeMainCatSlug, setActiveMainCatSlug] = useState<string | null>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    const activeMainCat = navData.find((mc) => mc.slug === activeMainCatSlug);

    const effectiveHeaderHeight = headerHeight ?? 64;

    return (
        <div
            className={`fixed inset-x-0 bottom-0 z-40 lg:hidden transition-opacity duration-300 ${
                isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={!isMobileMenuOpen}
            inert={!isMobileMenuOpen}
            style={{
                top: `${effectiveHeaderHeight}px`,
                height: `calc(100dvh - ${effectiveHeaderHeight}px)`,
            }}
            suppressHydrationWarning
        >
            {/* Backdrop overlay */}
            <div
                className={`absolute inset-0 bg-black/35 backdrop-blur-[2px] transition-opacity duration-300 ${
                    isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar opens from the same screen edge as the menu button. */}
            <div
                className={`absolute top-0 bottom-0 ${
                    isRtl ? 'left-0' : 'right-0'
                } w-full sm:w-[380px] sm:max-w-[85vw] bg-white dark:bg-zinc-900 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
                    isMobileMenuOpen
                        ? 'translate-x-0'
                        : isRtl
                        ? '-translate-x-full'
                        : 'translate-x-full'
                } overflow-hidden border-t border-gray-100 dark:border-white/10`}
            >
                {/* Navigation Container (Sliding Views) */}
                <div className="flex-1 relative overflow-hidden">
                    {/* Main Menu View */}
                    <div
                        className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
                            activeMainCatSlug
                                ? isRtl
                                    ? 'translate-x-full'
                                    : '-translate-x-full'
                                : 'translate-x-0'
                        }`}
                    >
                        <div className="flex flex-col h-full overflow-y-auto px-2 pt-3">
                            <p className="px-4 pb-3 pt-2 text-xs font-bold text-[#64796a] dark:text-gray-400">
                                {language === 'ar' ? 'تصفح الأقسام' : 'Browse departments'}
                            </p>
                            {/* Dynamic Main Categories */}
                            {navData.map((mc) => (
                                <div key={mc.id} className="border-b border-gray-100/60 dark:border-white/5">
                                    <button
                                        onClick={() => setActiveMainCatSlug(mc.slug)}
                                        className="w-full flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-[var(--color-canvas)] dark:hover:bg-white/5 transition-colors cursor-pointer text-start"
                                    >
                                        <span className="text-[15px] font-bold text-zinc-800 dark:text-white">
                                            {language === 'ar' ? mc.name : (mc.name || mc.name)}
                                        </span>
                                        <MdKeyboardArrowRight className="text-2xl text-gray-400 dark:text-gray-300 rtl:rotate-180" />
                                    </button>
                                </div>
                            ))}

                            {/* About Us */}
                            <div className="border-b border-gray-100/60 dark:border-white/5">
                                <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center py-3.5 px-4 text-[15px] font-bold text-zinc-800 dark:text-white">
                                    {language === 'ar' ? 'حساب التاجر' : 'Merchant account'}
                                </Link>
                            </div>
                            <div className="border-b border-gray-100/60 dark:border-white/5">
                                <Link
                                    href="/about-us"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-[var(--color-canvas)] dark:hover:bg-white/5 transition-colors cursor-pointer text-start"
                                >
                                    <span className="text-[15px] font-bold text-zinc-800 dark:text-white">
                                        {language === 'ar' ? 'عن الشركة' : 'About Us'}
                                    </span>
                                </Link>
                            </div>

                            <div className="mt-auto border-t border-gray-100 p-4 dark:border-white/10">
                                <Link
                                    href="/contact"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block rounded-[8px] bg-[var(--color-brand)] px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-[var(--color-brand-hover)]"
                                >
                                    {language === 'ar' ? 'تواصل مع فريقنا' : 'Contact our team'}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sub Menu View (Main Category Detail) */}
                    <div
                        className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
                            activeMainCatSlug
                                ? 'translate-x-0'
                                : isRtl
                                ? '-translate-x-full'
                                : 'translate-x-full'
                        }`}
                    >
                        {activeMainCat && (
                            <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
                                {/* Back Button Header */}
                                <div className="border-b border-gray-100 dark:border-white/10 px-4 py-3.5 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                                    <button
                                        onClick={() => { setActiveMainCatSlug(null); setExpandedSection(null); }}
                                        className="flex items-center gap-2 text-zinc-800 dark:text-white hover:text-[var(--color-accent)] transition-colors cursor-pointer"
                                    >
                                        <MdKeyboardArrowLeft className="text-2xl rtl:rotate-180" />
                                        <span className="text-[15px] font-bold">{activeMainCat.name}</span>
                                    </button>
                                    <Link
                                        href={`/department/${activeMainCat.slug}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-[13px] font-bold text-[var(--color-accent)] hover:underline"
                                    >
                                        {language === 'ar' ? 'عرض الكل' : 'View All'}
                                    </Link>
                                </div>

                                {/* Accordion Sections */}
                                <div className="flex-1 overflow-y-auto px-2">
                                    <div className="flex flex-col pt-2">
                                        {/* Brands Section */}
                                        {activeMainCat.brands.length > 0 && (
                                            <div className="border-b border-gray-100/60 dark:border-white/5">
                                                <button
                                                    onClick={() => setExpandedSection(expandedSection === 'brands' ? null : 'brands')}
                                                    className="w-full flex items-center justify-between py-3.5 px-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors cursor-pointer text-start"
                                                >
                                                    <span className="text-[14px] font-bold text-[var(--color-brand)] dark:text-white uppercase tracking-wider">
                                                        {language === 'ar' ? 'الماركات' : 'Brands'}
                                                    </span>
                                                    <MdAdd className={`text-2xl text-zinc-600 dark:text-white transition-transform duration-300 ${expandedSection === 'brands' ? 'rotate-45 text-[var(--color-accent)]' : ''}`} />
                                                </button>
                                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'brands' ? 'max-h-[500px] border-t border-gray-100/50 dark:border-white/5 bg-gray-50/45 dark:bg-white/5' : 'max-h-0'}`}>
                                                    <div className="py-2 px-6 flex flex-col gap-1">
                                                        {activeMainCat.brands.map((brand) => (
                                                            <Link
                                                                key={brand.id}
                                                                href={`/brands/${brand.slug}`}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className="flex items-center py-2.5 text-[14px] font-medium text-zinc-700 dark:text-gray-300 hover:text-[var(--color-accent)] dark:hover:text-white border-b border-gray-100/50 dark:border-white/5 last:border-b-0 transition-colors"
                                                            >
                                                                {brand.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Categories Section */}
                                        {activeMainCat.categories.length > 0 && (
                                            <div className="border-b border-gray-100/60 dark:border-white/5">
                                                <button
                                                    onClick={() => setExpandedSection(expandedSection === 'categories' ? null : 'categories')}
                                                    className="w-full flex items-center justify-between py-3.5 px-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors cursor-pointer text-start"
                                                >
                                                    <span className="text-[14px] font-bold text-[var(--color-brand)] dark:text-white uppercase tracking-wider">
                                                        {language === 'ar' ? 'الأقسام' : 'Categories'}
                                                    </span>
                                                    <MdAdd className={`text-2xl text-zinc-600 dark:text-white transition-transform duration-300 ${expandedSection === 'categories' ? 'rotate-45 text-[var(--color-accent)]' : ''}`} />
                                                </button>
                                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'categories' ? 'max-h-[500px] border-t border-gray-100/50 dark:border-white/5 bg-gray-50/45 dark:bg-white/5' : 'max-h-0'}`}>
                                                    <div className="py-2 px-6 flex flex-col gap-1">
                                                        {activeMainCat.categories.map((cat) => (
                                                            <Link
                                                                key={cat.id}
                                                                href={`/categories/${cat.slug}`}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className="flex items-center py-2.5 text-[14px] font-medium text-zinc-700 dark:text-gray-300 hover:text-[var(--color-accent)] dark:hover:text-white border-b border-gray-100/50 dark:border-white/5 last:border-b-0 transition-colors"
                                                            >
                                                                {cat.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { X as MdClose, ChevronDown as MdKeyboardArrowDown, Menu as MdMenu, ShoppingBag as MdOutlineShoppingBag, UserRound as MdPersonOutline, Search as MdSearch } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useLanguage } from '@/app/context/LanguageContext';
import HeaderSearch from './HeaderSearch';
import LanguageToggle from './LanguageToggle';
import MobileMenu from './MobileMenu';
import MegaMenu, { type NavMainCategory } from './HeaderComponents/MegaMenu';
import TopBar from './HeaderComponents/TopBar';
import type { HeaderNavItem } from '@/lib/header-navigation';

interface HeaderCategory {
    id: string;
    name: string;
    nameEn?: string | null;
    isFeatured?: boolean;
    slug: string;
    description: string | null;
    image: string | null;
}

interface HeaderProps {
    initialCategories?: HeaderCategory[];
    initialQuickNavItems?: HeaderNavItem[];
    initialNavData?: NavMainCategory[];
    dir: 'ltr' | 'rtl';
    language: 'en' | 'ar';
}

const Header = ({ initialCategories = [], initialQuickNavItems = [], initialNavData = [] }: HeaderProps) => {
    const { language, dir } = useLanguage();
    const pathname = usePathname();
    const { totalItems, openDrawer } = useCart();
    const headerRef = useRef<HTMLElement>(null);
    const [headerHeight, setHeaderHeight] = useState(64);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isHeaderCompact, setIsHeaderCompact] = useState(false);
    const [visibleCount, setVisibleCount] = useState(4);
    const [visibleCategoryCount, setVisibleCategoryCount] = useState(2);
    const isArabic = language === 'ar';

    useEffect(() => {
        const updateVisibleCount = () => {
            const width = window.innerWidth;
            setVisibleCount(width >= 1440 ? 4 : width >= 1200 ? 3 : 2);
            setVisibleCategoryCount(width >= 1440 ? 3 : width >= 1200 ? 2 : 1);
        };
        updateVisibleCount();
        window.addEventListener('resize', updateVisibleCount);
        return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);

    useEffect(() => {
        if (!headerRef.current) return;
        const observer = new ResizeObserver(() => {
            if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
        });
        observer.observe(headerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty(
            '--site-header-sticky-offset',
            isHeaderCompact ? '81px' : '173px'
        );
    }, [isHeaderCompact]);

    useEffect(() => {
        const desktop = window.matchMedia('(min-width: 1024px)');
        const initialFrame = window.requestAnimationFrame(() => setIsHeaderCompact(compactState));
        let compactState = desktop.matches && window.scrollY > 64;
        let wheelStartY: number | null = null;
        let wheelTimer: number | undefined;
        const setCompact = (compact: boolean) => {
            if (compactState === compact) return;
            compactState = compact;
            setIsHeaderCompact(compact);
            if (compact) {
                setActiveMegaMenu(null);
                setIsMoreOpen(false);
            }
        };
        const updateHeaderFromWheel = () => {
            if (!desktop.matches) {
                setCompact(false);
                return;
            }
            if (wheelStartY === null) wheelStartY = window.scrollY;
            if (wheelTimer !== undefined) window.clearTimeout(wheelTimer);
            wheelTimer = window.setTimeout(() => {
                wheelTimer = undefined;
                const startY = wheelStartY ?? window.scrollY;
                const currentY = window.scrollY;
                const pageDelta = currentY - startY;
                wheelStartY = null;

                if (currentY < 40) setCompact(false);
                else if (pageDelta > 14) setCompact(true);
                else if (pageDelta < -14) setCompact(false);
            }, 120);
        };
        const updateHeaderFromScroll = () => {
            // Scrolling to the top always restores the full header. Direction
            // changes are handled after wheel input settles, avoiding feedback
            // from the header's own height animation.
            if (window.scrollY < 40) {
                wheelStartY = null;
                if (wheelTimer !== undefined) {
                    window.clearTimeout(wheelTimer);
                    wheelTimer = undefined;
                }
                setCompact(false);
            }
        };
        const resetForViewport = () => {
            if (!desktop.matches) setCompact(false);
            else if (window.scrollY > 64) setCompact(true);
        };

        window.addEventListener('wheel', updateHeaderFromWheel, { passive: true });
        window.addEventListener('scroll', updateHeaderFromScroll, { passive: true });
        window.addEventListener('resize', resetForViewport);
        return () => {
            window.removeEventListener('wheel', updateHeaderFromWheel);
            window.removeEventListener('scroll', updateHeaderFromScroll);
            window.removeEventListener('resize', resetForViewport);
            window.cancelAnimationFrame(initialFrame);
            if (wheelTimer !== undefined) window.clearTimeout(wheelTimer);
        };
    }, []);

    useEffect(() => {
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setActiveMegaMenu(null);
                setIsMoreOpen(false);
                setIsMobileMenuOpen(false);
                setIsMobileSearchOpen(false);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, []);

    useEffect(() => {
        if (!isMobileSearchOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previousOverflow; };
    }, [isMobileSearchOpen]);

    const activeNavData = initialNavData.find((item) => item.slug === activeMegaMenu);
    const visibleNavItems = initialNavData.slice(0, visibleCount);
    const overflowNavItems = initialNavData.slice(visibleCount);
    const visibleQuickNavItems = initialQuickNavItems.slice(0, visibleCategoryCount);
    const overflowQuickNavItems = initialQuickNavItems.slice(visibleCategoryCount);
    const closeDesktopMenus = () => {
        setActiveMegaMenu(null);
        setIsMoreOpen(false);
    };

    return (
        <header ref={headerRef} dir={dir} className="sticky top-0 z-[60] w-full border-b border-[var(--color-line)] bg-white dark:border-white/10 dark:bg-[var(--color-background-dark)]">
            <div
                aria-hidden={isHeaderCompact}
                inert={isHeaderCompact}
                className="hidden overflow-hidden transition-[height,opacity,transform] duration-300 ease-out motion-reduce:transition-none lg:block"
                style={{ height: isHeaderCompact ? 0 : 30, opacity: isHeaderCompact ? 0 : 1, transform: isHeaderCompact ? 'translateY(-8px)' : 'translateY(0)' }}
            >
                <TopBar />
            </div>

            <div className="container-custom">
                <div className={`hidden items-center gap-5 transition-[height] duration-300 ease-out motion-reduce:transition-none lg:flex ${isHeaderCompact ? 'h-[64px]' : 'h-[76px]'}`}>
                    <Link href="/" aria-label={isArabic ? 'زاد لاند، الرئيسية' : 'Zad Land, home'} className="flex w-[170px] shrink-0 items-center">
                        <Image src="/logo.png" alt="Zad Land" width={162} height={68} priority className={`w-auto object-contain transition-[height] duration-300 motion-reduce:transition-none ${isHeaderCompact ? 'h-[48px]' : 'h-[58px]'}`} />
                    </Link>

                    <div className="min-w-0 flex-1 px-2 xl:px-10">
                        <div className="mx-auto max-w-[660px]">
                            <HeaderSearch />
                        </div>
                    </div>

                    <div className="flex w-[170px] shrink-0 items-center justify-end gap-2">
                        <Link
                            href="/account"
                            className="flex h-11 items-center gap-2 rounded-[10px] px-3 text-sm font-semibold text-[var(--color-brand)] transition-colors hover:bg-[var(--color-brand-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] dark:text-white dark:hover:bg-white/10"
                        >
                            <MdPersonOutline className="text-[22px]" aria-hidden="true" />
                            <span>{isArabic ? 'حسابي' : 'Account'}</span>
                        </Link>
                        <button
                            type="button"
                            onClick={openDrawer}
                            aria-label={isArabic ? `السلة، ${totalItems} منتجات` : `Cart, ${totalItems} items`}
                            className="relative flex h-11 w-11 items-center justify-center rounded-[10px] bg-[var(--color-brand)] text-white transition-colors hover:bg-[var(--color-brand-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                        >
                            <MdOutlineShoppingBag className="text-[22px]" aria-hidden="true" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -end-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[10px] font-bold text-white">
                                    {totalItems > 99 ? '99+' : totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex h-[64px] items-center justify-between gap-3 lg:hidden">
                    <Link href="/" aria-label={isArabic ? 'زاد لاند، الرئيسية' : 'Zad Land, home'} className="flex shrink-0 items-center">
                        <Image src="/logo.png" alt="Zad Land" width={112} height={54} priority className="h-[48px] w-auto object-contain" />
                    </Link>
                    <div className="flex items-center gap-1">
                        <LanguageToggle />
                        <button
                            type="button"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsMobileSearchOpen(true);
                            }}
                            aria-label={isArabic ? 'البحث' : 'Search'}
                            aria-expanded={isMobileSearchOpen}
                            aria-controls="mobile-search-dialog"
                            className="flex h-10 w-10 items-center justify-center rounded-[9px] text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] dark:text-white dark:hover:bg-white/10"
                        >
                            <MdSearch className="text-2xl" />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsMobileSearchOpen(false);
                                setIsMobileMenuOpen((open) => !open);
                            }}
                            aria-label={isArabic ? 'القائمة' : 'Menu'}
                            aria-expanded={isMobileMenuOpen}
                            className="flex h-10 w-10 items-center justify-center rounded-[9px] bg-[var(--color-brand)] text-white"
                        >
                            {isMobileMenuOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
                        </button>
                    </div>
                </div>

            </div>

            {isMobileSearchOpen && (
                <div className="fixed inset-0 z-[120] lg:hidden">
                    <button
                        type="button"
                        onClick={() => setIsMobileSearchOpen(false)}
                        aria-label={isArabic ? 'إغلاق البحث' : 'Close search'}
                        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
                    />
                    <section
                        id="mobile-search-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-label={isArabic ? 'البحث عن المنتجات' : 'Search products'}
                          className="absolute inset-0 flex h-[100dvh] flex-col overflow-hidden bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] shadow-2xl dark:bg-[var(--color-surface-dark)] sm:inset-x-4 sm:inset-y-4 sm:h-auto sm:rounded-3xl sm:border sm:border-slate-200 sm:px-5 sm:pb-5 sm:pt-5 sm:shadow-2xl dark:sm:border-white/10"
                    >
                          <div className="mb-3 flex shrink-0 items-center justify-between">
                            <h2 className="text-base font-extrabold text-[var(--color-brand)] dark:text-white">{isArabic ? 'ابحث عن المنتجات' : 'Search products'}</h2>
                            <button
                                type="button"
                                onClick={() => setIsMobileSearchOpen(false)}
                                aria-label={isArabic ? 'إغلاق البحث' : 'Close search'}
                                className="flex size-10 items-center justify-center rounded-xl text-2xl text-slate-600 hover:bg-slate-100 dark:text-white dark:hover:bg-white/10"
                            >
                                <MdClose aria-hidden="true" />
                            </button>
                        </div>
                          <HeaderSearch mobileModal autoFocus onClose={() => setIsMobileSearchOpen(false)} />
                    </section>
                </div>
            )}

            <nav
                aria-label={isArabic ? 'الأقسام الرئيسية' : 'Main navigation'}
                aria-hidden={isHeaderCompact}
                inert={isHeaderCompact}
                className="relative hidden border-t border-[var(--color-line)] bg-[var(--color-canvas)] transition-[height,opacity,transform] duration-300 ease-out motion-reduce:transition-none dark:border-white/10 dark:bg-[var(--color-surface-dark)] lg:block"
                style={{ height: isHeaderCompact ? 0 : 50, overflow: isHeaderCompact ? 'hidden' : 'visible', opacity: isHeaderCompact ? 0 : 1, transform: isHeaderCompact ? 'translateY(-8px)' : 'translateY(0)', borderColor: isHeaderCompact ? 'transparent' : undefined }}
                onMouseLeave={closeDesktopMenus}
            >
                <div className="container-custom flex h-[50px] items-center gap-1">
                    <Link
                        href="/products"
                        onMouseEnter={closeDesktopMenus}
                        className="me-3 flex h-9 shrink-0 items-center gap-2 rounded-[7px] bg-[var(--color-brand)] px-4 text-[13px] font-bold text-white transition-colors hover:bg-[var(--color-brand-hover)]"
                    >
                        <MdMenu className="text-lg" aria-hidden="true" />
                        {isArabic ? 'جميع المنتجات' : 'Shop all'}
                    </Link>

                    <div className="flex min-w-0 flex-1 items-center gap-0.5">
                        {visibleQuickNavItems.map((item) => {
                            const nameParts = item.name.split('-').map((part) => part.trim());
                            const name = item.nameEn || nameParts.find((part) => isArabic
                                ? /[\u0600-\u06FF]/.test(part)
                                : !/[\u0600-\u06FF]/.test(part)) || item.name;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={`quick-${item.type}-${item.id}`}
                                    href={item.href}
                                    onMouseEnter={closeDesktopMenus}
                                    aria-current={isActive ? 'page' : undefined}
                                    title={name}
                                    className={`flex h-10 max-w-[132px] shrink-0 items-center truncate rounded-[7px] px-3 text-[13px] font-semibold transition-colors xl:text-sm ${isActive ? 'bg-[var(--color-brand-soft)] text-[var(--color-brand)] dark:bg-white/10 dark:text-white' : 'text-[var(--color-ink)] hover:bg-[var(--color-brand-soft)] dark:text-gray-200 dark:hover:bg-white/10'}`}
                                >
                                    {name}
                                </Link>
                            );
                        })}
                        {visibleNavItems.map((item) => {
                            const name = isArabic ? item.name : item.nameEn || item.name;
                            const isOpen = activeMegaMenu === item.slug;
                            return (
                                <div key={item.id} className="flex shrink-0 items-center" onMouseEnter={() => { setIsMoreOpen(false); setActiveMegaMenu(item.slug); }}>
                                    <Link
                                        href={`/department/${item.slug}`}
                                        onFocus={() => setActiveMegaMenu(item.slug)}
                                        onClick={closeDesktopMenus}
                                        className={`flex h-10 items-center rounded-s-[7px] ps-3 pe-1 text-[13px] font-semibold transition-colors xl:text-sm ${isOpen ? 'bg-[var(--color-brand-soft)] text-[var(--color-brand)] dark:bg-white/10 dark:text-white' : 'text-[var(--color-ink)] hover:bg-[var(--color-brand-soft)] dark:text-gray-200 dark:hover:bg-white/10'}`}
                                    >
                                        {name}
                                    </Link>
                                    <button
                                        type="button"
                                        aria-label={isArabic ? `عرض أقسام ${name}` : `Explore ${name}`}
                                        aria-expanded={isOpen}
                                        aria-controls="desktop-category-panel"
                                        onClick={() => { setIsMoreOpen(false); setActiveMegaMenu(item.slug); }}
                                        className={`flex h-10 w-7 items-center justify-center rounded-e-[7px] transition-colors ${isOpen ? 'bg-[var(--color-brand-soft)] text-[var(--color-brand)] dark:bg-white/10 dark:text-white' : 'text-[#5b6c60] hover:bg-[var(--color-brand-soft)] dark:text-gray-300 dark:hover:bg-white/10'}`}
                                    >
                                        <MdKeyboardArrowDown className={`text-lg transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                            );
                        })}
                        {(overflowNavItems.length > 0 || overflowQuickNavItems.length > 0) && (
                            <div className="relative shrink-0" onMouseEnter={() => { setActiveMegaMenu(null); setIsMoreOpen(true); }}>
                                <button
                                    type="button"
                                    aria-expanded={isMoreOpen}
                                    onClick={() => { setActiveMegaMenu(null); setIsMoreOpen((open) => !open); }}
                                    className="flex h-10 items-center gap-1 rounded-[7px] px-3 text-[13px] font-semibold text-[var(--color-ink)] hover:bg-[var(--color-brand-soft)] dark:text-gray-200 dark:hover:bg-white/10"
                                >
                                    {isArabic ? 'المزيد' : 'More'}
                                    <MdKeyboardArrowDown className={`text-lg transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isMoreOpen && (
                                    <div className="absolute top-full start-0 z-50 mt-1 w-60 rounded-[10px] border border-[var(--color-line)] bg-white p-2 shadow-[0_16px_35px_rgba(17,43,31,0.13)] dark:border-white/10 dark:bg-[var(--color-surface-dark)]">
                                        {overflowQuickNavItems.map((item) => {
                                            const nameParts = item.name.split('-').map((part) => part.trim());
                                            const name = item.nameEn || nameParts.find((part) => isArabic
                                                ? /[\u0600-\u06FF]/.test(part)
                                                : !/[\u0600-\u06FF]/.test(part)) || item.name;
                                            return (
                                            <Link
                                                key={`overflow-quick-${item.type}-${item.id}`}
                                                href={item.href}
                                                onClick={closeDesktopMenus}
                                                className="block rounded-[6px] px-3 py-2.5 text-sm text-[var(--color-ink)] hover:bg-[var(--color-brand-soft)] dark:text-white dark:hover:bg-white/10"
                                            >
                                                {name}
                                            </Link>
                                        )})}
                                        {overflowNavItems.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`/department/${item.slug}`}
                                                onClick={closeDesktopMenus}
                                                className="block rounded-[6px] px-3 py-2.5 text-sm text-[var(--color-ink)] hover:bg-[var(--color-brand-soft)] dark:text-white dark:hover:bg-white/10"
                                            >
                                                {isArabic ? item.name : item.nameEn || item.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex shrink-0 items-center gap-1 border-s border-[var(--color-line)] ps-3 dark:border-white/15">
                        <Link href="/brands" onMouseEnter={closeDesktopMenus} className="rounded-[7px] px-3 py-2 text-[13px] font-semibold text-[var(--color-ink)] hover:bg-[var(--color-brand-soft)] dark:text-gray-200 dark:hover:bg-white/10">{isArabic ? 'الشركات' : 'Brands'}</Link>
                        <Link href="/about-us" onMouseEnter={closeDesktopMenus} className="rounded-[7px] px-3 py-2 text-[13px] font-semibold text-[var(--color-ink)] hover:bg-[var(--color-brand-soft)] dark:text-gray-200 dark:hover:bg-white/10">{isArabic ? 'من نحن' : 'About'}</Link>
                        <Link href="/contact" onMouseEnter={closeDesktopMenus} className="rounded-[7px] px-3 py-2 text-[13px] font-semibold text-[var(--color-ink)] hover:bg-[var(--color-brand-soft)] dark:text-gray-200 dark:hover:bg-white/10">{isArabic ? 'تواصل' : 'Contact'}</Link>
                    </div>
                </div>

                {activeNavData && (
                    <MegaMenu
                        key={activeNavData.id}
                        data={activeNavData}
                        onClose={closeDesktopMenus}
                        onMouseEnter={() => setIsMoreOpen(false)}
                    />
                )}
            </nav>

            <MobileMenu
                initialCategories={initialCategories}
                navData={initialNavData}
                isOpen={isMobileMenuOpen}
                setIsOpen={setIsMobileMenuOpen}
                hideTriggers
                headerHeight={headerHeight}
            />
        </header>
    );
};

export default Header;

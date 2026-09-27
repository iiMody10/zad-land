'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House as MdHome, ShoppingBag as MdOutlineShoppingBag, UserRound as MdPersonOutline } from 'lucide-react';
import { Handshake as LuHandshake, LayoutGrid as LuLayoutGrid } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useLanguage } from '@/app/context/LanguageContext';

const BottomNav = () => {
    const pathname = usePathname();
    const { language } = useLanguage();
    const { totalItems, openDrawer } = useCart();
    const isArabic = language === 'ar';

    const destinations = [
        {
            href: '/',
            label: isArabic ? 'الرئيسية' : 'Home',
            icon: MdHome,
            active: pathname === '/',
        },
        {
            href: '/products',
            label: isArabic ? 'تسوق' : 'Shop',
            icon: LuLayoutGrid,
            active: pathname.startsWith('/products') || pathname.startsWith('/categories') || pathname.startsWith('/department'),
        },
        {
            href: '/brands',
            label: isArabic ? 'شركاؤنا' : 'Our partners',
            icon: LuHandshake,
            active: pathname.startsWith('/brands'),
        },
        {
            href: '/account',
            label: isArabic ? 'حسابي' : 'Account',
            icon: MdPersonOutline,
            active: pathname.startsWith('/account'),
        },
    ];

    return (
        <nav
            aria-label={isArabic ? 'تنقل الهاتف' : 'Mobile navigation'}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-brand-hover)] bg-[var(--color-brand)] text-white shadow-[0_-8px_24px_rgba(15,40,29,0.16)] md:hidden"
        >
            <div className="grid grid-cols-5 gap-0.5 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                {destinations.map((destination) => {
                    const Icon = destination.icon;
                    return (
                        <Link
                            key={destination.href}
                            href={destination.href}
                            aria-current={destination.active ? 'page' : undefined}
                            className={`flex min-h-[53px] flex-col items-center justify-center gap-0.5 rounded-[8px] px-1 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-accent-light)] ${destination.active ? 'bg-[var(--color-brand-soft)] text-[var(--color-brand)]' : 'text-white/78 hover:bg-white/10 hover:text-white'}`}
                        >
                            <Icon aria-hidden="true" className="text-[22px]" />
                            <span className="text-[10px] font-semibold leading-tight">{destination.label}</span>
                        </Link>
                    );
                })}
                <button
                    type="button"
                    onClick={openDrawer}
                    aria-label={isArabic ? `السلة، ${totalItems} منتجات` : `Cart, ${totalItems} items`}
                    className="relative flex min-h-[53px] flex-col items-center justify-center gap-0.5 rounded-[8px] px-1 text-white/78 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-accent-light)]"
                >
                    <span className="relative">
                        <MdOutlineShoppingBag aria-hidden="true" className="text-[22px]" />
                        {totalItems > 0 && (
                            <span className="absolute -end-3 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[var(--color-accent-light)] px-0.5 text-[9px] font-bold text-[var(--color-brand)]">
                                {totalItems > 99 ? '99+' : totalItems}
                            </span>
                        )}
                    </span>
                    <span className="text-[10px] font-semibold leading-tight">{isArabic ? 'السلة' : 'Cart'}</span>
                </button>
            </div>
        </nav>
    );
};

export default BottomNav;

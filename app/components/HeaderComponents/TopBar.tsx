'use client';

import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import LanguageToggle from '../LanguageToggle';

const TopBar = () => {
    const { language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className="hidden border-b border-white/10 bg-[var(--color-brand)] text-white lg:block">
            <div className="container-custom flex h-[30px] items-center justify-between text-[11px]">
                <span className="font-medium tracking-[0.01em] text-white/85">
                    {isArabic ? 'توريد وتوزيع للمتاجر والشركات' : 'Wholesale supply for businesses'}
                </span>
                <div className="flex items-center gap-3">
                    <Link href="/contact" className="text-white/85 transition-colors hover:text-white">
                        {isArabic ? 'تواصل معنا' : 'Contact'}
                    </Link>
                    <span className="h-3 w-px bg-white/25" aria-hidden="true" />
                    <Link href="/account" className="font-semibold text-white transition-colors hover:text-[var(--color-accent-light)]">
                        {isArabic ? 'حساب التاجر' : 'Merchant account'}
                    </Link>
                    <span className="h-3 w-px bg-white/25" aria-hidden="true" />
                    <div className="[&>button]:text-white [&>button]:hover:bg-white/10">
                        <LanguageToggle />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;

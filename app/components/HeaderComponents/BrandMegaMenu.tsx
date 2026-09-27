'use client';

import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import ResilientImage from '@/app/components/ResilientImage';
import type { HeaderNavItem } from '@/lib/header-navigation';

interface BrandMegaMenuProps {
    data: HeaderNavItem;
    onClose: () => void;
}

export default function BrandMegaMenu({ data, onClose }: BrandMegaMenuProps) {
    const { language } = useLanguage();
    const isArabic = language === 'ar';
    const Arrow = isArabic ? ArrowLeft : ArrowRight;
    const displayName = data.name.split('-').map((part) => part.trim()).find((part) => isArabic
        ? /[\u0600-\u06FF]/.test(part)
        : !/[\u0600-\u06FF]/.test(part)) || data.name;

    return (
        <div
            id={`brand-nav-${data.id}`}
            className="absolute inset-x-0 top-full z-40 border-t border-[var(--color-line)] bg-white shadow-[0_22px_35px_rgba(15,40,29,0.14)] animate-mega-menu-enter dark:border-white/10 dark:bg-[var(--color-background-dark)]"
        >
            <div className="container-custom grid max-h-[min(66vh,500px)] grid-cols-12 gap-6 overflow-y-auto py-6 xl:gap-8">
                <div className="col-span-3 flex min-h-[250px] flex-col justify-between rounded-xl bg-[var(--color-brand)] p-6 text-white">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-accent-light)]">
                            {isArabic ? 'تصفح العلامة التجارية' : 'Explore brand'}
                        </span>
                        <div className="mt-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-white p-2">
                            {data.image ? (
                                <ResilientImage src={data.image} alt="" className="h-full w-full object-contain" loading="lazy" />
                            ) : (
                                <span className="text-2xl font-bold text-[var(--color-brand)]" aria-hidden="true">{displayName.slice(0, 1)}</span>
                            )}
                        </div>
                        <h2 className="mt-4 text-2xl font-bold leading-tight xl:text-[28px]">{displayName}</h2>
                        <p className="mt-3 text-[13px] text-white/75">
                            {isArabic ? `${data.categories.length} فئات` : `${data.categories.length} categories`}
                        </p>
                    </div>
                    <Link
                        href={data.href}
                        onClick={onClose}
                        className="inline-flex w-fit items-center gap-2 border-b border-[var(--color-accent-light)] pb-1 text-[13px] font-bold text-[var(--color-accent-light)] transition-colors hover:text-white"
                    >
                        {isArabic ? 'عرض جميع المنتجات' : 'View all products'}
                        <Arrow aria-hidden="true" className="text-lg" />
                    </Link>
                </div>

                <div className="col-span-9 min-w-0">
                    <h3 className="mb-3 border-b border-[var(--color-line)] pb-3 text-[12px] font-bold text-[#66786b] dark:border-white/10 dark:text-gray-400">
                        {isArabic ? `أقسام ${displayName}` : `${displayName} categories`}
                    </h3>
                    {data.categories.length > 0 ? (
                        <ul className="grid grid-cols-2 gap-x-5 gap-y-1 xl:grid-cols-3">
                            {data.categories.map((category) => (
                                <li key={category.id}>
                                    <Link
                                        href={category.href}
                                        onClick={onClose}
                                        className="block rounded-lg px-3 py-3 text-[13px] font-medium leading-snug text-[var(--color-ink)] transition-colors hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand-hover)] dark:text-white dark:hover:bg-white/10"
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="px-3 py-4 text-[13px] text-[#7a877c]">
                            {isArabic ? 'لا توجد أقسام لهذه العلامة التجارية بعد.' : 'No categories for this brand yet.'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

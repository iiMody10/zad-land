"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import PriceText from '@/app/components/PriceText';
import { ArrowRight as MdArrowForward } from 'lucide-react';
import { useBusinessContact } from '@/app/context/BusinessContactContext';

interface CartSummaryProps {
    subtotal: number;
}

const CartSummary = ({ subtotal }: CartSummaryProps) => {
    const { t, dir, language } = useLanguage();
    const { whatsappUrl } = useBusinessContact();

    return (
        <div className="sticky top-[150px] space-y-4">
            <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-white/10">
                <h2 className="text-base font-extrabold mb-6 text-zinc-900 dark:text-white uppercase tracking-wider">{t('cart.orderSummary')}</h2>
                <div className="flex flex-col gap-3.5 mb-6 border-b border-gray-200 dark:border-white/10 pb-6">
                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm font-medium">
                        <span>{t('cart.subtotal')}</span>
                        <PriceText amount={subtotal} className="font-bold text-zinc-900 dark:text-white" />
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm font-medium">
                        <span>{t('cart.shipping')}</span>
                        <span className="font-bold text-[var(--color-brand-hover)] text-xs">{language === 'ar' ? 'يؤكد حسب المنطقة والطلب' : 'Confirmed by area and order'}</span>
                    </div>
                </div>
                <div className="flex justify-between items-end mb-6">
                    <span className="text-base font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider">{t('cart.total')}</span>
                    <PriceText amount={subtotal} className="text-2xl font-extrabold leading-none text-zinc-900 dark:text-white sm:text-3xl" />
                </div>

                <Link href="/place-order" className="w-full bg-[var(--color-brand-hover)] hover:bg-[var(--color-brand-hover)] text-white font-bold rounded-xl h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm">
                    <span>{language === 'ar' ? 'الانتقال لتأكيد الطلب' : 'Continue to place order'}</span>
                    <MdArrowForward className={`text-base ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </Link>

            </div>
            <div className="bg-gray-50 dark:bg-zinc-800/60 p-4 rounded-xl border border-gray-200 dark:border-white/10 text-center">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('footer.contactUs')}</p>
                <a 
                    className="text-xs font-bold text-[var(--color-brand)] dark:text-[var(--color-accent)] mt-1 inline-block hover:underline"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t('footer.helpCenter')}
                </a>
            </div>
        </div>
    );
};

export default CartSummary;

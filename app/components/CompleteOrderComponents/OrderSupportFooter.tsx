"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { ShoppingBag as MdShoppingBag } from 'lucide-react';
import { useBusinessContact } from '@/app/context/BusinessContactContext';

const OrderSupportFooter = () => {
    const { t } = useLanguage();
    const { whatsappUrl } = useBusinessContact();

    return (
        <>
            <div className="w-full mt-8">
                <Link
                    href="/products"
                    className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-bold rounded-xl h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm"
                >
                    <span>{t('cart.continueShopping')}</span>
                    <MdShoppingBag className="text-base text-[var(--color-accent)]" />
                </Link>
            </div>
            <div className="mt-8 flex flex-col items-center gap-2 text-center">
                <p className="text-xs text-gray-500">
                    {t('checkout.needAssistance')}{' '}
                    <a
                        className="text-[var(--color-brand)] dark:text-[var(--color-accent)] font-bold hover:underline"
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('footer.contactUs')}
                    </a>
                </p>
            </div>
        </>
    );
};

export default OrderSupportFooter;

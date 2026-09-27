"use client";

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import PriceText from '@/app/components/PriceText';

interface OrderBasicInfoProps {
    orderId: string;
    totalAmount: number;
}

const OrderBasicInfo = ({ orderId, totalAmount }: OrderBasicInfoProps) => {
    const { t, language } = useLanguage();

    return (
        <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:ltr:text-left md:rtl:text-right bg-gray-50/50 dark:bg-zinc-800/40">
            <div className="flex flex-col gap-1 items-center md:items-start">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('orderComplete.orderNumber')}</span>
                <p className="text-base sm:text-lg font-bold text-[var(--color-brand)] dark:text-[var(--color-accent)] truncate"><span dir="ltr">#{orderId.slice(-8).toUpperCase()}</span></p>
            </div>
            <div className="flex flex-col gap-1 items-center md:items-start">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('cart.total')}</span>
                <p className="text-base font-extrabold text-[var(--color-brand-hover)] sm:text-lg"><PriceText amount={totalAmount} /></p>
            </div>
            <div className="flex flex-col gap-1 items-center md:items-start">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{language === 'ar' ? 'موعد التوصيل' : 'Delivery timing'}</span>
                <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">{language === 'ar' ? 'يؤكد بعد مراجعة الطلب' : 'Confirmed after order review'}</p>
            </div>
        </div>
    );
};

export default OrderBasicInfo;

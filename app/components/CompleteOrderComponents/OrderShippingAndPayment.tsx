"use client";

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { Truck as MdLocalShipping, CreditCard as MdPayments } from 'lucide-react';

interface OrderShippingAndPaymentProps {
    shopName?: string | null;
    name: string;
    streetAddress: string;
    city: string;
    phone: string;
    notes?: string | null;
}

const OrderShippingAndPayment = ({ shopName, name, streetAddress, city, phone, notes }: OrderShippingAndPaymentProps) => {
    const { t, language } = useLanguage();

    return (
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:ltr:text-left md:rtl:text-right">
            <div className="flex flex-col gap-3 items-center md:items-start">
                <h3 className="text-sm font-extrabold flex items-center gap-2 text-zinc-900 dark:text-white">
                    <MdLocalShipping className="text-[var(--color-brand)] dark:text-[var(--color-accent)] text-lg" />
                    {t('orderComplete.shippingAddress')}
                </h3>
                <div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed w-full space-y-0.5">
                    {shopName && <p className="font-bold text-[var(--color-brand)] dark:text-white">{shopName}</p>}
                    <p className="font-bold text-zinc-900 dark:text-white">{name}</p>
                    <p>{streetAddress}</p>
                    <p>{city}</p>
                    <p><span dir="ltr">{phone}</span></p>
                    {notes && <p className="pt-2 text-slate-500 dark:text-slate-400">{language === 'ar' ? 'ملاحظات: ' : 'Notes: '}{notes}</p>}
                </div>
            </div>
            <div className="flex flex-col gap-3 items-center md:items-start">
                <h3 className="text-sm font-extrabold flex items-center gap-2 text-zinc-900 dark:text-white">
                    <MdPayments className="text-[var(--color-brand)] dark:text-[var(--color-accent)] text-lg" />
                    {t('checkout.paymentMethod')}
                </h3>
                <div className="flex flex-col gap-0.5 w-full">
                    <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">{t('checkout.cashOnDelivery')}</p>
                    <p className="text-xs text-gray-400">{language === 'ar' ? 'الدفع عند الاستلام' : 'Pay at the time of delivery'}</p>
                </div>
            </div>
        </div>
    );
};

export default OrderShippingAndPayment;

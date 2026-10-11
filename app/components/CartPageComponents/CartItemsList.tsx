"use client";

import React from 'react';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/app/context/CartContext';
import CartItem from './CartItem';
import { useLanguage } from '@/app/context/LanguageContext';
import { ArrowLeft as MdArrowBack } from 'lucide-react';

interface CartItemsListProps {
    items: CartItemType[];
    cartCount: number;
    removeItem: (id: string, selectedOption?: string) => void;
    updateQuantity: (id: string, quantity: number, selectedOption?: string) => void;
}

const CartItemsList = ({ items, cartCount, removeItem, updateQuantity }: CartItemsListProps) => {
    const { t, dir } = useLanguage();

    return (
        <div className="flex flex-col gap-6 sm:gap-8 lg:col-span-8">
            <div className="flex flex-col gap-1 pb-4 border-b border-gray-200 dark:border-white/10">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--color-brand)] dark:text-white">{t('cart.yourCart')}</h1>
                <p className="text-xs font-semibold text-gray-400">{cartCount} {t('orderComplete.items')}</p>
            </div>
            <div className="flex flex-col gap-3 md:gap-0 md:border-y md:border-gray-200 md:dark:border-white/10 md:divide-y md:divide-gray-200 md:dark:divide-white/10">
                {items.map(item => {
                    const itemKey = `${item.id}:${item.selectedOption || ''}`;
                    return (
                        <CartItem
                            key={itemKey}
                            item={item}
                            removeItem={removeItem}
                            updateQuantity={updateQuantity}
                        />
                    );
                })}
            </div>
            <div className="mt-2">
                <Link href="/products" className="relative inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 hover:text-[var(--color-accent)] dark:hover:text-[var(--color-accent-light)] transition-colors">
                    <MdArrowBack className={`text-base ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    {t('cart.continueShopping')}
                </Link>
            </div>
        </div>
    );
};

export default CartItemsList;

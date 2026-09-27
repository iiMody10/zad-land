"use client";

import React from 'react';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/app/context/CartContext';
import PriceText from '@/app/components/PriceText';
import { getSafeImageUrl } from '@/lib/image-utils';
import { formatItemsPerPackage, formatPackageQuantity } from '@/lib/packaging';
import { useLanguage } from '@/app/context/LanguageContext';

interface CartItemProps {
    item: CartItemType;
    removeItem: (id: string, selectedOption?: string) => void;
    updateQuantity: (id: string, quantity: number, selectedOption?: string) => void;
}

const CartItem = ({ item, removeItem, updateQuantity }: CartItemProps) => {
    const { language } = useLanguage();

    return (
        <div className="flex items-center gap-4 md:gap-6 py-6 transition-all hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
            {/* Remove Button */}
            <button
                onClick={() => removeItem(item.id, item.selectedOption)}
                className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors p-2 shrink-0 flex items-center justify-center"
                aria-label="Remove item"
            >
                <span className="text-3xl font-light leading-none mb-1">×</span>
            </button>

            {/* Image */}
            <div className="shrink-0">
                <div className="relative w-[100px] h-[100px] md:w-[120px] md:h-[120px] bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <img
                        src={getSafeImageUrl(item.image.split(',')[0])}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                        loading="lazy"
                    />
                </div>
            </div>

            {/* Content (Title/Price Left, Controls Right) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between flex-1 min-w-0 gap-4 md:gap-8">
                {/* Product Info */}
                <div className="flex flex-col gap-1 min-w-0">
                    <Link href={`/products/${item.slug}`} className="text-sm md:text-base font-bold text-[var(--color-brand)] dark:text-white transition-colors hover:text-[var(--color-accent)] dark:hover:text-[var(--color-accent-light)] line-clamp-2">
                        {item.name}
                    </Link>
                    {item.selectedOption && (
                        <span className="text-xs font-bold text-[var(--color-accent)] bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 px-2 py-0.5 rounded w-fit">
                            {item.selectedOption}
                        </span>
                    )}
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatPackageQuantity(item.quantity, item.packaging, language)}
                        {item.itemsPerPackage ? ` · ${formatItemsPerPackage(item.itemsPerPackage, item.packaging, language)}` : ''}
                    </span>
                    <p dir="ltr" className="text-xs md:text-sm font-extrabold text-zinc-900 dark:text-white w-fit">
                        <PriceText amount={item.price} />
                    </p>
                </div>

                {/* Controls and Total */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                    {/* Pill Quantity */}
                    <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl h-10 px-1 w-[110px] bg-gray-50 dark:bg-zinc-800 shrink-0">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedOption)}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-[var(--color-accent)] transition-colors text-base cursor-pointer font-bold"
                        >−</button>
                        <span className="flex-1 text-center font-bold text-sm text-zinc-900 dark:text-white select-none">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedOption)}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-[var(--color-accent)] transition-colors text-base cursor-pointer font-bold"
                        >+</button>
                    </div>

                    {/* Total */}
                    <div className="text-right rtl:text-left min-w-[80px] shrink-0">
                        <p dir="ltr" className="font-extrabold text-sm md:text-base text-zinc-900 dark:text-white">
                            <PriceText amount={item.price * item.quantity} />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;

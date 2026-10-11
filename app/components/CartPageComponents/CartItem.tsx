"use client";

import React from 'react';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/app/context/CartContext';
import PriceText from '@/app/components/PriceText';
import { getSafeImageUrl } from '@/lib/image-utils';
import { formatItemsPerPackage, formatPackageQuantity } from '@/lib/packaging';
import { useLanguage } from '@/app/context/LanguageContext';
import { Trash2 } from 'lucide-react';

interface CartItemProps {
    item: CartItemType;
    removeItem: (id: string, selectedOption?: string) => void;
    updateQuantity: (id: string, quantity: number, selectedOption?: string) => void;
}

const CartItem = ({ item, removeItem, updateQuantity }: CartItemProps) => {
    const { language } = useLanguage();
    const isArabic = language === 'ar';
    const imageSrc = getSafeImageUrl(item.image ? item.image.split(',')[0].trim() : '');

    return (
        <div>
            {/* Mobile View: Modern B2B Card (< md) */}
            <div className="relative rounded-2xl border border-gray-200/80 bg-white p-3.5 shadow-2xs transition-all hover:border-[var(--color-accent)]/35 dark:border-white/10 dark:bg-zinc-900/60 md:hidden">
                {/* Remove button at top-end corner */}
                <button
                    onClick={() => removeItem(item.id, item.selectedOption)}
                    className="absolute top-3 rtl:left-3 ltr:right-3 flex size-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20"
                    aria-label={isArabic ? 'إزالة من السلة' : 'Remove item'}
                >
                    <Trash2 className="size-4" />
                </button>

                <div className="flex gap-3">
                    {/* Thumbnail */}
                    <Link
                        href={`/products/${item.slug}`}
                        className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-slate-50 p-1 dark:border-white/5 dark:bg-zinc-800"
                    >
                        <img
                            src={imageSrc}
                            alt={item.name}
                            className="size-full object-contain"
                            loading="lazy"
                        />
                    </Link>

                    {/* Info */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between pe-8">
                        <div>
                            <Link
                                href={`/products/${item.slug}`}
                                className="line-clamp-2 text-xs font-bold leading-snug text-[var(--color-brand)] transition-colors hover:text-[var(--color-accent)] dark:text-white dark:hover:text-[var(--color-accent-light)] sm:text-sm"
                            >
                                {item.name}
                            </Link>

                            {item.selectedOption && (
                                <span className="mt-1 inline-block rounded border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 px-2 py-0.5 text-[10px] font-bold text-[var(--color-accent)]">
                                    {item.selectedOption}
                                </span>
                            )}

                            <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                {formatPackageQuantity(item.quantity, item.packaging, language)}
                                {item.itemsPerPackage ? ` · ${formatItemsPerPackage(item.itemsPerPackage, item.packaging, language)}` : ''}
                            </p>
                        </div>

                        {/* Unit price */}
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                            <span className="text-[11px] text-slate-400">{isArabic ? 'سعر الطرد:' : 'Unit:'}</span>
                            <span dir="ltr" className="font-bold text-zinc-900 dark:text-white">
                                <PriceText amount={item.price} />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Stepper + Total Price */}
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/5">
                    {/* Stepper */}
                    <div className="flex h-8 items-center rounded-xl border border-gray-200 bg-gray-50 px-1 dark:border-white/10 dark:bg-zinc-800">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedOption)}
                            className="flex h-full w-7 cursor-pointer items-center justify-center text-sm font-bold text-gray-500 transition-colors hover:text-[var(--color-accent)]"
                            aria-label={isArabic ? 'تقليل الكمية' : 'Decrease quantity'}
                        >−</button>
                        <span className="w-8 select-none text-center text-xs font-bold text-zinc-900 dark:text-white">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedOption)}
                            className="flex h-full w-7 cursor-pointer items-center justify-center text-sm font-bold text-gray-500 transition-colors hover:text-[var(--color-accent)]"
                            aria-label={isArabic ? 'زيادة الكمية' : 'Increase quantity'}
                        >+</button>
                    </div>

                    {/* Total Price for this item */}
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-[11px] font-medium text-slate-400">{isArabic ? 'المجموع:' : 'Total:'}</span>
                        <span dir="ltr" className="text-base font-extrabold text-[var(--color-brand)] dark:text-amber-400">
                            <PriceText amount={item.price * item.quantity} />
                        </span>
                    </div>
                </div>
            </div>

            {/* Desktop View: Spacious Row Layout (hidden md:flex) */}
            <div className="hidden md:flex items-center gap-6 py-5 transition-all hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                {/* Remove Button */}
                <button
                    onClick={() => removeItem(item.id, item.selectedOption)}
                    className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20"
                    aria-label={isArabic ? 'إزالة من السلة' : 'Remove item'}
                >
                    <Trash2 className="size-4" />
                </button>

                {/* Product Image */}
                <Link href={`/products/${item.slug}`} className="shrink-0">
                    <div className="relative size-[90px] overflow-hidden rounded-xl border border-gray-200 bg-white p-2 dark:border-white/10 dark:bg-zinc-900">
                        <img
                            src={imageSrc}
                            alt={item.name}
                            className="size-full object-contain"
                            loading="lazy"
                        />
                    </div>
                </Link>

                {/* Content: Title & Details */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Link
                        href={`/products/${item.slug}`}
                        className="line-clamp-2 text-sm font-bold text-[var(--color-brand)] transition-colors hover:text-[var(--color-accent)] dark:text-white dark:hover:text-[var(--color-accent-light)] lg:text-base"
                    >
                        {item.name}
                    </Link>
                    {item.selectedOption && (
                        <span className="w-fit rounded border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 px-2 py-0.5 text-xs font-bold text-[var(--color-accent)]">
                            {item.selectedOption}
                        </span>
                    )}
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatPackageQuantity(item.quantity, item.packaging, language)}
                        {item.itemsPerPackage ? ` · ${formatItemsPerPackage(item.itemsPerPackage, item.packaging, language)}` : ''}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400" dir="ltr">
                        <span>{isArabic ? 'سعر الطرد:' : 'Unit:'}</span>
                        <span className="font-bold text-zinc-900 dark:text-white">
                            <PriceText amount={item.price} />
                        </span>
                    </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex h-10 w-[110px] shrink-0 items-center rounded-xl border border-gray-200 bg-gray-50 px-1 dark:border-white/10 dark:bg-zinc-800">
                    <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedOption)}
                        className="flex h-full w-8 cursor-pointer items-center justify-center text-base font-bold text-gray-500 transition-colors hover:text-[var(--color-accent)]"
                        aria-label={isArabic ? 'تقليل الكمية' : 'Decrease quantity'}
                    >−</button>
                    <span className="flex-1 select-none text-center text-sm font-bold text-zinc-900 dark:text-white">
                        {item.quantity}
                    </span>
                    <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedOption)}
                        className="flex h-full w-8 cursor-pointer items-center justify-center text-base font-bold text-gray-500 transition-colors hover:text-[var(--color-accent)]"
                        aria-label={isArabic ? 'زيادة الكمية' : 'Increase quantity'}
                    >+</button>
                </div>

                {/* Item Total Price */}
                <div className="min-w-[100px] shrink-0 text-right rtl:text-left" dir="ltr">
                    <p className="text-base font-extrabold text-zinc-900 dark:text-white lg:text-lg">
                        <PriceText amount={item.price * item.quantity} />
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartItem;

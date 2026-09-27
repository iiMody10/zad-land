"use client";

import React, { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { X as MdClose, ShoppingBag as MdShoppingBag, Trash2 as MdDelete, ArrowRight as MdArrowForward, ArrowLeft as MdArrowBack } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useLanguage } from '@/app/context/LanguageContext';
import PriceText from '@/app/components/PriceText';
import { formatItemsPerPackage, formatPackageQuantity } from '@/lib/packaging';

const CartDrawer = () => {
    const { items, subtotal, isDrawerOpen, closeDrawer, updateQuantity, removeItem } = useCart();
    const { dir, language } = useLanguage();
    const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isDrawerOpen]);

    if (!mounted) return null;

    const drawerTransform = dir === 'rtl' 
        ? (isDrawerOpen ? 'translate-x-0' : '-translate-x-full') 
        : (isDrawerOpen ? 'translate-x-0' : 'translate-x-full');

    return (
        <>
            {/* Backdrop Overlay */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-[9998] transition-opacity duration-300 ${
                    isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={closeDrawer}
            />

            {/* Drawer Panel */}
            <div 
                className={`fixed top-0 bottom-0 z-[9999] w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl transition-transform duration-300 ease-out transform ${drawerTransform} ${
                    dir === 'rtl' ? 'left-0' : 'right-0'
                } flex flex-col border-s border-gray-100 dark:border-white/10`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 dark:border-white/10 shrink-0">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
                        <MdShoppingBag className="text-xl" />
                        <span>{language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}</span>
                        <span className="text-xs font-semibold text-gray-400 ms-1">
                            ({items.reduce((acc, item) => acc + item.quantity, 0)})
                        </span>
                    </h2>
                    <button 
                        onClick={closeDrawer}
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-500 hover:text-black dark:hover:text-white"
                        aria-label="Close drawer"
                    >
                        <MdClose className="text-xl" />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
                            <div className="w-16 h-16 rounded-full bg-[var(--color-canvas)] dark:bg-[var(--color-background-dark)] flex items-center justify-center mb-4 border border-[var(--color-accent)]/20">
                                <MdShoppingBag className="text-3xl text-[var(--color-accent)]" />
                            </div>
                            <p className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                                {language === 'ar' ? 'سلة التسوق فارغة' : 'Your cart is empty'}
                            </p>
                            <p className="text-xs text-gray-400 mb-6 max-w-xs">
                                {language === 'ar' ? 'استكشف منتجاتنا وأضف ما يعجبك إلى السلة' : 'Explore our collection and add your favorite items.'}
                            </p>
                            <button 
                                onClick={closeDrawer}
                                className="px-6 py-2.5 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white rounded-xl font-bold text-xs transition-all active:scale-95"
                            >
                                {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
                            </button>
                        </div>
                    ) : (
                        items.map(item => {
                            const imageSrc = item.image ? item.image.split(',')[0].trim() : '';
                            const itemKey = `${item.id}:${item.selectedOption || ''}`;
                            return (
                                <div key={itemKey} className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-2xl flex gap-3 relative border border-gray-100 dark:border-white/5">
                                    <div 
                                        className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-xl bg-contain bg-center bg-no-repeat shrink-0 border border-gray-100 dark:border-white/5 p-1"
                                        style={{ backgroundImage: `url('${imageSrc}')` }}
                                    />
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                        <div className="pe-7">
                                            <Link 
                                                href={`/products/${item.slug}`} 
                                                onClick={closeDrawer}
                                                className={`font-semibold text-xs sm:text-sm text-zinc-900 dark:text-white line-clamp-2 leading-snug block ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                                            >
                                                <span className="hover:text-[var(--color-accent)] dark:hover:text-[var(--color-accent-light)] transition-colors">{item.name}</span>
                                            </Link>
                                            {item.selectedOption && (
                                                <span className="inline-block mt-1 text-[10px] font-bold bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 px-2 py-0.5 rounded">
                                                    {item.selectedOption}
                                                </span>
                                            )}
                                            <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                                                {formatPackageQuantity(item.quantity, item.packaging, language)}
                                                {item.itemsPerPackage ? ` · ${formatItemsPerPackage(item.itemsPerPackage, item.packaging, language)}` : ''}
                                            </p>
                                            <p className="text-zinc-900 dark:text-white font-extrabold text-xs sm:text-sm mt-1" dir="ltr">
                                                <PriceText amount={item.price} />
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-white/10 h-7 px-1">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedOption)}
                                                    className="w-6 h-full flex items-center justify-center text-gray-500 hover:text-[var(--color-accent)] transition-colors text-xs font-bold"
                                                >-</button>
                                                <span className="w-6 text-center text-xs font-bold text-zinc-900 dark:text-white select-none">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedOption)}
                                                    className="w-6 h-full flex items-center justify-center text-gray-500 hover:text-[var(--color-accent)] transition-colors text-xs font-bold"
                                                >+</button>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => removeItem(item.id, item.selectedOption)}
                                            className="absolute top-3 ltr:right-3 rtl:left-3 text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                                            aria-label="Remove item"
                                        >
                                            <MdDelete className="text-base" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-zinc-900 shrink-0 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 font-medium">{language === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                            <PriceText amount={subtotal} className="text-base font-extrabold text-zinc-900 dark:text-white" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 pt-1">
                            <Link
                                href="/cart"
                                onClick={closeDrawer}
                                className="w-full py-3 bg-gray-50 dark:bg-zinc-800 hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)] border border-gray-200 dark:border-white/10 text-zinc-900 dark:text-white text-center rounded-xl font-bold text-xs transition-colors flex items-center justify-center"
                            >
                                {language === 'ar' ? 'عرض السلة' : 'View Cart'}
                            </Link>

                            <Link
                                href="/place-order"
                                onClick={closeDrawer}
                                className="w-full py-3 bg-[var(--color-brand-hover)] hover:bg-[var(--color-brand-hover)] text-white text-center rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 active:scale-95"
                            >
                                <span>{language === 'ar' ? 'إتمام الطلب' : 'Checkout'}</span>
                                {dir === 'rtl' ? <MdArrowBack className="text-sm" /> : <MdArrowForward className="text-sm" />}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;

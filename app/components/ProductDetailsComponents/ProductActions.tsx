"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useCart } from "@/app/context/CartContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { Check as MdCheck, Minus as MdRemove, Plus as MdAdd, ShoppingBag as MdShoppingBag } from 'lucide-react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from 'react-hot-toast';
import { formatItemsPerPackage, formatPackaging, formatPackageQuantity } from '@/lib/packaging';
import WishlistButton from '@/app/components/WishlistButton';

interface ProductActionsProps {
    product: {
        id: string;
        name: string;
        nameAr?: string | null;
        nameEn?: string | null;
        price: number | null;
        image: string;
        slug: string;
        options?: string | null;
        minOrder?: number;
        packaging?: string | null;
        itemsPerPackage?: string | null;
        description?: string | null;
        descriptionAr?: string | null;
        descriptionEn?: string | null;
    };
    stock?: number;
}

const ProductActions = ({ product, stock }: ProductActionsProps) => {
    const { addItem, items } = useCart();
    const { language } = useLanguage();
    const router = useRouter();
    const [quantity, setQuantity] = useState(product.minOrder || 1);
    const [wasAdded, setWasAdded] = useState(false);
    const addLockedRef = useRef(false);
    const addedFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (addedFeedbackTimer.current) clearTimeout(addedFeedbackTimer.current);
    }, []);

    const resetAddedFeedback = () => {
        if (addedFeedbackTimer.current) clearTimeout(addedFeedbackTimer.current);
        addedFeedbackTimer.current = null;
        addLockedRef.current = false;
        setWasAdded(false);
    };

    // Options parsing
    const parsedOptions = product.options 
        ? product.options.split(',').map(o => o.trim()).filter(Boolean)
        : [];
    const [selectedOption, setSelectedOption] = useState<string>(
        parsedOptions.length > 0 ? parsedOptions[0] : ""
    );
    const quantityInCart = items.reduce((sum, item) => item.id === product.id ? sum + item.quantity : sum, 0);
    const remainingStock = stock === undefined ? Number.POSITIVE_INFINITY : Math.max(0, stock - quantityInCart);

    const displayName = (language === 'ar' ? product.nameAr : product.nameEn) || product.name || product.nameAr || '';
    const displayDesc = language === 'ar'
        ? (product.descriptionAr || product.description)
        : (product.descriptionEn || product.description);

    const handleDecrement = () => {
        if (quantity > (product.minOrder || 1)) {
            resetAddedFeedback();
            setQuantity(quantity - 1);
        }
    };

    const handleIncrement = () => {
        if (quantity < remainingStock) {
            resetAddedFeedback();
            setQuantity(quantity + 1);
        }
    };

    const addSelectedQuantity = () => {
        if (product.price == null) return 0;
        const remaining = stock === undefined ? Number.POSITIVE_INFINITY : Math.max(0, stock - items.reduce((sum, item) => item.id === product.id ? sum + item.quantity : sum, 0));
        const minOrder = product.minOrder || 1;
        if (remaining < minOrder) {
            toast.error(language === 'ar' ? 'وصلت إلى الحد الأقصى المتاح من هذا المنتج' : 'You already have all available stock in your cart');
            return 0;
        }
        const quantityToAdd = Math.min(quantity, remaining);
        addItem({
            id: product.id,
            name: displayName,
            price: Number(product.price),
            image: product.image,
            slug: product.slug,
            quantity: quantityToAdd,
            minOrder: product.minOrder,
            stock,
            packaging: product.packaging,
            itemsPerPackage: product.itemsPerPackage,
            description: displayDesc || undefined,
            selectedOption: selectedOption || undefined,
        });
        return quantityToAdd;
    };

    const handleAddToCart = () => {
        if (product.price == null || addLockedRef.current) return;
        const quantityToAdd = addSelectedQuantity();
        if (!quantityToAdd) return;
        addLockedRef.current = true;
        setWasAdded(true);
        if (addedFeedbackTimer.current) clearTimeout(addedFeedbackTimer.current);
        addedFeedbackTimer.current = setTimeout(() => {
            addLockedRef.current = false;
            setWasAdded(false);
            addedFeedbackTimer.current = null;
        }, 2500);
        toast.success(language === 'ar'
            ? `تمت إضافة ${formatPackageQuantity(quantityToAdd, product.packaging, 'ar')} من ${displayName} إلى السلة`
            : `${formatPackageQuantity(quantityToAdd, product.packaging, 'en')} of ${displayName} added to cart`);
    };

    const handleBuyNow = () => {
        if (product.price == null) return;
        if (!addSelectedQuantity()) return;
        router.push("/place-order");
    };

    const displayStock = stock !== undefined ? stock : 0;

    if (product.price == null) return <Link href="/account/login" className="my-3 inline-flex w-full justify-center rounded-xl bg-[var(--color-brand-hover)] px-5 py-3.5 text-sm font-bold text-white hover:bg-[var(--color-brand-hover)]">{language === 'ar' ? 'سجل الدخول لعرض السعر والطلب' : 'Sign in to view prices and order'}</Link>;
    if (stock !== undefined && stock < (product.minOrder || 1)) return <div className="my-3 space-y-3"><p className="rounded-xl bg-amber-50 px-5 py-3.5 text-center text-sm font-bold text-amber-900">{language === 'ar' ? 'الكمية المطلوبة غير متوفرة حالياً' : 'Not enough packages available right now'}</p><WishlistButton productId={product.id} showLabel className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[var(--color-brand-hover)] dark:border-white/10" /></div>;

    return (
        <div className="flex flex-col gap-4 my-2">
            {/* Options / Variants Selector */}
            {parsedOptions.length > 0 && (
                <div className="w-full bg-gray-50/80 dark:bg-zinc-800/40 p-3.5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                            {language === 'ar' ? 'الخيارات والأحجام:' : 'Options / Sizes:'}
                        </span>
                        {selectedOption && (
                            <span className="text-xs font-bold text-[var(--color-accent)]">
                                {selectedOption}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {parsedOptions.map((opt, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => {
                                    resetAddedFeedback();
                                    setSelectedOption(opt);
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    selectedOption === opt
                                        ? 'bg-[var(--color-accent)] text-white ring-2 ring-[var(--color-accent)]/20'
                                        : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-[var(--color-accent)]'
                                }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Wholesale Packaging & Availability Badge */}
            <div className="w-full rounded-2xl bg-[var(--color-canvas)] dark:bg-zinc-800/60 border border-[var(--color-accent)]/25 dark:border-white/10 p-3.5 flex flex-col gap-2 shadow-2xs">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--color-brand)] dark:text-white">
                        <span className="inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-brand-hover)]"></span>
                        <span>
                            {language === 'ar' ? 'متوفر للتوريد المباشر بالجملة' : 'In Stock for Wholesale Supply'}
                        </span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-brand-hover)]/10 text-[var(--color-brand-hover)] dark:bg-[var(--color-brand-hover)]/20 dark:text-[var(--color-brand-light)]">
                        {language === 'ar' ? 'بيع بالجملة' : 'Wholesale B2B'}
                    </span>
                </div>

                {displayStock > 0 && (
                    <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-gray-300 font-semibold pt-2 border-t border-[var(--color-accent)]/15 dark:border-white/5">
                        <span>
                            {language === 'ar' 
                                ? `${formatPackageQuantity(displayStock, product.packaging, 'ar')} متاح للطلب`
                                : `${formatPackageQuantity(displayStock, product.packaging, 'en')} available to order`}
                        </span>
                    </div>
                )}
                {product.itemsPerPackage && (
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {language === 'ar' ? 'محتويات وحدة البيع: ' : 'Package contents: '}
                        {formatItemsPerPackage(product.itemsPerPackage, product.packaging, language)}
                    </p>
                )}
            </div>

            {/* Quantity and Add to Cart Row */}
            <div className="flex flex-col gap-1.5 mt-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-gray-300 px-0.5">
                    <span>{language === 'ar' ? `الكمية المطلوبة (${formatPackaging(product.packaging, 'ar')}):` : `Quantity (${formatPackaging(product.packaging, 'en')}):`}</span>
                    <span className="text-[var(--color-accent)] dark:text-[var(--color-accent-light)] font-semibold">
                        {language === 'ar' ? `الحد الأدنى ${formatPackageQuantity(product.minOrder || 1, product.packaging, 'ar')}` : `Minimum ${formatPackageQuantity(product.minOrder || 1, product.packaging, 'en')}`}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center h-12 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-zinc-800/50 px-2 shrink-0">
                        <button
                            onClick={handleDecrement}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[var(--color-accent)] transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                        >
                            <MdRemove size={18} />
                        </button>
                        <span className="w-8 text-center text-sm font-extrabold text-zinc-900 dark:text-white select-none">{quantity}</span>
                        <button
                            onClick={handleIncrement}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[var(--color-accent)] transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                        >
                            <MdAdd size={18} />
                        </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={wasAdded || remainingStock < (product.minOrder || 1)}
                        className={`flex-1 h-12 ${wasAdded ? 'cursor-not-allowed bg-emerald-700 opacity-90' : remainingStock < (product.minOrder || 1) ? 'cursor-not-allowed bg-slate-400 opacity-80' : 'cursor-pointer bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] dark:bg-[var(--color-accent)] dark:hover:bg-[var(--color-accent-hover)] active:scale-[0.99]'} text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm`}
                        aria-live="polite"
                    >
                        {wasAdded ? <MdCheck className="text-lg" aria-hidden="true" /> : <MdShoppingBag className="text-lg" aria-hidden="true" />}
                        <span>{wasAdded
                            ? (language === 'ar' ? 'تمت الإضافة إلى السلة' : 'Added to cart')
                            : remainingStock < (product.minOrder || 1)
                                ? (language === 'ar' ? 'اكتملت الكمية المتاحة في السلة' : 'All available stock is in your cart')
                                : (language === 'ar' ? 'إضافة للطلبية' : 'Add to Cart')}
                        </span>
                    </button>
                </div>
            </div>

            {/* Buy Now Button */}
            <button
                onClick={handleBuyNow}
                disabled={remainingStock < (product.minOrder || 1)}
                className="w-full h-12 bg-[var(--color-brand-hover)] hover:bg-[var(--color-brand-hover)] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-400 disabled:opacity-80"
            >
                {remainingStock < (product.minOrder || 1)
                    ? (language === 'ar' ? 'اكتملت الكمية المتاحة في السلة' : 'All available stock is in your cart')
                    : (language === 'ar' ? 'شراء وتثبيت الطلب' : 'Buy Now')}
            </button>
            <WishlistButton productId={product.id} showLabel className="self-start rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[var(--color-brand-hover)] hover:bg-[var(--color-brand-soft)] dark:border-white/10" />
        </div>
    );
};

export default ProductActions;

"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ResilientImage from '@/app/components/ResilientImage';
import PriceText from '@/app/components/PriceText';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCart } from '@/app/context/CartContext';
import { Search as MdSearch, ShoppingBag as MdShoppingBag, Plus as MdAdd, Minus as MdRemove } from 'lucide-react';
import { formatItemsPerPackage, formatPackaging, formatPackageQuantity } from '@/lib/packaging';
import WishlistButton from '@/app/components/WishlistButton';

const QuickViewModal = dynamic(() => import('./QuickViewModal'), { ssr: false });

export interface Product {
    id: string;
    slug: string;
    name: string;
    nameAr?: string | null;
    nameEn?: string | null;
    description: string | null;
    descriptionAr?: string | null;
    descriptionEn?: string | null;
    price: string | number | null;
    discountPrice?: string | number | null;
    images: string;
    categoryId?: string;
    stock?: number | null;
    pricingNeedsReview?: boolean;
    minOrder?: number;
    packaging?: string | null;
    itemsPerPackage?: string | null;
    options?: string | null;
    isTrending?: boolean;
    brand?: {
        id: string;
        name: string;
        slug: string;
        group?: string;
    } | null;
}

export interface ProductCardProps {
    product: Product;
    variant?: 'default' | 'compact';
    badge?: string | null;
    showBadge?: boolean;
    isFeaturedSpan?: boolean;
}

const ProductCard = ({ product, badge, showBadge = true }: ProductCardProps) => {
    const { language, dir } = useLanguage();
    const { items, addItem, updateQuantity, removeItem } = useCart();
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [isSecondaryLoaded, setIsSecondaryLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Localized title & description
    const displayName = (language === 'ar' ? product.nameAr : product.nameEn) || product.name || product.nameAr || '';

    const displayBrandName = (() => {
        if (!product.brand?.name) return 'Zad Land';
        const parts = product.brand.name.split('-');
        if (language === 'ar') {
            return parts[1]?.trim() || parts[0]?.trim();
        }
        return parts[0]?.trim();
    })();

    const displayDesc = language === 'ar'
        ? (product.descriptionAr || product.description)
        : (product.descriptionEn || product.description);

    // Options parsing
    const parsedOptions = product.options 
        ? product.options.split(',').map(o => o.trim()).filter(Boolean)
        : [];
    const defaultOption = parsedOptions.length > 0 ? parsedOptions[0] : undefined;

    // Check if this item is in cart
    const cartItem = items.find(item => item.id === product.id && item.selectedOption === defaultOption);
    const quantityInCart = cartItem ? cartItem.quantity : 0;
    const totalQuantityInCart = items.reduce((sum, item) => item.id === product.id ? sum + item.quantity : sum, 0);
    const stockLimitReached = product.stock != null && totalQuantityInCart >= product.stock;

    const images = typeof product.images === 'string'
        ? product.images.split(',').map(img => img.trim()).filter(Boolean)
        : Array.isArray(product.images) ? product.images : [];
    
    const primaryImage = images[0] || '';
    const secondaryImage = images.length > 1 && images[1] !== images[0] ? images[1] : null;
    const hasSecondaryImage = !!secondaryImage;

    const handleInitialAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.price == null || product.stock === 0 || product.pricingNeedsReview || stockLimitReached) return;
        addItem({
            id: product.id,
            name: displayName,
            price: Number(product.discountPrice || product.price),
            image: primaryImage,
            slug: product.slug,
            quantity: product.minOrder || 1,
            minOrder: product.minOrder,
            stock: product.stock,
            packaging: product.packaging,
            itemsPerPackage: product.itemsPerPackage,
            description: displayDesc || undefined,
            selectedOption: defaultOption,
        });
    };

    const handleIncrease = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!stockLimitReached && (product.stock == null || quantityInCart < product.stock)) updateQuantity(product.id, quantityInCart + 1, defaultOption);
    };

    const handleDecrease = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (quantityInCart <= (product.minOrder || 1)) {
            removeItem(product.id, defaultOption);
        } else {
            updateQuantity(product.id, quantityInCart - 1, defaultOption);
        }
    };

    const displayBadge = product.isTrending 
        ? (language === 'ar' ? 'مميز' : 'Trending') 
        : badge;

    return (
        <>
            <div 
                onMouseEnter={() => setIsHovered(true)}
                className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden transition-colors duration-200 border border-gray-200/80 dark:border-white/10 hover:border-[var(--color-accent)]/40 p-0 w-full h-full shadow-xs hover:shadow-sm"
            >
                
                {/* Badge matching Theme (var(--color-accent) for trending, var(--color-brand-hover) for new arrival) */}
                {showBadge && (product.isTrending || badge) && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-none">
                        <span className={`${product.isTrending ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-brand-hover)]'} text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs`}>
                            {displayBadge}
                        </span>
                    </div>
                )}

                {/* Quick View Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsQuickViewOpen(true);
                    }}
                    className="absolute z-20 top-3 left-3 sm:top-4 sm:left-4 w-7 h-7 sm:w-8 sm:h-8 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-full flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[var(--color-accent)] hover:text-white dark:hover:bg-[var(--color-accent)] dark:hover:text-white border border-gray-200/60 dark:border-white/10"
                    aria-label="Quick View"
                >
                    <MdSearch className="text-sm sm:text-base" />
                </button>
                <WishlistButton
                    productId={product.id}
                    className="absolute z-20 top-12 left-3 h-7 w-7 rounded-full border border-gray-200/60 bg-white/95 text-lg text-[var(--color-brand-hover)] opacity-90 shadow-sm transition-all duration-200 hover:bg-[var(--color-brand-soft)] focus-visible:opacity-100 sm:top-14 sm:left-4 sm:h-8 sm:w-8 sm:opacity-0 sm:group-hover:opacity-100 dark:border-white/10 dark:bg-zinc-800/95"
                />

                {/* Image Area (Square, fills container with rounded border radius) */}
                <div className="relative w-full aspect-square overflow-hidden bg-gray-50/80 dark:bg-zinc-800/40">
                    <Link href={`/products/${product.slug}`} className="absolute inset-0 block w-full h-full" aria-label={product.name}>
                        {/* Primary Image Wrapper */}
                        <div className={`absolute inset-0 transition-all duration-500 z-10 ${hasSecondaryImage && isSecondaryLoaded ? 'group-hover:opacity-0' : ''}`}>
                            <ResilientImage
                                alt={product.name}
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 240px"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                src={primaryImage}
                                loading="lazy"
                            />
                        </div>
                        
                        {/* Secondary Image Wrapper */}
                        {hasSecondaryImage && isHovered && (
                            <div className="absolute inset-0 transition-all duration-300 opacity-0 group-hover:opacity-100 z-0">
                                <ResilientImage
                                    alt={product.name}
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 240px"
                                    className="w-full h-full object-cover transition-transform duration-300 scale-100 group-hover:scale-[1.03]"
                                    src={secondaryImage}
                                    loading="lazy"
                                    onLoad={() => setIsSecondaryLoaded(true)}
                                />
                            </div>
                        )}
                    </Link>
                </div>

                {/* Information Area */}
                <div className={`flex flex-col flex-1 mt-2.5 px-2.5 pb-2.5 sm:px-4 sm:pb-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    
                    {/* Brand */}
                    <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] dark:text-[var(--color-accent-light)] mb-0.5 line-clamp-1">
                        {displayBrandName}
                    </span>

                    {/* Title */}
                    <h3 
                        className={`text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white line-clamp-2 leading-snug mb-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                    >
                        <Link href={`/products/${product.slug}`} className="hover:underline">
                            {displayName}
                        </Link>
                    </h3>

                    {/* Options Pills (if any) */}
                    {parsedOptions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1.5">
                            {parsedOptions.slice(0, 3).map((opt, i) => (
                                <span key={i} className="text-[9px] font-bold bg-[var(--color-canvas)] text-[var(--color-brand)] border border-[var(--color-accent)]/20 px-1.5 py-0.5 rounded">
                                    {opt}
                                </span>
                            ))}
                            {parsedOptions.length > 3 && (
                                <span className="text-[9px] font-bold text-gray-400">
                                    +{parsedOptions.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    <p className="mb-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">
                        {formatPackaging(product.packaging, language)}
                        {product.itemsPerPackage ? ` · ${formatItemsPerPackage(product.itemsPerPackage, product.packaging, language)}` : ''}
                        {(product.minOrder || 1) > 1 ? ` · ${language === 'ar' ? 'الحد الأدنى' : 'Min.'} ${formatPackageQuantity(product.minOrder || 1, product.packaging, language)}` : ''}
                    </p>

                    {/* Price and Packaging */}
                    <div className="mt-auto flex items-baseline justify-between gap-1 text-zinc-900 dark:text-white">
                        <div className="flex items-baseline gap-1.5 sm:gap-2">
                            {product.price != null && product.discountPrice && Number(product.discountPrice) < Number(product.price) ? (
                                <>
                                    <PriceText amount={product.discountPrice} className="text-xs font-extrabold text-[var(--color-brand-hover)] dark:text-[var(--color-brand-light)] sm:text-base" />
                                    <PriceText amount={product.price} className="text-[10px] font-normal text-gray-400 line-through sm:text-xs" />
                                </>
                            ) : (
                                <PriceText amount={product.price} className="text-xs font-extrabold text-[var(--color-brand)] dark:text-white sm:text-base" />
                            )}
                        </div>
                        {product.stock != null && product.stock > 0 ? (
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-gray-400 shrink-0">
                                {formatPackageQuantity(product.stock, product.packaging, language)} {language === 'ar' ? 'متاح' : 'available'}
                            </span>
                        ) : null}
                    </div>

                    {/* Mobile-Optimized Touch Target Add to Cart / Quantity Controller */}
                    <div className="mt-2.5 relative h-9 sm:h-10 w-full overflow-hidden rounded-xl">
                        {product.pricingNeedsReview ? (
                            <span className="flex h-full w-full items-center justify-center rounded-xl bg-amber-50 text-center text-[10px] font-bold text-amber-800 sm:text-xs">{language === 'ar' ? 'سعر الطرد قيد المراجعة' : 'Package price under review'}</span>
                        ) : product.price == null ? (
                            <Link href="/account/login" className="flex h-full w-full items-center justify-center rounded-xl bg-[var(--color-brand-hover)] text-center text-[11px] font-bold text-white sm:text-xs">{language === 'ar' ? 'دخول التاجر لعرض السعر' : 'Merchant sign in for price'}</Link>
                        ) : product.stock != null && product.stock < (product.minOrder || 1) ? (
                            <span className="flex h-full w-full items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500">{language === 'ar' ? 'غير متوفر حالياً' : 'Unavailable'}</span>
                        ) : stockLimitReached && quantityInCart === 0 ? (
                            <span className="flex h-full w-full items-center justify-center rounded-xl bg-slate-100 text-[10px] font-bold text-slate-500 sm:text-xs">{language === 'ar' ? 'اكتملت الكمية المتاحة في السلة' : 'All available stock is in your cart'}</span>
                        ) : quantityInCart === 0 ? (
                            <button
                                onClick={handleInitialAdd}
                                className="w-full h-full bg-[var(--color-brand-hover)] hover:bg-[var(--color-brand-hover)] text-white rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 touch-manipulation select-none shadow-xs"
                            >
                                <MdShoppingBag className="text-sm sm:text-base shrink-0 text-white" />
                                <span className="truncate">{language === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}</span>
                            </button>
                        ) : (
                            <div className="w-full h-full bg-[var(--color-brand-hover)] text-white rounded-xl font-bold text-xs flex items-center justify-between px-1.5 sm:px-2 transition-all duration-300 animate-scaleUp">
                                <button
                                    onClick={handleDecrease}
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors active:scale-90 touch-manipulation"
                                    aria-label="Decrease quantity"
                                >
                                    <MdRemove className="text-sm sm:text-base" />
                                </button>
                                
                                <span className="text-xs sm:text-sm font-extrabold tracking-wide px-1 select-none">
                                    {quantityInCart}
                                </span>

                                <button
                                    onClick={handleIncrease}
                                    disabled={stockLimitReached}
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors active:scale-90 touch-manipulation disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label="Increase quantity"
                                >
                                    <MdAdd className="text-sm sm:text-base" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isQuickViewOpen && (
                <QuickViewModal
                    product={product}
                    isOpen={isQuickViewOpen}
                    onClose={() => setIsQuickViewOpen(false)}
                />
            )}
        </>
    );
};

export default ProductCard;

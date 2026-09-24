"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ResilientImage from '@/app/components/ResilientImage';
import { useCurrency } from '@/app/context/CurrencyContext';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCart } from '@/app/context/CartContext';
import { MdSearch, MdShoppingBag, MdAdd, MdRemove } from 'react-icons/md';

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
    price: string | number;
    discountPrice?: string | number | null;
    images: string;
    categoryId?: string;
    stock?: number;
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
    const { formatPrice } = useCurrency();
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
    const cartItem = items.find(item => item.id === product.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    const images = typeof product.images === 'string'
        ? product.images.split(',').map(img => img.trim()).filter(Boolean)
        : Array.isArray(product.images) ? product.images : [];
    
    const primaryImage = images[0] || '';
    const secondaryImage = images.length > 1 && images[1] !== images[0] ? images[1] : null;
    const hasSecondaryImage = !!secondaryImage;

    const handleInitialAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: product.id,
            name: displayName,
            price: Number(product.discountPrice || product.price),
            image: primaryImage,
            slug: product.slug,
            quantity: 1,
            description: displayDesc || undefined,
            selectedOption: defaultOption,
        });
    };

    const handleIncrease = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        updateQuantity(product.id, quantityInCart + 1, defaultOption);
    };

    const handleDecrease = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (quantityInCart <= 1) {
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
                className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden transition-colors duration-200 border border-gray-200/80 dark:border-white/10 hover:border-[#B8860B]/40 p-2.5 sm:p-4 w-full h-full shadow-xs hover:shadow-sm"
            >
                
                {/* Badge matching Theme (#B8860B for trending, #2E7D32 for new arrival) */}
                {showBadge && (product.isTrending || badge) && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-none">
                        <span className={`${product.isTrending ? 'bg-[#B8860B]' : 'bg-[#2E7D32]'} text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs`}>
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
                    className="absolute z-20 top-3 left-3 sm:top-4 sm:left-4 w-7 h-7 sm:w-8 sm:h-8 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-full flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#B8860B] hover:text-white dark:hover:bg-[#B8860B] dark:hover:text-white border border-gray-200/60 dark:border-white/10"
                    aria-label="Quick View"
                >
                    <MdSearch className="text-sm sm:text-base" />
                </button>

                {/* Image Area (Square, fills container with rounded border radius) */}
                <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-gray-50/80 dark:bg-zinc-800/40">
                    <Link href={`/products/${product.slug}`} className="absolute inset-0 block w-full h-full" aria-label={product.name}>
                        {/* Primary Image Wrapper */}
                        <div className={`absolute inset-0 transition-all duration-500 z-10 ${hasSecondaryImage && isSecondaryLoaded ? 'group-hover:opacity-0' : ''}`}>
                            <ResilientImage
                                alt={product.name}
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 240px"
                                className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.03]"
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
                                    className="w-full h-full object-cover rounded-xl transition-transform duration-300 scale-100 group-hover:scale-[1.03]"
                                    src={secondaryImage}
                                    loading="lazy"
                                    onLoad={() => setIsSecondaryLoaded(true)}
                                />
                            </div>
                        )}
                    </Link>
                </div>

                {/* Information Area */}
                <div className={`flex flex-col flex-1 mt-2.5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    
                    {/* Brand */}
                    <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-[#B8860B] dark:text-[#E5B54A] mb-0.5 line-clamp-1">
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
                                <span key={i} className="text-[9px] font-bold bg-[#FAF6EC] text-[#072835] border border-[#B8860B]/20 px-1.5 py-0.5 rounded">
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

                    {/* Price and Packaging */}
                    <div className="mt-auto flex items-baseline justify-between gap-1 text-zinc-900 dark:text-white">
                        <div className="flex items-baseline gap-1.5 sm:gap-2">
                            {product.discountPrice && Number(product.discountPrice) < Number(product.price) ? (
                                <>
                                    <span className="text-xs sm:text-base font-extrabold text-[#2E7D32] dark:text-[#4ade80]">{formatPrice(Number(product.discountPrice))}</span>
                                    <span className="text-[10px] sm:text-xs text-gray-400 line-through font-normal">{formatPrice(Number(product.price))}</span>
                                </>
                            ) : (
                                <span className="text-xs sm:text-base font-extrabold text-[#072835] dark:text-white">{formatPrice(Number(product.price))}</span>
                            )}
                        </div>
                        {product.stock && product.stock > 0 ? (
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-gray-400 shrink-0">
                                {product.stock} {language === 'ar' ? 'قطعة/طرد' : 'pcs/ctn'}
                            </span>
                        ) : null}
                    </div>

                    {/* Mobile-Optimized Touch Target Add to Cart / Quantity Controller */}
                    <div className="mt-2.5 relative h-9 sm:h-10 w-full overflow-hidden rounded-xl">
                        {quantityInCart === 0 ? (
                            <button
                                onClick={handleInitialAdd}
                                className="w-full h-full bg-[#2E7D32] hover:bg-[#256629] text-white rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 touch-manipulation select-none shadow-xs"
                            >
                                <MdShoppingBag className="text-sm sm:text-base shrink-0 text-white" />
                                <span className="truncate">{language === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}</span>
                            </button>
                        ) : (
                            <div className="w-full h-full bg-[#2E7D32] text-white rounded-xl font-bold text-xs flex items-center justify-between px-1.5 sm:px-2 transition-all duration-300 animate-scaleUp">
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
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors active:scale-90 touch-manipulation"
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

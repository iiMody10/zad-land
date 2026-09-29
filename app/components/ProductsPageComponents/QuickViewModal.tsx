"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import ResilientImage from '@/app/components/ResilientImage';
import PriceText from '@/app/components/PriceText';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCart } from '@/app/context/CartContext';
import { X as MdClose } from 'lucide-react';
import { formatItemsPerPackage, formatPackaging, formatPackageQuantity } from '@/lib/packaging';

interface Product {
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
    brand?: {
        name: string;
    } | null;
}

interface QuickViewModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
    const { language, dir } = useLanguage();
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(product.minOrder || 1);

    const parsedOptions = product.options 
        ? product.options.split(',').map(o => o.trim()).filter(Boolean)
        : [];
    const [selectedOption, setSelectedOption] = useState<string>(parsedOptions[0] || "");
    
    if (!isOpen) return null;

    const displayName = (language === 'ar' ? product.nameAr : product.nameEn) || product.name || product.nameAr || '';

    const displayDesc = language === 'ar'
        ? (product.descriptionAr || product.description)
        : (product.descriptionEn || product.description);

    const images = typeof product.images === 'string'
        ? product.images.split(',').map(img => img.trim()).filter(Boolean)
        : Array.isArray(product.images) ? product.images : [];

    const primaryImage = images[0] || '';

    const handleAddToCart = () => {
        if (product.price == null || product.stock === 0 || product.pricingNeedsReview) return;
        addItem({
            id: product.id,
            name: displayName,
            price: Number(product.discountPrice || product.price),
            image: primaryImage,
            slug: product.slug,
            quantity: quantity,
            minOrder: product.minOrder,
            stock: product.stock,
            packaging: product.packaging,
            itemsPerPackage: product.itemsPerPackage,
            description: displayDesc || undefined,
            selectedOption: selectedOption || undefined,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden w-full max-w-[800px] flex flex-col md:flex-row relative border border-gray-100 dark:border-white/10"
                onClick={e => e.stopPropagation()}
                dir={dir}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-3.5 ltr:right-3.5 rtl:left-3.5 z-50 p-2 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white shadow-sm border border-gray-200/60 dark:border-white/10 transition-all hover:scale-105 cursor-pointer"
                    aria-label="Close"
                >
                    <MdClose size={20} />
                </button>

                {/* Left side (Details) */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <h2 className={`text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-2 tracking-normal ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        {displayName}
                    </h2>
                    
                    <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-gray-500">
                        {product.brand && (
                            <span>{language === 'ar' ? 'الشركة / الماركة:' : 'Brand:'} <span className="font-bold text-zinc-900 dark:text-white">{product.brand.name}</span></span>
                        )}
                    </div>

                    {/* Options Selector in Quick View */}
                    {parsedOptions.length > 0 && (
                        <div className="mb-4">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                                {language === 'ar' ? 'الخيارات / الحجم:' : 'Select Option:'}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {parsedOptions.map((opt, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setSelectedOption(opt)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            selectedOption === opt
                                                ? 'bg-[var(--color-accent)] text-white'
                                                : 'bg-gray-100 dark:bg-zinc-800 text-zinc-700 dark:text-gray-300 hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)]'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Wholesale Packaging Badge */}
                    {product.stock != null && product.stock > 0 ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-gray-300 font-semibold mb-3 bg-[var(--color-canvas)] dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-[var(--color-accent)]/20">
                            <span>{formatPackageQuantity(product.stock, product.packaging, language)} {language === 'ar' ? 'متاح' : 'available'}</span>
                        </div>
                    ) : null}

                    <p className="mb-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {formatPackaging(product.packaging, language)}
                        {product.itemsPerPackage ? ` · ${formatItemsPerPackage(product.itemsPerPackage, product.packaging, language)}` : ''}
                        {` · ${language === 'ar' ? 'الحد الأدنى' : 'Minimum'} ${formatPackageQuantity(product.minOrder || 1, product.packaging, language)}`}
                    </p>

                    <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-6">
                        {product.price != null && product.discountPrice && Number(product.discountPrice) < Number(product.price) ? (
                            <div className="flex items-center gap-3">
                                <PriceText amount={product.discountPrice} className="text-[var(--color-brand-hover)] dark:text-[var(--color-brand-light)]" />
                                <PriceText amount={product.price} className="text-base font-normal text-gray-400 line-through" />
                            </div>
                        ) : (
                            <PriceText amount={product.price} />
                        )}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        {product.pricingNeedsReview ? <span className="flex-1 rounded-xl bg-amber-50 py-3 text-center text-sm font-bold text-amber-800">{language === 'ar' ? 'سعر الطرد قيد المراجعة' : 'Package price under review'}</span> : product.price == null ? <Link href="/account/login" onClick={onClose} className="flex-1 rounded-xl bg-[var(--color-brand-hover)] py-3 text-center text-sm font-bold text-white">{language === 'ar' ? 'دخول التاجر لعرض السعر' : 'Merchant sign in for price'}</Link> : <button
                            onClick={handleAddToCart}
                            disabled={product.stock != null && product.stock < (product.minOrder || 1)}
                            className="flex-1 bg-[var(--color-brand-hover)] hover:bg-[var(--color-brand-hover)] text-white py-3 rounded-xl font-bold transition-all text-sm cursor-pointer"
                        >
                            {product.stock != null && product.stock < (product.minOrder || 1) ? (language === 'ar' ? 'غير متوفر' : 'Unavailable') : language === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}
                        </button>}
                        
                        <div className="flex items-center justify-between border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 w-28 bg-gray-50 dark:bg-zinc-800">
                            <button onClick={() => setQuantity(Math.max(product.minOrder || 1, quantity - 1))} className="text-gray-500 hover:text-[var(--color-accent)] font-bold cursor-pointer">-</button>
                            <span className="font-bold text-zinc-900 dark:text-white select-none">{quantity}</span>
                            <button onClick={() => setQuantity((current) => product.stock == null ? current + 1 : Math.min(product.stock, current + 1))} className="text-gray-500 hover:text-[var(--color-accent)] font-bold cursor-pointer">+</button>
                        </div>
                    </div>

                    <Link 
                        href={`/products/${product.slug}`}
                        className="text-xs font-bold text-gray-500 hover:text-[var(--color-accent)] flex items-center gap-1 transition-colors mt-2"
                        onClick={onClose}
                    >
                        {language === 'ar' ? 'عرض كل التفاصيل' : 'View full details'} →
                    </Link>
                </div>

                {/* Right side (Image) */}
                <div className="flex-1 bg-gray-50 dark:bg-zinc-800/40 relative min-h-[300px] md:min-h-[400px] overflow-hidden">
                    <ResilientImage
                        src={primaryImage}
                        alt={displayName}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;

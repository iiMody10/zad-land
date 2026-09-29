"use client";

import React from 'react';
import { useCart } from '@/app/context/CartContext';
import { Plus as MdAdd, ShoppingCart as MdAddShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    price: string | number | null;
    discountPrice?: string | number | null;
    images: string;
    minOrder?: number;
    stock?: number | null;
    pricingNeedsReview?: boolean;
    packaging?: string | null;
    itemsPerPackage?: string | null;
}

interface AddToCartButtonProps {
    product: Product;
    label: string;
    language: 'en' | 'ar';
    variant?: 'desktop' | 'mobile';
}

const AddToCartButton = ({ product, label, language, variant = 'desktop' }: AddToCartButtonProps) => {
    const { addItem } = useCart();

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.price == null || product.stock === 0 || product.pricingNeedsReview) return;

        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.discountPrice || product.price),
            image: product.images.split(',').map((img: string) => img.trim()).filter(Boolean)[0],
            slug: product.slug,
            quantity: product.minOrder || 1,
            minOrder: product.minOrder,
            stock: product.stock,
            packaging: product.packaging,
            itemsPerPackage: product.itemsPerPackage,
            description: product.description || undefined
        });
    };

    if (product.pricingNeedsReview) return <span className="absolute bottom-2 ltr:right-2 rtl:left-2 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-800">{language === 'ar' ? 'السعر قيد المراجعة' : 'Price under review'}</span>;
    if (variant === 'mobile') {
        if (product.price == null) return <Link href="/account/login" className="lg:hidden absolute bottom-2 ltr:right-2 rtl:left-2 rounded-full bg-white px-2 py-1 text-xs font-bold text-[var(--color-brand-hover)]">{language === 'ar' ? 'دخول' : 'Sign in'}</Link>;
        return (
            <button
                onClick={handleQuickAdd}
                className="lg:hidden absolute bottom-2 ltr:right-2 p-2 rtl:left-2 flex rounded-full bg-white/95 text-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] hover:text-white transition-colors border border-gray-200"
                aria-label={label}
            >
                <MdAdd className="text-[18px]" />
            </button>
        );
    }

    if (product.price == null) return <Link href="/account/login" className="hidden lg:flex absolute bottom-4 left-4 right-4 items-center justify-center rounded-lg bg-white/95 py-3 text-sm font-bold text-[var(--color-brand-hover)] opacity-0 group-hover:opacity-100">{language === 'ar' ? 'دخول التاجر' : 'Merchant sign in'}</Link>;

    return (
        <button
            onClick={handleQuickAdd}
            className="hidden lg:flex absolute bottom-4 left-4 right-4 items-center justify-center gap-2 rounded-lg bg-white/95 py-3 text-sm font-bold text-[var(--color-brand)] border border-gray-200/80 transition-all hover:bg-[var(--color-brand-hover)] hover:text-white hover:border-[var(--color-brand-hover)] opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-[var(--color-background-dark)] dark:text-white dark:hover:bg-[var(--color-brand-hover)]"
        >
            <MdAddShoppingCart className="text-[18px]" />
            <span>{label}</span>
        </button>
    );
};

export default AddToCartButton;

"use client";

import Link from "next/link";
import { Plus as MdAdd, Minus as MdRemove, ShoppingBag as MdShoppingBag } from 'lucide-react';
import ResilientImage from "@/app/components/ResilientImage";
import PriceText from "@/app/components/PriceText";
import WishlistButton from "@/app/components/WishlistButton";
import { useCart } from "@/app/context/CartContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { formatItemsPerPackage, formatPackageQuantity } from "@/lib/packaging";
import type { Product } from "./ProductCard";

export default function WholesaleProductRow({ product }: { product: Product }) {
    const { language } = useLanguage();
    const { items, addItem, removeItem, updateQuantity } = useCart();
    const ar = language === "ar";
    const name = (ar ? product.nameAr : product.nameEn) || product.name;
    const image = product.images.split(",")[0]?.trim() || "";
    const option = product.options?.split(",")[0]?.trim() || undefined;
    const minOrder = Math.max(1, product.minOrder || 1);
    const cartItem = items.find((item) => item.id === product.id && item.selectedOption === option);
    const quantity = cartItem?.quantity || 0;
    const canOrder = !product.pricingNeedsReview && product.price != null && (product.stock == null || product.stock >= minOrder);

    const add = () => {
        if (!canOrder) return;
        addItem({
            id: product.id, name, slug: product.slug, image,
            price: Number(product.discountPrice || product.price), quantity: minOrder,
            minOrder, stock: product.stock, packaging: product.packaging, itemsPerPackage: product.itemsPerPackage,
            selectedOption: option,
        });
    };

    return <article className="relative flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-colors hover:border-[var(--color-brand-hover)]/40 dark:border-white/10 dark:bg-zinc-900 sm:flex-row sm:items-center sm:gap-3 sm:p-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link href={`/products/${product.slug}`} className="relative block size-14 shrink-0 overflow-hidden rounded-xl bg-slate-50 dark:bg-white/5 sm:size-20" aria-label={name}>
                <ResilientImage src={image} alt={name} fill sizes="80px" className="object-contain" />
            </Link>
            <div className="min-w-0">
                <p className="text-[11px] font-bold text-[var(--color-accent)]">{product.brand?.name || "Zad Land"}</p>
                <Link href={`/products/${product.slug}`} className="mt-0.5 block line-clamp-2 text-[13px] font-bold leading-5 text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] dark:text-white sm:text-sm">{name}</Link>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-slate-500 dark:text-slate-400">
                    {product.itemsPerPackage && <span>{formatItemsPerPackage(product.itemsPerPackage, product.packaging, language)}</span>}
                    {minOrder > 1 && <span>{ar ? "أقل طلب" : "Min."} {formatPackageQuantity(minOrder, product.packaging, language)}</span>}
                    {product.stock != null && <span className={product.stock >= minOrder ? "font-medium text-emerald-700 dark:text-emerald-400" : "font-medium text-rose-600 dark:text-rose-400"}>{product.stock >= minOrder ? (ar ? "متوفر" : "In stock") : (ar ? "غير متوفر" : "Unavailable")}</span>}
                </div>
            </div>
        </div>
        <div className="flex min-h-11 items-center justify-between gap-3 border-t border-slate-100 pt-2 dark:border-white/10 sm:w-[285px] sm:justify-end sm:gap-3 sm:border-t-0 sm:pt-0">
            <div className="min-w-0 text-start sm:order-1 sm:text-end"><PriceText amount={product.discountPrice && Number(product.discountPrice) < Number(product.price) ? product.discountPrice : product.price} className="text-sm font-extrabold text-[var(--color-brand)] dark:text-white" /><p className="text-[10px] text-slate-500 sm:text-[11px]">{ar ? "لكل" : "Per"} {formatPackageQuantity(1, product.packaging, language).replace(/^1 /, "")}</p></div>
            {product.pricingNeedsReview ? <span className="rounded-full bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 sm:order-2">{ar ? "السعر قيد المراجعة" : "Price under review"}</span> : product.price == null ? <Link href="/account/login" className="rounded-full bg-[var(--color-brand-hover)] px-3 py-2 text-xs font-bold text-white sm:order-2">{ar ? "دخول التاجر" : "Sign in"}</Link> : !canOrder ? <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-500 sm:order-2">{ar ? "غير متوفر" : "Unavailable"}</span> : quantity ? <div className="flex h-9 items-center rounded-full bg-[var(--color-brand-hover)] text-white sm:order-2"><button type="button" onClick={() => quantity <= minOrder ? removeItem(product.id, option) : updateQuantity(product.id, quantity - 1, option)} aria-label={ar ? "تقليل الكمية" : "Decrease quantity"} className="px-2"><MdRemove /></button><span className="min-w-7 text-center text-xs font-bold">{quantity}</span><button type="button" disabled={product.stock != null && quantity >= product.stock} onClick={() => updateQuantity(product.id, quantity + 1, option)} aria-label={ar ? "زيادة الكمية" : "Increase quantity"} className="px-2 disabled:opacity-40"><MdAdd /></button></div> : <button type="button" onClick={add} className="inline-flex h-9 items-center gap-1 rounded-full bg-[var(--color-brand-hover)] px-3 text-xs font-bold text-white transition-colors hover:brightness-95 sm:order-2"><MdShoppingBag aria-hidden="true" />{ar ? "إضافة" : "Add"}</button>}
            <WishlistButton productId={product.id} className="absolute left-3 top-3 size-9 rounded-full border border-slate-200 bg-white text-lg text-[var(--color-brand-hover)] shadow-sm transition-colors hover:border-[var(--color-brand-hover)] dark:border-white/15 dark:bg-zinc-900 sm:static sm:order-3" />
        </div>
    </article>;
}

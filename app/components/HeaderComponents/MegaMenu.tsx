'use client';

import Link from 'next/link';
import { ArrowRight as MdArrowForward, ArrowLeft as MdArrowBack } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import PriceText from '@/app/components/PriceText';
import ResilientImage from '@/app/components/ResilientImage';

interface Brand {
    id: string;
    name: string;
    slug: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface TopProduct {
    id: string;
    name: string;
    slug: string;
}

interface TrendingProduct {
    id: string;
    name: string;
    nameAr?: string | null;
    nameEn?: string | null;
    slug: string;
    images: string;
    price: number | null;
    discountPrice: number | null;
    minOrder: number;
    stock: number | null;
    packaging: string | null;
    itemsPerPackage: string | null;
    brand?: { name: string } | null;
}

export interface NavMainCategory {
    id: string;
    name: string;
    nameEn?: string;
    slug: string;
    image?: string | null;
    brands: Brand[];
    categories: Category[];
    topProducts: TopProduct[];
    trendingProducts: TrendingProduct[];
}

interface MegaMenuProps {
    data: NavMainCategory;
    onClose: () => void;
    onMouseLeave?: () => void;
}

const imageFromJson = (images: string) => {
    try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? String(parsed[0] || '') : String(parsed || '');
    } catch {
        return images.split(',')[0]?.trim() || '';
    }
};

const localizedBrandName = (name: string, isArabic: boolean) => {
    const parts = name.split('-').map((part) => part.trim());
    return parts.find((part) => isArabic ? /[\u0600-\u06FF]/.test(part) : !/[\u0600-\u06FF]/.test(part)) || name;
};

export default function MegaMenu({ data, onClose, onMouseLeave }: MegaMenuProps) {
    const { language } = useLanguage();
    const isArabic = language === 'ar';
    const title = isArabic ? data.name : data.nameEn || data.name;
    const Arrow = isArabic ? MdArrowBack : MdArrowForward;
    const products = data.trendingProducts.slice(0, 3);

    return (
        <div
            id="desktop-category-panel"
            className="absolute inset-x-0 top-full z-40 border-t border-[var(--color-line)] bg-white shadow-[0_22px_35px_rgba(15,40,29,0.14)] dark:border-white/10 dark:bg-[var(--color-background-dark)]"
            onMouseLeave={onMouseLeave}
        >
            <div className="container-custom grid max-h-[min(66vh,500px)] grid-cols-12 gap-6 overflow-y-auto py-6 xl:gap-8">
                <div className="col-span-3 flex min-h-[280px] flex-col justify-between bg-[var(--color-brand)] p-6 text-white">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-accent-light)]">
                            {isArabic ? 'تصفح القسم' : 'Explore department'}
                        </span>
                        <h2 className="mt-4 text-2xl font-bold leading-tight xl:text-[28px]">{title}</h2>
                        <p className="mt-3 text-[13px] text-white/75">
                            {isArabic
                                ? `${data.categories.length} فئات · ${data.brands.length} علامات`
                                : `${data.categories.length} categories · ${data.brands.length} brands`}
                        </p>
                    </div>
                    <Link
                        href={`/department/${data.slug}`}
                        onClick={onClose}
                        className="inline-flex w-fit items-center gap-2 border-b border-[var(--color-accent-light)] pb-1 text-[13px] font-bold text-[var(--color-accent-light)] transition-colors hover:text-white"
                    >
                        {isArabic ? 'عرض جميع المنتجات' : 'View all products'}
                        <Arrow aria-hidden="true" className="text-lg" />
                    </Link>
                </div>

                <div className="col-span-3 min-w-0">
                    <h3 className="mb-3 border-b border-[var(--color-line)] pb-3 text-[12px] font-bold text-[#66786b] dark:border-white/10 dark:text-gray-400">
                        {isArabic ? 'الفئات' : 'Categories'}
                    </h3>
                    <ul className="space-y-0.5">
                        {data.categories.slice(0, 8).map((category) => (
                            <li key={category.id}>
                                <Link
                                    href={`/products?department=${encodeURIComponent(data.slug)}&categoryIds=${encodeURIComponent(category.id)}`}
                                    onClick={onClose}
                                    className="block rounded-[6px] px-2 py-2 text-[13px] font-medium leading-snug text-[var(--color-ink)] transition-colors hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand-hover)] dark:text-white dark:hover:bg-white/10"
                                >
                                    {category.name}
                                </Link>
                            </li>
                        ))}
                        {data.categories.length === 0 && (
                            <li className="text-[13px] text-[#7a877c]">{isArabic ? 'لا توجد فئات' : 'No categories yet'}</li>
                        )}
                    </ul>
                </div>

                <div className="col-span-2 min-w-0">
                    <h3 className="mb-3 border-b border-[var(--color-line)] pb-3 text-[12px] font-bold text-[#66786b] dark:border-white/10 dark:text-gray-400">
                        {isArabic ? 'شركاؤنا' : 'Our partners'}
                    </h3>
                    <ul className="space-y-0.5">
                        {data.brands.slice(0, 8).map((brand) => (
                            <li key={brand.id}>
                                <Link
                                    href={`/brands/${brand.slug}`}
                                    onClick={onClose}
                                    className="block rounded-[6px] px-2 py-2 text-[13px] font-medium leading-snug text-[var(--color-ink)] transition-colors hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand-hover)] dark:text-white dark:hover:bg-white/10"
                                >
                                    {localizedBrandName(brand.name, isArabic)}
                                </Link>
                            </li>
                        ))}
                        {data.brands.length === 0 && (
                            <li className="text-[13px] text-[#7a877c]">{isArabic ? 'لا توجد علامات' : 'No brands yet'}</li>
                        )}
                    </ul>
                </div>

                <div className="col-span-4 min-w-0">
                    <h3 className="mb-3 border-b border-[var(--color-line)] pb-3 text-[12px] font-bold text-[#66786b] dark:border-white/10 dark:text-gray-400">
                        {isArabic ? 'منتجات مختارة' : 'Featured products'}
                    </h3>
                    {products.length > 0 ? (
                        <div className="space-y-1">
                            {products.map((product) => {
                                const name = (isArabic ? product.nameAr : product.nameEn) || product.name;
                                return (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.slug}`}
                                        onClick={onClose}
                                        className="flex items-center gap-3 rounded-[7px] p-2 transition-colors hover:bg-[var(--color-brand-soft)] dark:hover:bg-white/10"
                                    >
                                        <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-[5px] bg-[#f4f4ef] dark:bg-white/10">
                                            <ResilientImage src={imageFromJson(product.images)} alt="" className="h-full w-full object-contain" loading="lazy" />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="line-clamp-2 text-[12px] font-semibold leading-snug text-[var(--color-ink)] dark:text-white">{name}</span>
                                            {product.price != null && (
                                                <span className="mt-1 block text-[12px] font-bold text-[var(--color-accent)]">
                                                    <PriceText amount={product.discountPrice || product.price} />
                                                </span>
                                            )}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <ul className="space-y-1">
                            {data.topProducts.slice(0, 5).map((product) => (
                                <li key={product.id}>
                                    <Link href={`/products/${product.slug}`} onClick={onClose} className="block rounded-[6px] px-2 py-2 text-[13px] text-[var(--color-ink)] hover:bg-[var(--color-brand-soft)] dark:text-white dark:hover:bg-white/10">
                                        {product.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

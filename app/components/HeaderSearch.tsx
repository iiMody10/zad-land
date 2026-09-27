"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import PriceText from '@/app/components/PriceText';
import ResilientImage from './ResilientImage';
import { getPrimaryImage } from '@/lib/image-utils';
import { ArrowRight as MdArrowForward, X as MdClose, Search as MdSearch } from 'lucide-react';

interface HeaderSearchProps {
    onSearchSelect?: () => void;
    onClose?: () => void;
    placeholder?: string;
    autoFocus?: boolean;
    locale?: 'en' | 'ar';
    mobileModal?: boolean;
}

interface SearchProduct {
    id: string;
    slug: string;
    name: string;
    images: string;
    price?: string | number | null;
    discountPrice?: string | number | null;
    brand?: { name: string } | null;
}

interface SearchCategory {
    id: string;
    name: string;
    slug: string;
}

const foodSuggestionsAr = ['معكرونة دي سيكو', 'صوصات أميركان غاردن', 'تونة ريو ماري', 'حليب وبدائل ألبان', 'مفرزات كابتن فيشر', 'قهوة علي كافيه'];
const foodSuggestionsEn = ['De Cecco Pasta', 'American Garden Sauces', 'Rio Mare Tuna', 'Nada Dairy Milk', 'Captain Fisher Frozen', 'Ali Cafe Coffee'];

const quickCategoriesAr = [
    { id: '1', name: 'باستا ومواد غذائية', slug: 'pasta-and-foodstuffs' },
    { id: '2', name: 'صوصات وتتبيلات', slug: 'sauces-condiments' },
    { id: '3', name: 'مفرزات ولحوم', slug: 'frozen-foods' },
    { id: '4', name: 'معلبات وتونة', slug: 'canned-goods' }
];

const quickCategoriesEn = [
    { id: '1', name: 'Pasta & Foodstuffs', slug: 'pasta-and-foodstuffs' },
    { id: '2', name: 'Sauces & Condiments', slug: 'sauces-condiments' },
    { id: '3', name: 'Frozen Foods & Seafood', slug: 'frozen-foods' },
    { id: '4', name: 'Canned Goods & Tuna', slug: 'canned-goods' }
];

const dynamicItemsAr = [
    "معكرونة دي سيكو إيطالية...",
    "صوصات وتوابل أميركان غاردن...",
    "تونة ريو ماري وزيوت طعام...",
    "مفرزات ومأكولات بحرية فاخرة...",
    "أرز وحبوب وبقوليات بالجملة...",
    "قهوة وشاي ومشروبات..."
];

const dynamicItemsEn = [
    "De Cecco Italian Pasta...",
    "American Garden Sauces & Dressings...",
    "Rio Mare Tuna & Olive Oils...",
    "Frozen Seafood & Gourmet Items...",
    "Wholesale Rice, Grains & Foodstuffs...",
    "Coffee, Tea & Beverages..."
];

const HeaderSearch = ({ onSearchSelect, onClose, placeholder, autoFocus = false, locale, mobileModal = false }: HeaderSearchProps) => {
    const inputId = React.useId();
    const { dir, language } = useLanguage();
    const currentLocale = locale ?? language;
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchProduct[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [categories, setCategories] = useState<SearchCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [dynamicText, setDynamicText] = useState("");
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const isArabic = currentLocale === 'ar';
    const staticPrefix = isArabic ? "ابحث عن: " : "Search: ";
    const searchPlaceholder = placeholder || `${staticPrefix}${dynamicText}`;

    // Typewriter animation only for dynamic suffix text (prefix stays static)
    useEffect(() => {
        if (query) return;
        const items = isArabic ? dynamicItemsAr : dynamicItemsEn;
        let itemIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let timeoutId: NodeJS.Timeout;

        const tick = () => {
            const currentItem = items[itemIndex];
            
            if (isDeleting) {
                setDynamicText(currentItem.substring(0, charIndex - 1));
                charIndex--;
            } else {
                setDynamicText(currentItem.substring(0, charIndex + 1));
                charIndex++;
            }

            let delta = isDeleting ? 45 : 90;

            if (!isDeleting && charIndex === currentItem.length) {
                delta = 2500; // Pause when item is fully typed
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                itemIndex = (itemIndex + 1) % items.length;
                delta = 450; // Pause before typing next item
            }

            timeoutId = setTimeout(tick, delta);
        };

        // Delay starting typewriter until initial rendering and CPU are idle
        timeoutId = setTimeout(tick, 2500);

        return () => clearTimeout(timeoutId);
    }, [isArabic, query]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.trim().length > 0) {
                setLoading(true);
                try {
                    const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=3&lang=${currentLocale}`);
                    if (res.ok) {
                        const data = await res.json();
                        setResults(data.products || []);
                        setTotalCount(data.total || data.products?.length || 0);
                        setShowResults(true);

                        setSuggestions(isArabic ? foodSuggestionsAr.slice(0, 4) : foodSuggestionsEn.slice(0, 4));
                        setCategories(isArabic ? quickCategoriesAr : quickCategoriesEn);
                    }
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setSuggestions([]);
                setCategories([]);
                setShowResults(false);
                setTotalCount(0);
            }
        }, 250);
        return () => clearTimeout(timeoutId);
    }, [query, currentLocale, isArabic]);

    const handleProductClick = () => {
        setShowResults(false);
        setQuery("");
        if (onSearchSelect) onSearchSelect();
        if (onClose) onClose();
    };

    const handleReset = () => {
        setQuery("");
        setResults([]);
        setSuggestions([]);
        setCategories([]);
        setShowResults(false);
        setTotalCount(0);
        inputRef.current?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            window.location.href = `/products?search=${encodeURIComponent(query.trim())}`;
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
    };

    const handleViewAll = () => {
        if (query.trim()) {
            window.location.href = `/products?search=${encodeURIComponent(query.trim())}`;
        }
    };

    return (
        <div className={`header-search-wrapper relative w-full ${mobileModal ? 'flex min-h-0 flex-1 flex-col' : ''}`} ref={searchRef}>
            {/* Search Form */}
            <form
                action="/products"
                method="get"
                role="search"
                onSubmit={handleSubmit}
                className={`w-full ${mobileModal ? 'shrink-0' : ''}`}
            >
                <input type="hidden" name="options[prefix]" value="last" />
                <div className="search__field relative flex items-center w-full">
                    {/* Search Input */}
                    <input
                        ref={inputRef}
                        id={inputId}
                        autoFocus={autoFocus}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => {
                            if (query.trim().length > 0) setShowResults(true);
                        }}
                        className="h-11 w-full rounded-[9px] border border-[var(--color-line)] bg-[var(--color-brand-soft)] text-[14px] font-medium text-[#1a1a1a] placeholder-[#78867c] transition-colors focus:border-[var(--color-brand-hover)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-hover)]/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-400 dark:focus:bg-white/10 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden"
                        style={{
                            padding: isArabic ? '0 16px 0 80px' : '0 80px 0 16px',
                            direction: dir,
                        }}
                        placeholder={searchPlaceholder}
                        type="search"
                        name="q"
                        role="combobox"
                        aria-controls={`${inputId}-results`}
                        aria-expanded={showResults ? "true" : "false"}
                        autoComplete="off"
                        spellCheck="false"
                    />

                    {/* Keep a single trailing action visible: clear the query or show search. */}
                    {query ? (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="absolute flex min-h-9 min-w-9 items-center justify-center rounded-full text-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-[var(--color-brand)] dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                            style={{ [isArabic ? 'left' : 'right']: '12px' }}
                            aria-label={isArabic ? 'مسح البحث' : 'Clear search'}
                        >
                            <MdClose aria-hidden="true" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="absolute flex min-h-9 min-w-9 items-center justify-center text-[22px] text-[#555] transition-colors hover:text-[var(--color-accent)] dark:text-gray-300 dark:hover:text-[var(--color-accent-light)]"
                            style={{ [isArabic ? 'left' : 'right']: '12px' }}
                            aria-label={isArabic ? 'بحث' : 'Search'}
                        >
                            <MdSearch aria-hidden="true" />
                        </button>
                    )}
                </div>
            </form>

            {/* ========== Predictive Search Results Dropdown ========== */}
            {showResults && (
                <div
                    id={`${inputId}-results`}
                    className={`z-50 overflow-y-auto border border-gray-100 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900 ${mobileModal ? 'relative mt-3 min-h-0 flex-1 rounded-2xl overscroll-contain' : 'absolute top-full mt-1 max-h-[70vh] rounded-2xl md:max-h-[unset] md:overflow-visible'}`}
                    style={{
                        width: '100%',
                        direction: dir,
                        ...(mobileModal ? { maxHeight: 'none' } : {}),
                    }}
                >
                    {loading && results.length === 0 ? (
                        <div className="p-8 text-center">
                            <svg aria-hidden="true" className="animate-spin h-6 w-6 mx-auto text-zinc-900 dark:text-white" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                                <circle className="opacity-25" fill="none" strokeWidth="5" cx="33" cy="33" r="30" stroke="currentColor" />
                                <circle fill="none" strokeWidth="5" cx="33" cy="33" r="30" stroke="currentColor" strokeDasharray="50, 138" strokeLinecap="round" />
                            </svg>
                        </div>
                    ) : (
                        <div className={`flex flex-col md:flex-row ${mobileModal ? 'gap-0 p-0 md:flex-col' : 'gap-6 p-6 md:gap-0'}`}>
                            
                            {/* Suggestions & Categories Section */}
                            <div className={mobileModal ? 'hidden' : 'mb-6 w-full shrink-0 border-b border-gray-100 pb-6 dark:border-white/5 md:mb-0 md:w-[260px] md:border-b-0 md:border-e md:pb-0 md:pe-6'}>
                                
                                {/* Suggestions */}
                                {suggestions.length > 0 && (
                                    <div className="mb-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-[11px] font-bold text-[#888] dark:text-gray-400 uppercase tracking-wide">
                                                {isArabic ? "مرشحات مجربة" : "Suggestions"}
                                            </span>
                                            <div className="h-px bg-gray-100 dark:bg-white/5 flex-1"></div>
                                        </div>
                                        <ul className="space-y-2.5">
                                            {suggestions.map((suggestion, i) => (
                                                <li
                                                    key={i}
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                    className="text-[13px] text-[#444] dark:text-gray-300 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
                                                    style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}
                                                    role="button"
                                                    tabIndex={0}
                                                >
                                                    {suggestion}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Categories */}
                                {categories.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-[11px] font-bold text-[#888] dark:text-gray-400 uppercase tracking-wide">
                                                {isArabic ? "اهتمامات" : "Categories"}
                                            </span>
                                            <div className="h-px bg-gray-100 dark:bg-white/5 flex-1"></div>
                                        </div>
                                        <ul className="space-y-2.5 mb-3">
                                            {categories.map((cat) => (
                                                <li key={cat.id}>
                                                    <Link
                                                        href={`/brands/${cat.slug}`}
                                                        onClick={handleProductClick}
                                                        className="text-[13px] text-[#444] dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors block"
                                                        style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        <button
                                            onClick={handleViewAll}
                                            className="flex items-center justify-end md:justify-start gap-2 text-[13px] font-bold text-[#444] dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors mt-2 w-full"
                                        >
                                            <span>{isArabic ? "عرض المزيد" : "View More"}</span>
                                            <MdArrowForward className={`text-base ${isArabic ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Products Section */}
                            <div className={`min-w-0 flex-1 ${mobileModal ? 'p-4 md:p-4' : 'md:ps-6'}`}>
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <span className="text-xs font-bold text-[var(--color-brand)] dark:text-gray-200">
                                        {isArabic ? "المنتجات" : "Products"}
                                    </span>
                                    <span className="text-[11px] text-slate-500 dark:text-gray-400">
                                        {totalCount > 0 ? (isArabic ? `${totalCount} نتيجة` : `${totalCount} results`) : ''}
                                    </span>
                                </div>

                                {results.length > 0 ? <div className={mobileModal ? 'divide-y divide-slate-100 dark:divide-white/10' : 'grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3'}>
                                    {results.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.slug}`}
                                            onClick={handleProductClick}
                                            className={mobileModal ? 'group flex items-center gap-3 py-3 text-start first:pt-0 last:pb-0' : 'group flex flex-col items-center text-center'}
                                        >
                                            <div className={mobileModal ? 'size-[72px] shrink-0 rounded-xl bg-slate-50 p-1 dark:bg-white/5' : 'relative mb-4 flex h-24 w-24 items-center justify-center'}>
                                                <ResilientImage
                                                    src={getPrimaryImage(product.images)}
                                                    alt={product.name}
                                                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className={mobileModal ? 'min-w-0 flex-1' : 'flex flex-col items-center'}>
                                                <span className="mb-1 block line-clamp-1 text-[11px] font-medium text-slate-500 dark:text-gray-400">
                                                    {product.brand?.name || 'ZAD LAND'}
                                                </span>
                                                <h4 dir="auto" className={`line-clamp-2 font-medium text-[#25332d] transition-colors group-hover:text-[var(--color-brand-hover)] dark:text-gray-100 ${mobileModal ? 'text-[13px] leading-5' : 'mb-1.5 px-2 font-sans text-[13px] leading-tight tracking-normal'}`}>
                                                    {product.name}
                                                </h4>
                                                <div className={`mt-1 text-[13px] font-extrabold text-[var(--color-brand)] dark:text-white ${mobileModal ? 'text-start' : ''}`} dir="ltr">
                                                    <PriceText amount={product.discountPrice ?? product.price} />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div> : <p className="py-8 text-center text-sm text-slate-500 dark:text-gray-400">{isArabic ? 'لا توجد منتجات مطابقة لبحثك.' : 'No matching products found.'}</p>}

                                {totalCount > 0 && (
                                    <div className={`flex justify-center ${mobileModal ? 'border-t border-slate-100 py-4 dark:border-white/10' : 'mt-8'}`}>
                                        <button
                                            onClick={handleViewAll}
                                            className="flex min-h-10 items-center gap-2 text-sm font-bold text-[var(--color-brand)] transition-colors hover:text-[var(--color-brand-hover)] dark:text-gray-300 dark:hover:text-white"
                                        >
                                            <span>
                                                {isArabic
                                                    ? `عرض كل ${totalCount} العناصر`
                                                    : `View all ${totalCount} items`}
                                            </span>
                                            <MdArrowForward className={`text-lg ${isArabic ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HeaderSearch;

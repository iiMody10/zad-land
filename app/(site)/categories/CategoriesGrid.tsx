"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown as MdExpandMore } from 'lucide-react';
import { useLanguage } from "@/app/context/LanguageContext";
import ResilientImage from "@/app/components/ResilientImage";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
}

interface CategoriesGridProps {
    categories: Category[];
}

const CategoriesGrid = ({ categories }: CategoriesGridProps) => {
    const { t } = useLanguage();
    const [displayLimit, setDisplayLimit] = useState(6);
    const visibleCategories = categories.slice(0, displayLimit);
    const hasMore = categories.length > displayLimit;

    const handleLoadMore = () => {
        setDisplayLimit(prev => prev + 6);
    };

    return (
        <section className="container-custom">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {visibleCategories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="group flex flex-col gap-5 p-2 rounded-2xl bg-surface-light dark:bg-surface-dark border border-[var(--color-accent)]/15 hover:border-[var(--color-accent)] transition-all animate-in fade-in zoom-in-95 duration-500"
                    >
                        <div className="relative aspect-16/10 overflow-hidden rounded-xl bg-background-light dark:bg-background-dark">
                            <ResilientImage
                                src={category.image}
                                alt={category.name}
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                        </div>
                        <div className="px-4 pb-4">
                            <h3 className="text-2xl font-bold text-text-main-light dark:text-text-main-dark transition-colors group-hover:text-[var(--color-accent)]">
                                <span className="group-hover-underline-animated">{category.name}</span>
                            </h3>
                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1 font-medium">{category.description || t('categoriesPage.premiumCollection')}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {hasMore && (
                <div className="mt-16 flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        className="group relative px-10 py-4 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-full font-bold text-sm text-text-main-light dark:text-white hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-300 flex items-center gap-2 active:scale-95"
                    >
                        {t('categoriesPage.loadMoreCategories')}
                        <MdExpandMore className="text-[18px] group-hover:translate-y-1 transition-transform text-[var(--color-accent)]" />
                    </button>
                </div>
            )}
        </section>
    );
};

export default CategoriesGrid;


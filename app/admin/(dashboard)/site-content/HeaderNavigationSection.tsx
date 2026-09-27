"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { HeaderNavItemRef } from "@/lib/header-navigation";
import { useLanguage } from "@/app/context/LanguageContext";

interface NavigationOption {
    id: string;
    name: string;
    nameEn?: string;
}

interface HeaderNavigationSectionProps {
    items: HeaderNavItemRef[];
    mainCategories: NavigationOption[];
    onChange: (items: HeaderNavItemRef[]) => void;
}

export default function HeaderNavigationSection({ items, mainCategories, onChange }: HeaderNavigationSectionProps) {
    const { language } = useLanguage();
    const isArabic = language === "ar";
    const [pendingValue, setPendingValue] = useState("");

    const addItem = () => {
        const id = pendingValue;
        if (!id || items.length >= 12 || items.some((item) => item.id === id)) return;
        onChange([...items, { type: "mainCategory", id }]);
        setPendingValue("");
    };

    const moveItem = (index: number, offset: -1 | 1) => {
        const nextIndex = index + offset;
        if (nextIndex < 0 || nextIndex >= items.length) return;
        const next = [...items];
        [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
        onChange(next);
    };

    const label = (item: HeaderNavItemRef) => {
        const option = mainCategories.find((candidate) => candidate.id === item.id);
        return (isArabic ? option?.name : option?.nameEn || option?.name) || item.id;
    };

    return (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[var(--color-surface-dark)] md:p-8">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {isArabic ? "روابط الشريط السفلي" : "Bottom navigation links"}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {isArabic
                        ? "اختر الأقسام الرئيسية التي تظهر في الشريط أسفل الترويسة ورتبها كما تريد. تعرض كل قائمة العلامات والفئات والمنتجات من هذا القسم."
                        : "Choose and order the main categories shown in the lower header bar. Each menu shows its brands, categories, and featured products."}
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <select
                    value={pendingValue}
                    onChange={(event) => setPendingValue(event.target.value)}
                    className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-[var(--color-brand)] dark:border-white/10 dark:bg-gray-800 dark:text-white"
                >
                    <option value="">{isArabic ? "اختر قسماً رئيسياً" : "Select a main category"}</option>
                    {mainCategories.length > 0 && (
                        <optgroup label={isArabic ? "الأقسام الرئيسية" : "Main categories"}>
                            {mainCategories.map((option) => (
                                <option key={`main-category-${option.id}`} value={option.id}>{isArabic ? option.name : option.nameEn || option.name}</option>
                            ))}
                        </optgroup>
                    )}
                </select>
                <button
                    type="button"
                    onClick={addItem}
                    disabled={!pendingValue || items.length >= 12}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 text-sm font-bold text-white transition hover:bg-[var(--color-brand-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus size={17} aria-hidden="true" />
                    {isArabic ? "إضافة رابط" : "Add link"}
                </button>
            </div>

            <ol className="mt-5 space-y-2">
                {items.map((item, index) => (
                    <li key={`${item.type}-${item.id}`} className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2.5 dark:border-white/10 dark:bg-gray-800/60">
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {label(item)}
                            <span className="ms-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                {isArabic ? "قسم رئيسي" : "Main category"}
                            </span>
                        </span>
                        <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0} aria-label={isArabic ? "تحريك لأعلى" : "Move up"} className="rounded-lg p-2 text-slate-600 hover:bg-white disabled:opacity-30 dark:text-slate-300 dark:hover:bg-white/10">
                            <ArrowUp size={16} aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} aria-label={isArabic ? "تحريك لأسفل" : "Move down"} className="rounded-lg p-2 text-slate-600 hover:bg-white disabled:opacity-30 dark:text-slate-300 dark:hover:bg-white/10">
                            <ArrowDown size={16} aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} aria-label={isArabic ? "حذف الرابط" : "Remove link"} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30">
                            <Trash2 size={16} aria-hidden="true" />
                        </button>
                    </li>
                ))}
                {items.length === 0 && (
                    <li className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-white/15 dark:text-slate-400">
                        {isArabic ? "لم تتم إضافة روابط بعد." : "No links added yet."}
                    </li>
                )}
            </ol>
        </section>
    );
}

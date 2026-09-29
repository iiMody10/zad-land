"use client";

import { useState, useEffect } from "react";
import { X as MdClose, RefreshCw as MdSync, Star as MdStar } from 'lucide-react';
import { createCategory, updateCategory } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/context/LanguageContext";
import ImageUploadField from "../../components/ImageUploadField";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category?: {
        id: string;
        name: string;
        description: string | null;
        image: string | null;
        brandId?: string;
        mainCategoryId?: string | null;
        isFeatured?: boolean;
        showInNav?: boolean;
        navOrder?: number;
    } | null;
    brands: {
        id: string;
        name: string;
        mainCategoryId?: string | null;
    }[];
    mainCategories: { id: string; name: string; description?: string | null }[];
}

export default function CategoryModal({ isOpen, onClose, category, brands, mainCategories }: CategoryModalProps) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [brandId, setBrandId] = useState("");
    const [mainCategoryId, setMainCategoryId] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const [showInNav, setShowInNav] = useState(true);
    const [navOrder, setNavOrder] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (category) {
            setName(category.name);
            setDescription(category.description || "");
            setImage(category.image || "");
            setBrandId(category.brandId || brands[0]?.id || "");
            setMainCategoryId(category.mainCategoryId || brands.find((brand) => brand.id === category.brandId)?.mainCategoryId || "");
            setIsFeatured(category.isFeatured ?? false);
            setShowInNav(category.showInNav ?? true);
            setNavOrder(category.navOrder ?? 0);
        } else {
            setName("");
            setDescription("");
            setImage("");
            setBrandId(brands[0]?.id || "");
            setMainCategoryId(brands[0]?.mainCategoryId || "");
            setIsFeatured(false);
            setShowInNav(true);
            setNavOrder(0);
        }
    }, [category, isOpen, brands]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = { name, description, image, isFeatured, showInNav, navOrder, brandId, mainCategoryId: mainCategoryId || null };
            let result;

            if (category) {
                result = await updateCategory(category.id, data);
            } else {
                result = await createCategory(data);
            }

            if (result.success) {
                toast.success(
                    category 
                        ? (isArabic ? 'تم تحديث الفئة بنجاح' : 'Category updated successfully') 
                        : (isArabic ? 'تم إنشاء الفئة بنجاح' : 'Category created successfully')
                );
                onClose();
            } else {
                toast.error(result.error || `Failed to save category`);
            }
        } catch (error) {
            console.error("Error submitting category:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10">
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-[var(--color-brand)] dark:text-white">
                            {category 
                                ? (isArabic ? 'تعديل فئة المنتجات' : 'Edit Subcategory') 
                                : (isArabic ? 'إضافة فئة منتجات جديدة' : 'Add New Subcategory')}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                            {isArabic 
                                ? 'الفئات الفرعية التابعة للماركة (مثل التونة، الباستا، الزيوت)' 
                                : 'Brand product lines & subcategories'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                        <MdClose className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[80vh]">
                    {/* Category Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300">
                            {isArabic ? 'اسم الفئة (بالعربية)' : 'Category Name (Arabic)'}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={isArabic ? 'مثال: سلطعون وقشريات مجمدة' : 'e.g. Pasta, Sauces, Dairy'}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-800 text-[var(--color-brand)] dark:text-white focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all outline-none text-sm"
                        />
                    </div>

                    {/* Brand Selection */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300">
                            {isArabic ? 'العلامة التجارية التابعة لها (Brand)' : 'Parent Brand'}
                        </label>
                        <select
                            value={brandId}
                            onChange={(e) => {
                                setBrandId(e.target.value);
                                const brandMainCategoryId = brands.find((brand) => brand.id === e.target.value)?.mainCategoryId;
                                setMainCategoryId(brandMainCategoryId || "");
                            }}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-800 text-[var(--color-brand)] dark:text-white focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all outline-none text-sm cursor-pointer"
                        >
                            <option value="">{isArabic ? 'اختر العلامة التجارية...' : 'Select a Brand...'}</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300">
                            {isArabic ? 'القسم الرئيسي' : 'Main category'}
                        </label>
                        <select
                            value={mainCategoryId}
                            onChange={(e) => setMainCategoryId(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-800 text-[var(--color-brand)] dark:text-white outline-none text-sm cursor-pointer"
                        >
                            <option value="">{isArabic ? 'بدون قسم رئيسي' : 'No main category'}</option>
                            {mainCategories.map((item) => (
                                <option key={item.id} value={item.id}>{isArabic ? item.name : item.description || item.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_150px]">
                        <label className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${showInNav ? 'border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-800/50'}`}>
                            <input type="checkbox" checked={showInNav} onChange={(e) => setShowInNav(e.target.checked)} className="size-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                            <span className="text-xs font-bold text-[var(--color-brand)] dark:text-white">{isArabic ? 'إظهار في قائمة القسم' : 'Show in department menu'}</span>
                        </label>
                        <label className="flex flex-col gap-1 text-[11px] font-bold text-slate-600 dark:text-gray-300">
                            {isArabic ? 'ترتيب الظهور' : 'Display order'}
                            <input type="number" min={0} value={navOrder} onChange={(e) => setNavOrder(Math.max(0, Number(e.target.value) || 0))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-brand)] dark:border-white/10 dark:bg-zinc-800 dark:text-white" />
                        </label>
                    </div>
                    <p className="-mt-3 text-[11px] leading-relaxed text-slate-500 dark:text-gray-400">
                        {isArabic
                            ? 'تظهر الفئات المفعّلة فقط في قائمة القسم الرئيسي، بحد أقصى 8 فئات مختلفة. استخدم ترتيب الظهور لتحديد أولويتها.'
                            : 'Only enabled subcategories appear in the department menu, up to 8 unique names. Use display order to set their priority.'}
                    </p>

                    {/* Image Upload */}
                    <ImageUploadField
                        label={isArabic ? 'صورة الفئة (Category Image)' : 'Category Image'}
                        folder="categories"
                        value={image}
                        onChange={(url) => setImage(url)}
                        placeholder="https://example.com/category.jpg"
                    />

                    {/* Featured Toggle */}
                    <label className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                        isFeatured 
                            ? "border-amber-500/50 bg-amber-50/60 dark:bg-amber-950/20" 
                            : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-800/50"
                    }`}>
                        <input
                            type="checkbox"
                            checked={isFeatured}
                            onChange={(e) => setIsFeatured(e.target.checked)}
                            className="size-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-[var(--color-brand)] dark:text-white flex items-center gap-1">
                                <MdStar className="text-amber-500 text-sm" />
                                <span>{isArabic ? 'فئة مميزة في الصفحة الرئيسية' : 'Featured on Homepage'}</span>
                            </span>
                            <span className="text-[10px] text-amber-600/90 dark:text-amber-400">
                                {isArabic ? 'تظهر في قسم الفئات المميزة وشريط الماركة' : 'Highlighted on the home featured categories grid'}
                            </span>
                        </div>
                    </label>

                    {/* English Title / Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300">
                            {isArabic ? 'الاسم بالإنجليزية / الوصف (English Name)' : 'English Name / Description'}
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Crab Sticks & Frozen Seafood"
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-800 text-[var(--color-brand)] dark:text-white focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all outline-none resize-none text-sm"
                        />
                    </div>

                    {/* Modal Buttons */}
                    <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-sm cursor-pointer"
                        >
                            {isArabic ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] dark:bg-[var(--color-accent)] dark:hover:bg-[var(--color-accent-hover)] text-white font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 text-sm cursor-pointer"
                        >
                            {isSubmitting && <MdSync className="animate-spin text-base" />}
                            <span>
                                {category 
                                    ? (isArabic ? 'حفظ التعديلات' : 'Save Changes') 
                                    : (isArabic ? 'إضافة الفئة' : 'Create Subcategory')}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

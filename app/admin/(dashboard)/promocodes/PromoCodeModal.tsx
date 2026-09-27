"use client";

import { useState, useEffect } from "react";
import { createPromoCode, updatePromoCode } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/context/LanguageContext";
import { X as MdClose } from 'lucide-react';

interface PromoCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    promoCode?: {
        id: string;
        code: string;
        discountPercentage: number;
        delegateName?: string | null;
        isActive?: boolean;
    } | null;
}

export default function PromoCodeModal({ isOpen, onClose, promoCode }: PromoCodeModalProps) {
    const { t, dir } = useLanguage();
    const [code, setCode] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState<number | string>("");
    const [delegateName, setDelegateName] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (promoCode) {
            setCode(promoCode.code);
            setDiscountPercentage(promoCode.discountPercentage);
            setDelegateName(promoCode.delegateName || "");
            setIsActive(promoCode.isActive ?? true);
        } else {
            setCode("");
            setDiscountPercentage("");
            setDelegateName("");
            setIsActive(true);
        }
    }, [promoCode, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = {
                code,
                discountPercentage: Number(discountPercentage),
                delegateName: delegateName || undefined,
                isActive
            };
            let result;

            if (promoCode) {
                result = await updatePromoCode(promoCode.id, data);
            } else {
                result = await createPromoCode(data);
            }

            if (result.success) {
                toast.success(promoCode ? t('admin.codeUpdated') : t('admin.codeCreated'));
                onClose();
            } else {
                toast.error(result.error || `Failed to ${promoCode ? "update" : "create"} promo code`);
            }
        } catch (error) {
            console.error("Error submitting promo code:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden border border-black/[0.04] dark:border-white/[0.04]">
                <div className="p-6 border-b border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between">
                    <h2 className="text-xl font-bold text-text-main dark:text-white">
                        {promoCode ? t('admin.editPromoCode') : t('admin.addNewPromoCode')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <MdClose className="text-[24px] text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[80vh]">
                    <div className="flex flex-col gap-2">
                        <label className={`text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 ${dir === 'rtl' ? 'me-1' : 'ms-1'}`}>
                            {t('admin.code')}
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                            placeholder="e.g. SALE20, AHMED10"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none uppercase font-mono"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-2">
                            <label className={`text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 mb-2 block ${dir === 'rtl' ? 'me-1' : 'ms-1'}`}>
                                {t('admin.discountPercentage')}
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={discountPercentage}
                                    onChange={(e) => setDiscountPercentage(e.target.value)}
                                    placeholder="e.g. 10"
                                    required
                                    className={`w-full py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${dir === 'rtl' ? 'pe-4 ps-8' : 'ps-4 pe-8'}`}
                                />
                                <span className={`absolute top-1/2 -translate-y-1/2 text-text-sub dark:text-gray-400 font-bold ${dir === 'rtl' ? 'start-4' : 'end-4'}`}>
                                    %
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={`text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 ${dir === 'rtl' ? 'me-1' : 'ms-1'}`}>
                            {t('admin.delegateName')}
                        </label>
                        <input
                            type="text"
                            value={delegateName}
                            onChange={(e) => setDelegateName(e.target.value)}
                            placeholder="e.g. Ahmed, Instagram Ad"
                            className="w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={`text-[11px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 ${dir === 'rtl' ? 'me-1' : 'ms-1'}`}>
                            {t('admin.status')}
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsActive(!isActive)}
                            className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-gray-900 transition-all ${isActive ? 'ring-2 ring-primary/20 border-primary' : ''}`}
                        >
                            <span className="text-sm text-text-main dark:text-white font-medium">
                                {isActive ? t('admin.active') : t('admin.inactive')}
                            </span>
                            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                <span
                                    className={`${isActive ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') : (dir === 'rtl' ? '-translate-x-1' : 'translate-x-1')} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                />
                            </div>
                        </button>
                    </div>

                    <div className="flex gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] text-text-main dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            {t('admin.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-2 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                                    {t('admin.saving')}
                                </>
                            ) : (
                                promoCode ? t('admin.updateCode') : t('admin.createCode')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

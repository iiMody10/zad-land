"use client";

import React from 'react';
import { CartItem } from '@/app/context/CartContext';
import { useLanguage } from '@/app/context/LanguageContext';
import PriceText from '@/app/components/PriceText';
import { CreditCard as MdPayments, Headset as MdSupportAgent } from 'lucide-react';
import { getSafeImageUrl } from '@/lib/image-utils';
import { formatPackageQuantity } from '@/lib/packaging';
import { useBusinessContact } from '@/app/context/BusinessContactContext';

interface OrderSummaryProps {
    items: CartItem[];
    subtotal: number;
    total: number;
    discount?: number;
    onApplyPromo?: (code: string) => Promise<{ success: boolean; message?: string }>;
}

const OrderSummary = ({ items, subtotal, total, discount = 0, onApplyPromo }: OrderSummaryProps) => {
    const { t, language } = useLanguage();
    const { whatsappUrl } = useBusinessContact();
    const [promoCode, setPromoCode] = React.useState("");
    const [promoMessage, setPromoMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isApplyingPromo, setIsApplyingPromo] = React.useState(false);

    const handleApplyPromo = async () => {
        if (!promoCode.trim() || !onApplyPromo) return;

        setIsApplyingPromo(true);
        setPromoMessage(null);
        try {
            const result = await onApplyPromo(promoCode);
            if (result.success) {
                setPromoMessage({ type: 'success', text: result.message || "Promo code applied!" });
            } else {
                setPromoMessage({ type: 'error', text: result.message || "Invalid promo code" });
            }
        } catch {
            setPromoMessage({ type: 'error', text: "Failed to apply code" });
        } finally {
            setIsApplyingPromo(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleApplyPromo();
        }
    };

    const renderSummaryCard = () => (
            <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-white/10">
                <h2 className="text-base font-extrabold mb-6 text-zinc-900 dark:text-white uppercase tracking-wider">{t('cart.orderSummary')}</h2>
                
                {/* Items List */}
                <div className="space-y-3 mb-6 max-h-none overflow-y-visible lg:max-h-[35vh] lg:overflow-y-auto ltr:pr-2 rtl:pl-2 custom-scrollbar">
                    {items.map((item) => {
                        const itemKey = `${item.id}:${item.selectedOption || ''}`;
                        return (
                            <div key={itemKey} className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-white/5">
                                <div className="relative w-12 h-12 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden shrink-0">
                                    <img
                                        src={getSafeImageUrl(item.image.split(',')[0])}
                                        alt={item.name}
                                        className="w-full h-full object-contain p-1"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold truncate text-zinc-900 dark:text-white" title={item.name}>{item.name}</p>
                                    {item.selectedOption && (
                                        <span className="inline-block text-[10px] font-bold text-[var(--color-accent)] bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 px-1.5 py-0.5 rounded">
                                            {item.selectedOption}
                                        </span>
                                    )}
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                                        {t('cart.quantity')}: {formatPackageQuantity(item.quantity, item.packaging, language)} • <PriceText amount={item.price * item.quantity} className="font-extrabold text-zinc-900 dark:text-white" />
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    {items.length === 0 && (
                        <p className="text-xs text-center py-4 text-gray-400">{t('cart.emptyCart')}</p>
                    )}
                </div>

                {/* Promo Code Input */}
                {onApplyPromo && (
                    <div className="mb-6">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                onKeyDown={handleKeyDown}
                                placeholder={t('checkout.promoCode')}
                                className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-800/60 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--color-brand)] dark:focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-brand)] dark:focus:ring-[var(--color-accent)] uppercase font-semibold placeholder:normal-case transition-all"
                            />
                            <button
                                type="button"
                                onClick={handleApplyPromo}
                                disabled={isApplyingPromo || !promoCode.trim()}
                                className="px-5 py-2.5 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white text-xs font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                            >
                                {isApplyingPromo ? '...' : t('common.apply')}
                            </button>
                        </div>
                        {promoMessage && (
                            <p className={`text-xs mt-2 font-bold ${promoMessage.type === 'success' ? 'text-[var(--color-brand-hover)]' : 'text-red-500'}`}>
                                {promoMessage.text}
                            </p>
                        )}
                    </div>
                )}

                {/* Costs breakdown */}
                <div className="flex flex-col gap-3 mb-6 border-t border-b border-gray-200 dark:border-white/10 py-5">
                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-xs font-medium">
                        <span>{t('cart.subtotal')}</span>
                        <PriceText amount={subtotal} className="font-bold text-zinc-900 dark:text-white" />
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-[var(--color-brand-hover)] font-bold text-xs">
                            <span>{t('checkout.discount')}</span>
                            <PriceText amount={discount} />
                        </div>
                    )}
                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-xs font-medium">
                        <span>{t('cart.shipping')}</span>
                        <span className="font-bold text-[var(--color-brand-hover)] text-xs">{language === 'ar' ? 'يؤكد حسب المنطقة والطلب' : 'Confirmed by area and order'}</span>
                    </div>
                </div>

                {/* Payment Method Badge */}
                <div className="bg-gray-50 dark:bg-zinc-800/60 rounded-xl p-4 mb-6 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('checkout.paymentMethod')}</span>
                        <MdPayments className="text-[var(--color-brand)] dark:text-[var(--color-accent)] text-base" />
                    </div>
                    <p className="text-xs font-extrabold text-zinc-900 dark:text-white">{t('checkout.cashOnDelivery')}</p>
                </div>

                {/* Total */}
                <div className="flex justify-between items-end mb-6">
                    <span className="text-base font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider">{t('cart.total')}</span>
                    <PriceText amount={total} className="text-2xl font-extrabold leading-none text-zinc-900 dark:text-white sm:text-3xl" />
                </div>
                <p className="mb-5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {language === 'ar' ? 'يُحتسب المبلغ النهائي من الأسعار والعروض الحالية عند تثبيت الطلب.' : 'The final amount uses current prices and promotions when you place the order.'}
                </p>

                <p className="text-[11px] text-center text-gray-500 dark:text-gray-400">{language === 'ar' ? 'لا يتم تحصيل أي دفعة إلكترونياً الآن' : 'No online payment is collected now'}</p>
            </div>
    );

    const renderAssistance = () => (
        <div className="bg-gray-50 dark:bg-zinc-800/60 p-4 rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center border border-gray-200 dark:border-white/10 shrink-0">
                    <MdSupportAgent className="text-[var(--color-brand)] dark:text-[var(--color-accent)] text-lg" />
                </div>
                <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white mb-0.5">{t('checkout.needAssistance')}</p>
                    <a
                        className="text-xs font-semibold text-gray-500 hover:text-[var(--color-accent)] dark:hover:text-[var(--color-accent)] transition-colors hover:underline"
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('checkout.speakWithExpert')}
                    </a>
                </div>
            </div>
    );

    return (
        <div className="space-y-4 lg:sticky" style={{ top: "calc(var(--site-header-sticky-offset) + 1rem)" }}>
            <details className="group overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-zinc-900 lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 [&::-webkit-details-marker]:hidden">
                    <div className="min-w-0">
                        <h2 className="text-sm font-extrabold text-[var(--color-brand)] dark:text-white">{t('cart.orderSummary')}</h2>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {items.length} {language === 'ar' ? 'منتجات' : 'items'}
                        </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                        <PriceText amount={total} className="text-base font-extrabold text-[var(--color-brand)] dark:text-white" />
                        <span className="text-xs font-bold text-[var(--color-brand-hover)] group-open:hidden">{language === 'ar' ? 'التفاصيل' : 'Details'}</span>
                        <span className="hidden text-xs font-bold text-[var(--color-brand-hover)] group-open:inline">{language === 'ar' ? 'إخفاء' : 'Hide'}</span>
                    </div>
                </summary>
                <div className="border-t border-slate-100 p-2 dark:border-white/10">{renderSummaryCard()}</div>
            </details>
            <div className="hidden lg:block">{renderSummaryCard()}</div>
            {renderAssistance()}
        </div>
    );
};

export default OrderSummary;

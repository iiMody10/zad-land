"use client";

import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { OrderFormData, OrderFormErrors, SYRIAN_GOVERNORATES } from "@/lib/order-validation";
import { ArrowLeft as MdArrowBack, CircleCheck as MdCheckCircle, Info as MdInfo, RefreshCw as MdRefresh } from 'lucide-react';

type Props = {
    formData: OrderFormData;
    errors: OrderFormErrors;
    touched: Partial<Record<keyof OrderFormData, boolean>>;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onBlur: (field: keyof OrderFormData) => void;
    loading: boolean;
    feedback: string | null;
};

export default function ShippingForm({ formData, errors, touched, onChange, onBlur, loading, feedback }: Props) {
    const { language, dir, t } = useLanguage();
    const ar = language === "ar";
    const inputClass = (field: keyof OrderFormData) => `w-full rounded-xl border bg-white px-4 py-3 text-sm text-[var(--color-brand)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-brand-hover)]/15 dark:bg-zinc-800 dark:text-white ${touched[field] && errors[field] ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500/15" : "border-slate-200 focus:border-[var(--color-brand-hover)] dark:border-white/15"}`;
    const fieldError = (field: keyof OrderFormData) => touched[field] && errors[field] ? <p id={`error-${field}`} className="mt-1.5 text-xs font-semibold text-red-600">{errors[field]}</p> : null;

    return <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900 sm:p-7">
            <div className="mb-5 border-b border-slate-100 pb-4 dark:border-white/10">
                <h2 className="text-base font-extrabold text-[var(--color-brand)] dark:text-white">{ar ? "بيانات المحل والتوصيل" : "Store and delivery details"}</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{ar ? "أدخل بيانات التواصل التي سيستخدمها فريق التوزيع لتأكيد الطلب." : "Enter the details our delivery team will use to confirm your order."}</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label htmlFor="field-shopName" className="mb-1.5 block text-xs font-bold text-[var(--color-brand)] dark:text-white">{ar ? "اسم المحل التجاري" : "Store name"} *</label>
                    <input id="field-shopName" name="shopName" type="text" autoComplete="organization" maxLength={100} required value={formData.shopName} onChange={onChange} onBlur={() => onBlur("shopName")} aria-invalid={Boolean(touched.shopName && errors.shopName)} aria-describedby={errors.shopName ? "error-shopName" : undefined} className={inputClass("shopName")} placeholder={ar ? "اسم المحل أو الشركة" : "Store or company name"} />
                    {fieldError("shopName")}
                </div>
                <div>
                    <label htmlFor="field-ownerName" className="mb-1.5 block text-xs font-bold text-[var(--color-brand)] dark:text-white">{ar ? "اسم صاحب الطلب" : "Contact person"} *</label>
                    <input id="field-ownerName" name="ownerName" type="text" autoComplete="name" maxLength={100} required value={formData.ownerName} onChange={onChange} onBlur={() => onBlur("ownerName")} aria-invalid={Boolean(touched.ownerName && errors.ownerName)} aria-describedby={errors.ownerName ? "error-ownerName" : undefined} className={inputClass("ownerName")} placeholder={ar ? "الاسم الكامل" : "Full name"} />
                    {fieldError("ownerName")}
                </div>
                <div>
                    <label htmlFor="field-phone" className="mb-1.5 block text-xs font-bold text-[var(--color-brand)] dark:text-white">{ar ? "رقم الموبايل" : "Mobile number"} *</label>
                    <input id="field-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" maxLength={24} required value={formData.phone} onChange={onChange} onBlur={() => onBlur("phone")} aria-invalid={Boolean(touched.phone && errors.phone)} aria-describedby={touched.phone && errors.phone ? "error-phone" : undefined} className={inputClass("phone")} />
                    {fieldError("phone")}
                </div>
                <div>
                    <label htmlFor="field-city" className="mb-1.5 block text-xs font-bold text-[var(--color-brand)] dark:text-white">{ar ? "المحافظة" : "Governorate"} *</label>
                    <select id="field-city" name="city" required value={formData.city} onChange={onChange} onBlur={() => onBlur("city")} aria-invalid={Boolean(touched.city && errors.city)} aria-describedby={errors.city ? "error-city" : undefined} className={inputClass("city")}>
                        <option value="">{ar ? "اختر المحافظة" : "Select governorate"}</option>
                        {SYRIAN_GOVERNORATES.map((item) => <option key={item.key} value={item.key}>{ar ? item.ar : item.en}</option>)}
                    </select>
                    {fieldError("city")}
                </div>
                <div>
                    <label htmlFor="field-streetAddress" className="mb-1.5 block text-xs font-bold text-[var(--color-brand)] dark:text-white">{ar ? "العنوان بالتفصيل" : "Full delivery address"} *</label>
                    <input id="field-streetAddress" name="streetAddress" type="text" autoComplete="street-address" maxLength={250} required value={formData.streetAddress} onChange={onChange} onBlur={() => onBlur("streetAddress")} aria-invalid={Boolean(touched.streetAddress && errors.streetAddress)} aria-describedby={errors.streetAddress ? "error-streetAddress" : undefined} className={inputClass("streetAddress")} placeholder={ar ? "الحي والشارع وأقرب نقطة دالة" : "Street, district, and nearby landmark"} />
                    {fieldError("streetAddress")}
                </div>
                <div className="sm:col-span-2">
                    <div className="mb-1.5 flex items-center justify-between"><label htmlFor="field-notes" className="text-xs font-bold text-[var(--color-brand)] dark:text-white">{ar ? "ملاحظات التوصيل (اختياري)" : "Delivery notes (optional)"}</label><span className="text-[11px] text-slate-400">{formData.notes.length}/500</span></div>
                    <textarea id="field-notes" name="notes" rows={3} maxLength={500} value={formData.notes} onChange={onChange} onBlur={() => onBlur("notes")} className={`${inputClass("notes")} resize-none`} placeholder={ar ? "أي تعليمات تساعدنا في تجهيز أو إيصال الطلب" : "Any instructions for preparing or delivering your order"} />
                    {fieldError("notes")}
                </div>
            </div>

            <div className="mt-6 flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"><MdInfo aria-hidden="true" className="mt-0.5 shrink-0 text-base text-[var(--color-brand-hover)]" /><span>{ar ? "سيتم التواصل معك لتأكيد التوصيل. لا يتم خصم أي مبلغ إلكترونياً عند إرسال الطلب." : "Our team will contact you to confirm delivery. No online payment is collected when you place the order."}</span></div>

            {feedback && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{feedback}</div>}

            <button type="submit" disabled={loading} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand-hover)] px-5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-brand)] disabled:cursor-wait disabled:opacity-60">
                {loading ? <MdRefresh className="animate-spin text-lg" /> : <MdCheckCircle className="text-lg" />}
                {loading ? (ar ? "جارٍ إرسال الطلب..." : "Placing order...") : (ar ? "تأكيد الطلب" : "Place order")}
            </button>
        </div>
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[var(--color-brand-hover)]"><MdArrowBack className={dir === "rtl" ? "rotate-180" : ""} />{t("common.returnToCart")}</Link>
    </div>;
}

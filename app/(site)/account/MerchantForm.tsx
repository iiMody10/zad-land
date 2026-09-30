"use client";

import { laravelClientFetch, laravelLogin, SessionVerificationError } from "@/lib/laravel-client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { validateMerchantForm, type MerchantFormErrors } from "@/lib/merchant-validation";

export default function MerchantForm({ mode }: { mode: "login" | "register" }) {
    const { language } = useLanguage();
    const ar = language === "ar";
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<MerchantFormErrors>({});
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({ shopName: "", ownerName: "", phone: "", city: "", address: "", notes: "", password: "" });

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (busy) return;
        setError("");
        const validation = validateMerchantForm(form, mode, ar ? "ar" : "en");
        setFieldErrors(validation.errors);
        if (!validation.isValid) {
            const firstInvalid = Object.keys(validation.errors)[0] as keyof typeof form | undefined;
            if (firstInvalid) document.getElementById(`merchant-${firstInvalid}`)?.focus();
            return;
        }
        setBusy(true);
        try {
            const response = mode === "login"
                ? await laravelLogin("customer", validation.cleanData)
                : await laravelClientFetch("/api/customer/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(validation.cleanData) });
            const data = await response.json();
            if (!response.ok) {
                if (data.errors) setFieldErrors(data.errors);
                throw new Error(data.error === "ACCOUNT_PENDING" ? (ar ? "حسابك بانتظار موافقة الإدارة." : "Your account is awaiting approval.") : data.error || "Request failed");
            }
            if (mode === "register") setSuccess(true);
            else {
                // A fresh document also clears prefetched signed-out routes.
                window.location.replace("/account");
                return;
            }
        } catch (cause) {
            setError(cause instanceof SessionVerificationError
                ? (ar ? "تعذر تأكيد جلسة الدخول. يرجى المحاولة مرة أخرى." : cause.message)
                : cause instanceof Error ? cause.message : "Request failed");
            setBusy(false);
        }
        if (mode === "register") setBusy(false);
    };

    const field = (key: keyof typeof form, labelAr: string, labelEn: string, options: { type?: string; autoComplete?: string; required?: boolean } = {}) => {
        const id = `merchant-${key}`;
        const errorId = `${id}-error`;
        const maxLength = key === "password" ? 128 : key === "phone" ? 24 : key === "shopName" || key === "ownerName" || key === "city" ? 100 : key === "address" ? 250 : key === "notes" ? 500 : undefined;
        const minLength = key === "password" ? 6 : key === "shopName" || key === "ownerName" || key === "city" ? 2 : key === "address" ? 5 : undefined;
        const fieldError = fieldErrors[key];
        return <div>
            <label htmlFor={id} className="block text-sm font-semibold text-[var(--color-brand)] dark:text-white">{ar ? labelAr : labelEn}</label>
            <input
                id={id}
                name={key}
                value={form[key]}
                onChange={(event) => {
                    const value = key === "phone" ? event.target.value.replace(/[^0-9٠-٩۰-۹+().\s-]/gu, "").slice(0, 24) : event.target.value;
                    setForm((current) => ({ ...current, [key]: value }));
                    if (fieldErrors[key]) setFieldErrors((current) => ({ ...current, [key]: undefined }));
                }}
                type={options.type || "text"}
                inputMode={key === "phone" ? "tel" : undefined}
                autoComplete={options.autoComplete}
                required={options.required !== false}
                minLength={minLength}
                maxLength={maxLength}
                aria-invalid={Boolean(fieldError)}
                aria-describedby={fieldError ? errorId : undefined}
                className={`mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm font-normal outline-none focus:ring-2 focus:ring-[var(--color-brand-hover)]/10 dark:bg-zinc-900 dark:text-white ${fieldError ? "border-red-500 dark:border-red-400" : "border-slate-200 focus:border-[var(--color-brand-hover)] dark:border-white/15"}`}
            />
            {fieldError && <p id={errorId} className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{fieldError}</p>}
        </div>;
    };

    return <div className="container-custom flex min-h-[65vh] items-start justify-center py-12 sm:py-20">
        <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[var(--color-surface-dark)] sm:p-9">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">ZAD LAND · B2B</p>
            <h1 className="text-2xl font-extrabold text-[var(--color-brand)] dark:text-white">{mode === "login" ? (ar ? "دخول حساب التاجر" : "Merchant sign in") : (ar ? "طلب حساب تاجر" : "Apply for a merchant account")}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-zinc-300">{mode === "login" ? (ar ? "سجل الدخول لعرض أسعار الجملة." : "Sign in to view wholesale prices.") : (ar ? "تراجع الإدارة طلبك قبل تفعيل عرض أسعار الجملة." : "Our team reviews each application before wholesale prices are available.")}</p>
            {success ? <div role="status" className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-800">{ar ? "تم إرسال طلبك. سنراجع الحساب قبل تفعيله." : "Application received. We’ll review your account before activation."}<div className="mt-4"><Link href="/account/login" className="font-bold underline">{ar ? "العودة لتسجيل الدخول" : "Back to sign in"}</Link></div></div> : <form onSubmit={submit} className="mt-8 space-y-5">
                {mode === "register" && <>{field("shopName", "اسم المتجر", "Shop name", { autoComplete: "organization" })}{field("ownerName", "اسم صاحب المتجر", "Owner name", { autoComplete: "name" })}</>}
                {field("phone", "رقم الجوال", "Mobile number", { type: "tel", autoComplete: "tel" })}
                {mode === "register" && <>{field("city", "المدينة", "City", { autoComplete: "address-level2" })}{field("address", "العنوان", "Address", { autoComplete: "street-address" })}{field("notes", "ملاحظات (اختياري)", "Notes (optional)", { required: false })}</>}
                {field("password", "كلمة المرور", "Password", { type: "password", autoComplete: mode === "login" ? "current-password" : "new-password" })}
                {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                <button disabled={busy} type="submit" className="w-full rounded-xl bg-[var(--color-brand-hover)] px-5 py-3.5 text-sm font-bold text-white hover:bg-[var(--color-brand-hover)] disabled:opacity-60">{busy ? (ar ? "يرجى الانتظار..." : "Please wait...") : mode === "login" ? (ar ? "تسجيل الدخول" : "Sign in") : (ar ? "إرسال الطلب" : "Send application")}</button>
            </form>}
            {!success && <p className="mt-6 text-center text-sm text-slate-500 dark:text-zinc-300">{mode === "login" ? <>{ar ? "ليس لديك حساب؟" : "No merchant account?"} <Link href="/account/register" className="font-bold text-[var(--color-brand-hover)] hover:underline">{ar ? "أنشئ حساباً" : "Apply now"}</Link></> : <>{ar ? "لديك حساب؟" : "Already registered?"} <Link href="/account/login" className="font-bold text-[var(--color-brand-hover)] hover:underline">{ar ? "سجل الدخول" : "Sign in"}</Link></>}</p>}
        </div>
    </div>;
}

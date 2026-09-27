"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import { laravelClientFetch } from "@/lib/laravel-client";
import { useLanguage } from "@/app/context/LanguageContext";

export type MerchantAccount = {
    id: string;
    shopName: string;
    ownerName: string;
    phone: string;
    city: string;
    address: string;
    notes: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    _count?: { orders?: number; wishlistItems?: number };
};

type Draft = Omit<MerchantAccount, "id" | "createdAt" | "updatedAt" | "_count"> & { password: string };

const emptyDraft: Draft = {
    shopName: "", ownerName: "", phone: "", city: "", address: "", notes: "", isActive: true, password: "",
};

export default function MerchantAccountModal({
    open,
    merchant,
    onClose,
    onSaved,
}: {
    open: boolean;
    merchant: MerchantAccount | null;
    onClose: () => void;
    onSaved: (merchant: MerchantAccount) => void;
}) {
    const { t, dir, language } = useLanguage();
    const [draft, setDraft] = useState<Draft>(emptyDraft);
    const [saving, setSaving] = useState(false);
    const isArabic = language === "ar";

    useEffect(() => {
        if (!open) return;
        setDraft(merchant ? {
            shopName: merchant.shopName,
            ownerName: merchant.ownerName,
            phone: merchant.phone,
            city: merchant.city,
            address: merchant.address,
            notes: merchant.notes || "",
            isActive: merchant.isActive,
            password: "",
        } : emptyDraft);
    }, [open, merchant]);

    if (!open) return null;

    const fieldClass = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 dark:border-white/10 dark:bg-slate-900 dark:text-white";
    const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200";
    const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => ({ ...current, [key]: value }));

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        try {
            const response = await laravelClientFetch(merchant ? `/api/admin/customers/${encodeURIComponent(merchant.id)}` : "/api/admin/customers", {
                method: merchant ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ ...draft, notes: draft.notes || null, password: draft.password || null }),
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                const validation = payload?.errors && Object.values(payload.errors).flat()[0];
                throw new Error(String(validation || payload?.message || payload?.error || "Request failed"));
            }
            onSaved({ ...payload, _count: merchant?._count || { orders: 0, wishlistItems: 0 } });
            toast.success(t(merchant ? "admin.merchantSaved" : "admin.merchantCreated"));
            onClose();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : (isArabic ? "تعذر حفظ حساب التاجر" : "Could not save merchant account"));
        } finally {
            setSaving(false);
        }
    };

    const textFields: { key: "shopName" | "ownerName" | "phone" | "city" | "address"; label: string; type?: string; autoComplete?: string }[] = [
        { key: "shopName", label: t("admin.merchantShopName") },
        { key: "ownerName", label: t("admin.merchantOwnerName") },
        { key: "phone", label: t("admin.merchantPhone"), type: "tel", autoComplete: "tel" },
        { key: "city", label: t("admin.merchantCity") },
        { key: "address", label: t("admin.merchantAddress") },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir={dir}>
            <button type="button" aria-label={isArabic ? "إغلاق" : "Close dialog"} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={saving ? undefined : onClose} />
            <section role="dialog" aria-modal="true" aria-labelledby="merchant-modal-title" className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[var(--color-surface-dark)] sm:p-7">
                <header className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h2 id="merchant-modal-title" className="text-xl font-extrabold text-[var(--color-brand)] dark:text-white">{t(merchant ? "admin.editMerchant" : "admin.addMerchant")}</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{isArabic ? "تظهر التعديلات مباشرة في حساب التاجر." : "Changes are applied directly to the merchant account."}</p>
                    </div>
                    <button type="button" onClick={onClose} disabled={saving} className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-white/10" aria-label={isArabic ? "إغلاق" : "Close"}><X className="size-5" /></button>
                </header>

                <form onSubmit={submit} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {textFields.map(({ key, label, type, autoComplete }) => (
                            <label key={key} className={key === "address" ? "sm:col-span-2" : ""}>
                                <span className={labelClass}>{label} *</span>
                                <input required type={type || "text"} autoComplete={autoComplete} value={draft[key]} onChange={(event) => set(key, event.target.value)} className={fieldClass} />
                            </label>
                        ))}
                        <label className="sm:col-span-2">
                            <span className={labelClass}>{t("admin.merchantNotes")}</span>
                            <textarea value={draft.notes || ""} onChange={(event) => set("notes", event.target.value)} maxLength={500} rows={3} className={`${fieldClass} h-auto py-3`} />
                        </label>
                        <label className="sm:col-span-2">
                            <span className={labelClass}>{t("admin.merchantPassword")}{!merchant && " *"}</span>
                            <input required={!merchant} minLength={6} maxLength={128} type="password" autoComplete="new-password" value={draft.password} onChange={(event) => set("password", event.target.value)} className={fieldClass} />
                            {merchant && <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{t("admin.merchantPasswordHint")}</span>}
                        </label>
                    </div>

                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                        <input type="checkbox" checked={draft.isActive} onChange={(event) => set("isActive", event.target.checked)} className="mt-0.5 size-4 accent-emerald-700" />
                        <span>
                            <span className="block text-sm font-bold text-slate-800 dark:text-white">{t("admin.merchantAccountActive")}</span>
                            <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{isArabic ? "عند إلغاء التحديد لن يتمكن التاجر من تسجيل الدخول أو رؤية أسعار الجملة." : "When disabled, the merchant cannot sign in or view wholesale prices."}</span>
                        </span>
                    </label>

                    <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 dark:border-white/10 sm:flex-row sm:justify-end">
                        <button type="button" onClick={onClose} disabled={saving} className="min-h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">{t("admin.cancel")}</button>
                        <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 text-sm font-bold text-white hover:bg-[var(--color-brand-hover)] disabled:cursor-wait disabled:opacity-60">
                            {saving && <LoaderCircle className="size-4 animate-spin" />}{t("admin.saveMerchant")}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}

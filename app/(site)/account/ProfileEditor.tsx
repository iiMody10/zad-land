"use client";

import { laravelClientFetch } from "@/lib/laravel-client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Store as MdOutlineStorefront } from 'lucide-react';
import { useLanguage } from "@/app/context/LanguageContext";
import type { MerchantProfile } from "./AccountClient";

export default function ProfileEditor({ profile, onSaved }: { profile: MerchantProfile; onSaved: (profile: MerchantProfile) => void }) {
    const router = useRouter();
    const { language } = useLanguage();
    const ar = language === "ar";
    const [draft, setDraft] = useState(profile);
    const [saving, setSaving] = useState(false);

    const save = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        try {
            const response = await laravelClientFetch("/api/customer/auth/me", {
                method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not save profile");
            onSaved(data.customer);
            setDraft(data.customer);
            toast.success(ar ? "تم حفظ بيانات المتجر" : "Shop details saved");
            router.refresh();
        } catch (cause) {
            toast.error(cause instanceof Error ? cause.message : "Could not save profile");
        } finally {
            setSaving(false);
        }
    };

    const fields: { key: "shopName" | "ownerName" | "city" | "address"; label: string }[] = [
        { key: "shopName", label: ar ? "اسم المتجر" : "Shop name" },
        { key: "ownerName", label: ar ? "اسم المالك" : "Owner name" },
        { key: "city", label: ar ? "المدينة" : "City" },
        { key: "address", label: ar ? "العنوان" : "Address" },
    ];

    return <section className="mt-7 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[var(--color-surface-dark)] sm:p-8">
        <div className="flex items-center gap-3"><MdOutlineStorefront className="text-2xl text-[var(--color-brand-hover)]"/><h2 className="text-xl font-bold text-[var(--color-brand)] dark:text-white">{ar ? "بيانات المتجر" : "Shop profile"}</h2></div>
        <p className="mt-2 text-sm text-slate-500">{ar ? "حدّث بيانات نشاطك وعنوان التسليم." : "Keep your business and delivery details current."}</p>
        <form onSubmit={save} className="mt-6 grid gap-4 sm:grid-cols-2">
            {fields.map(({ key, label }) => <label key={key} className="block text-sm font-semibold text-[var(--color-brand)] dark:text-white">{label}<input value={draft[key] || ""} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} required minLength={key === "address" ? 4 : 2} maxLength={key === "address" ? 250 : 100} className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal outline-none focus:border-[var(--color-brand-hover)] dark:border-white/15 dark:bg-zinc-900 dark:text-white" /></label>)}
            <label className="block text-sm font-semibold text-[var(--color-brand)] dark:text-white sm:col-span-2">{ar ? "ملاحظات التسليم" : "Delivery notes"}<textarea value={draft.notes || ""} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} maxLength={500} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-[var(--color-brand-hover)] dark:border-white/15 dark:bg-zinc-900 dark:text-white" /></label>
            <p className="text-sm text-slate-500 sm:col-span-2">{ar ? "رقم الجوال المعتمد:" : "Approved mobile number:"} <span dir="ltr" className="font-bold text-[var(--color-brand)] dark:text-white">{profile.phone}</span></p>
            <button disabled={saving} type="submit" className="rounded-xl bg-[var(--color-brand-hover)] px-5 py-3 text-sm font-bold text-white disabled:opacity-50 sm:col-span-2">{saving ? (ar ? "جاري الحفظ..." : "Saving...") : (ar ? "حفظ التغييرات" : "Save changes")}</button>
        </form>
    </section>;
}

"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import PlatformIcon from "@/app/components/PlatformIcon";
import { useLanguage } from "@/app/context/LanguageContext";
import CompanyContactsEditor from "./CompanyContactsEditor";

export type BusinessContactValues = {
    companyContacts: string;
    footerPhone: string;
    footerEmail: string;
    footerWhatsappUrl: string;
    footerFacebookUrl: string;
    footerInstagramUrl: string;
};

export default function BusinessContactSection({ value, onChange }: {
    value: BusinessContactValues;
    onChange: (key: keyof BusinessContactValues, next: string) => void;
}) {
    const { language } = useLanguage();
    const ar = language === "ar";
    const tx = (arabic: string, english: string) => ar ? arabic : english;
    const fieldClass = "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/15 dark:border-white/10 dark:bg-gray-800 dark:text-white";

    const field = (key: keyof BusinessContactValues, label: string, placeholder: string, type = "text") => (
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
            {label}
            <input type={type} value={value[key]} onChange={(event) => onChange(key, event.target.value)} placeholder={placeholder} dir="ltr" className={fieldClass} />
        </label>
    );

    return <div className="space-y-6" dir={ar ? "rtl" : "ltr"}>
        <CompanyContactsEditor value={value.companyContacts} onChange={(next) => onChange("companyContacts", next)} language={ar ? "ar" : "en"} />
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[var(--color-surface-dark)] md:p-8">
            <div className="mb-6 flex items-start gap-3">
                <span className="rounded-xl bg-emerald-50 p-3 text-[var(--color-brand)] dark:bg-emerald-950/40 dark:text-emerald-200"><Phone className="size-5" /></span>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tx("بيانات التواصل العامة", "Global Contact Details")}</h3>
                    <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">{tx("هذه هي البيانات الموحدة المستخدمة في الفوتر وصفحة التواصل وأزرار واتساب ومساعدة الطلبات في المتجر.", "These shared values power the footer, contact page, WhatsApp buttons, and order support links throughout the storefront.")}</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {field("footerPhone", tx("رقم الهاتف وواتساب", "Phone and WhatsApp number"), "+963 933 254 796", "tel")}
                {field("footerEmail", tx("البريد الإلكتروني", "Email address"), "info@zadland.com", "email")}
            </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[var(--color-surface-dark)] md:p-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{tx("حسابات التواصل الاجتماعي", "Social Media Accounts")}</h3>
            <p className="mb-5 mt-1 text-sm text-slate-500 dark:text-slate-400">{tx("حدّث الروابط هنا مرة واحدة لتظهر في كل أجزاء الموقع.", "Update each profile once here to use it consistently across the website.")}</p>
            <div className="grid gap-4 md:grid-cols-3">
                {(["footerInstagramUrl", "footerFacebookUrl", "footerWhatsappUrl"] as const).map((key) => {
                    const platform = key === "footerInstagramUrl" ? "instagram" : key === "footerFacebookUrl" ? "facebook" : "whatsapp";
                    const label = platform === "instagram" ? "Instagram" : platform === "facebook" ? "Facebook" : "WhatsApp";
                    const placeholder = platform === "instagram" ? "https://instagram.com/zadland" : platform === "facebook" ? "https://facebook.com/zadland" : "https://wa.me/963933254796";
                    return <div key={key} className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
                        <div className="mb-3 flex items-center gap-2 font-bold text-slate-800 dark:text-white"><PlatformIcon platform={platform} className="size-5" /><span>{label}</span></div>
                        {field(key, tx("الرابط الرسمي", "Official profile URL"), placeholder, "url")}
                    </div>;
                })}
            </div>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <h3 className="mb-3 text-sm font-extrabold text-emerald-950 dark:text-emerald-100">{tx("معاينة البيانات العامة", "Shared details preview")}</h3>
            <div className="grid gap-3 text-sm text-emerald-950 dark:text-emerald-100 sm:grid-cols-3">
                <p className="flex min-w-0 items-center gap-2"><Phone className="size-4 shrink-0" /><span dir="ltr" className="truncate">{value.footerPhone || "—"}</span></p>
                <p className="flex min-w-0 items-center gap-2"><Mail className="size-4 shrink-0" /><span className="truncate">{value.footerEmail || "—"}</span></p>
                <p className="flex min-w-0 items-center gap-2"><MessageCircle className="size-4 shrink-0" /><span className="truncate" dir="ltr">{value.footerWhatsappUrl || "—"}</span></p>
            </div>
        </section>
    </div>;
}

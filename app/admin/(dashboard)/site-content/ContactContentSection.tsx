"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import type { ContactPageContent } from "@/lib/contact-page-content";
import { MessageCircle, Phone } from "lucide-react";

type TextKey = Exclude<keyof ContactPageContent, "pageEnabled" | "heroEnabled" | "whatsappEnabled" | "contactInfoEnabled" | "addressEnabled" | "hoursEnabled" | "emailEnabled" | "socialEnabled" | "formEnabled">;

const fields: Array<{ title: string; keys: TextKey[]; multiline?: boolean }> = [
    { title: "Badge", keys: ["heroBadgeEn", "heroBadgeAr"] },
    { title: "Page title", keys: ["heroTitleEn", "heroTitleAr"] },
    { title: "Page introduction", keys: ["heroDescriptionEn", "heroDescriptionAr"], multiline: true },
    { title: "WhatsApp card title", keys: ["whatsappTitleEn", "whatsappTitleAr"] },
    { title: "WhatsApp card description", keys: ["whatsappDescriptionEn", "whatsappDescriptionAr"] },
    { title: "Address card heading", keys: ["addressTitleEn", "addressTitleAr"] },
    { title: "Address", keys: ["addressLineEn", "addressLineAr"] },
    { title: "Address details", keys: ["addressDescriptionEn", "addressDescriptionAr"] },
    { title: "Hours card heading", keys: ["hoursTitleEn", "hoursTitleAr"] },
    { title: "Working hours", keys: ["hoursLineEn", "hoursLineAr"] },
    { title: "Hours details", keys: ["hoursDescriptionEn", "hoursDescriptionAr"] },
    { title: "Email card heading", keys: ["emailTitleEn", "emailTitleAr"] },
    { title: "Social links heading", keys: ["socialTitleEn", "socialTitleAr"] },
    { title: "Form heading", keys: ["formTitleEn", "formTitleAr"] },
    { title: "Form introduction", keys: ["formDescriptionEn", "formDescriptionAr"], multiline: true },
    { title: "Success message heading", keys: ["successTitleEn", "successTitleAr"] },
    { title: "Success message", keys: ["successDescriptionEn", "successDescriptionAr"], multiline: true },
    { title: "Name field label", keys: ["nameLabelEn", "nameLabelAr"] },
    { title: "Name placeholder", keys: ["namePlaceholderEn", "namePlaceholderAr"] },
    { title: "Business field label", keys: ["businessLabelEn", "businessLabelAr"] },
    { title: "Business placeholder", keys: ["businessPlaceholderEn", "businessPlaceholderAr"] },
    { title: "Phone field label", keys: ["phoneLabelEn", "phoneLabelAr"] },
    { title: "Phone placeholder", keys: ["phonePlaceholderEn", "phonePlaceholderAr"] },
    { title: "Message field label", keys: ["messageLabelEn", "messageLabelAr"] },
    { title: "Message placeholder", keys: ["messagePlaceholderEn", "messagePlaceholderAr"], multiline: true },
    { title: "Submit button", keys: ["submitLabelEn", "submitLabelAr"] },
    { title: "Sending state", keys: ["sendingLabelEn", "sendingLabelAr"] },
    { title: "SEO title", keys: ["seoTitleEn", "seoTitleAr"] },
    { title: "SEO description", keys: ["seoDescriptionEn", "seoDescriptionAr"], multiline: true },
];

const visibility: Array<{ key: keyof ContactPageContent; ar: string; en: string }> = [
    { key: "pageEnabled", ar: "إظهار صفحة التواصل", en: "Show contact page" },
    { key: "heroEnabled", ar: "المقدمة", en: "Introduction" },
    { key: "whatsappEnabled", ar: "بطاقة واتساب", en: "WhatsApp card" },
    { key: "contactInfoEnabled", ar: "معلومات التواصل", en: "Contact information" },
    { key: "addressEnabled", ar: "العنوان", en: "Address" },
    { key: "hoursEnabled", ar: "أوقات العمل", en: "Working hours" },
    { key: "emailEnabled", ar: "البريد الإلكتروني", en: "Email" },
    { key: "socialEnabled", ar: "روابط التواصل الاجتماعي", en: "Social links" },
    { key: "formEnabled", ar: "نموذج الرسالة", en: "Message form" },
];

export default function ContactContentSection({ value, onChange, email, whatsappUrl, facebookUrl, instagramUrl }: {
    value: ContactPageContent;
    onChange: (key: keyof ContactPageContent, next: string | boolean) => void;
    email: string;
    whatsappUrl: string;
    facebookUrl: string;
    instagramUrl: string;
}) {
    const { language } = useLanguage();
    const isArabic = language === "ar";
    const tx = (ar: string, en: string) => isArabic ? ar : en;
    const text = (key: TextKey) => value[key];

    return (
        <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100">
                <Phone className="mt-0.5 size-5 shrink-0" />
                <p className="text-sm leading-6">{tx("حرر نصوص صفحة التواصل بالعربية والإنجليزية، وتحكم في ظهور أقسامها. روابط واتساب وفيسبوك وإنستغرام والبريد تُدار من إعدادات الفوتر.", "Edit the contact page copy in Arabic and English and control section visibility. WhatsApp, Facebook, Instagram and footer email details are managed in the Footer tab.")}</p>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[var(--color-surface-dark)] md:p-7">
                <h3 className="mb-4 text-lg font-extrabold text-slate-900 dark:text-white">{tx("أقسام الصفحة", "Page sections")}</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {visibility.map(({ key, ar, en }) => (
                        <label key={key} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-slate-200">
                            <span>{tx(ar, en)}</span>
                            <input type="checkbox" checked={value[key] !== false} onChange={(event) => onChange(key, event.target.checked)} className="size-4 accent-[var(--color-brand)]" />
                        </label>
                    ))}
                </div>
            </section>

            {fields.map(({ title, keys, multiline }) => (
                <section key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[var(--color-surface-dark)] md:p-7">
                    <h3 className="mb-4 text-lg font-extrabold text-slate-900 dark:text-white">{title}</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {keys.map((key) => {
                            const arabic = key.endsWith("Ar");
                            const label = `${arabic ? "العربية" : "English"} · ${title}`;
                            const common = "mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-brand)] dark:border-white/10 dark:bg-gray-800 dark:text-white";
                            return <label key={key} className="text-xs font-bold text-slate-500 dark:text-slate-300">{label}
                                {multiline ? <textarea rows={3} value={text(key)} onChange={(event) => onChange(key, event.target.value)} className={common} dir={arabic ? "rtl" : "ltr"} /> : <input value={text(key)} onChange={(event) => onChange(key, event.target.value)} className={common} dir={arabic ? "rtl" : "ltr"} />}
                            </label>;
                        })}
                    </div>
                </section>
            ))}

            <section className="rounded-2xl border border-emerald-900 bg-[#153d32] p-6 text-white shadow-sm" dir={isArabic ? "rtl" : "ltr"}>
                <div className="mb-4 flex items-center gap-2 text-amber-300"><MessageCircle className="size-4" /><strong className="text-sm">{tx("معاينة سريعة", "Quick preview")}</strong></div>
                <h3 className="text-xl font-extrabold">{text(isArabic ? "heroTitleAr" : "heroTitleEn")}</h3>
                <p className="mt-2 max-w-2xl text-sm text-white/80">{text(isArabic ? "heroDescriptionAr" : "heroDescriptionEn")}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-white/10 p-4"><strong>{text(isArabic ? "formTitleAr" : "formTitleEn")}</strong><p className="mt-1 text-sm text-white/75">{text(isArabic ? "submitLabelAr" : "submitLabelEn")}</p></div>
                    <div className="rounded-xl bg-white/10 p-4"><strong>{text(isArabic ? "addressTitleAr" : "addressTitleEn")}</strong><p className="mt-1 text-sm text-white/75">{text(isArabic ? "addressLineAr" : "addressLineEn")}</p></div>
                </div>
                <p className="mt-4 text-xs text-white/60">{tx(`البريد: ${email || "—"} · واتساب: ${whatsappUrl || "—"} · فيسبوك: ${facebookUrl ? "✓" : "—"} · إنستغرام: ${instagramUrl ? "✓" : "—"}`, `Email: ${email || "—"} · WhatsApp: ${whatsappUrl || "—"} · Facebook: ${facebookUrl ? "✓" : "—"} · Instagram: ${instagramUrl ? "✓" : "—"}`)}</p>
            </section>
        </div>
    );
}

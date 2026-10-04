"use client";

import { Plus, Trash2 } from "lucide-react";
import CompanyContacts from "@/app/components/CompanyContacts";
import { parseCompanyContacts, type CompanyContact } from "@/lib/business-contact";

export default function CompanyContactsEditor({ value, onChange, language }: {
    value: string;
    onChange: (value: string) => void;
    language: "ar" | "en";
}) {
    const contacts = parseCompanyContacts(value);
    const ar = language === "ar";
    const tx = (arabic: string, english: string) => ar ? arabic : english;
    const update = (id: string, patch: Partial<CompanyContact>) => onChange(JSON.stringify(contacts.map((contact) => contact.id === id ? { ...contact, ...patch } : contact)));
    const fields = [
        { key: "nameAr", label: "الاسم بالعربية", dir: "rtl" },
        { key: "nameEn", label: "Name in English", dir: "ltr" },
        { key: "roleAr", label: "المسمى الوظيفي بالعربية", dir: "rtl" },
        { key: "roleEn", label: "Role in English", dir: "ltr" },
        { key: "phone", label: tx("رقم الهاتف", "Phone number"), dir: "ltr" },
    ] as const;

    return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[var(--color-surface-dark)] md:p-8">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tx("إدارة الشركة والمبيعات", "Management and Sales Contacts")}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tx("تظهر هذه البيانات في الفوتر وصفحة التواصل. احفظ التغييرات بعد التعديل.", "These contacts appear in the footer and contact page. Save your changes after editing.")}</p>
            </div>
            <button type="button" disabled={contacts.length >= 20} onClick={() => onChange(JSON.stringify([...contacts, { id: crypto.randomUUID(), nameAr: "", nameEn: "", roleAr: "", roleEn: "", phone: "", enabled: true }]))} className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-brand)] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
                <Plus className="size-4" />{tx("إضافة جهة اتصال", "Add contact")}
            </button>
        </div>
        <div className="space-y-4">
            {contacts.map((contact, index) => <fieldset key={contact.id} className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
                <legend className="px-2 text-sm font-bold text-slate-800 dark:text-white">{tx(`جهة الاتصال ${index + 1}`, `Contact ${index + 1}`)}</legend>
                <div className="mb-4 flex items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"><input type="checkbox" checked={contact.enabled} onChange={(event) => update(contact.id, { enabled: event.target.checked })} className="size-4 accent-[var(--color-brand)]" />{tx("إظهار في الموقع", "Show on website")}</label>
                    <button type="button" aria-label={tx(`حذف جهة الاتصال ${index + 1}`, `Remove contact ${index + 1}`)} onClick={() => onChange(JSON.stringify(contacts.filter((item) => item.id !== contact.id)))} className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="size-4" /></button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {fields.map(({ key, label, dir }) => <label key={key} className="block text-xs font-bold text-slate-700 dark:text-slate-200">{label}<input value={contact[key]} type={key === "phone" ? "tel" : "text"} maxLength={key === "phone" ? 40 : 150} dir={dir} onChange={(event) => update(contact.id, { [key]: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-brand)]/15 dark:border-white/10 dark:bg-gray-800 dark:text-white" /></label>)}
                </div>
            </fieldset>)}
            {!contacts.length && <p className="text-sm text-slate-500">{tx("لا توجد جهات اتصال. استخدم زر الإضافة لإظهار جهة جديدة.", "No contacts. Add a contact to display it on the website.")}</p>}
        </div>
        {contacts.some((contact) => contact.enabled) && <div className="mt-6 rounded-xl bg-slate-50 p-4 text-slate-900 dark:bg-white/5 dark:text-white"><h4 className="mb-3 text-sm font-bold">{tx("معاينة", "Preview")}</h4><CompanyContacts contacts={contacts} language={language} /></div>}
    </section>;
}

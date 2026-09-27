"use client";

import { Image as ImageIcon, Info, Search, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import ImageUploadField from "../../components/ImageUploadField";
import { useLanguage } from "@/app/context/LanguageContext";

export type AboutSettingsForm = Record<string, string | boolean>;

function LocalizedFields({
    label, enKey, arKey, value, onChange, multiline = false,
}: {
    label: string;
    enKey: string;
    arKey: string;
    value: AboutSettingsForm;
    onChange: (key: string, next: string | boolean) => void;
    multiline?: boolean;
}) {
    const Field = ({ id, language, dir }: { id: string; language: string; dir?: "rtl" }) => {
        const common = "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10 dark:border-white/10 dark:bg-gray-800 dark:text-white";
        return (
            <label className="block min-w-0" dir={dir}>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{language}</span>
                {multiline ? (
                    <textarea rows={3} value={String(value[id] ?? "")} onChange={(event) => onChange(id, event.target.value)} className={`${common} resize-y`} />
                ) : (
                    <input value={String(value[id] ?? "")} onChange={(event) => onChange(id, event.target.value)} className={common} />
                )}
            </label>
        );
    };

    return (
        <div className="space-y-2">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</p>
            <div className="grid gap-3 md:grid-cols-2">
                <Field id={enKey} language="English" />
                <Field id={arKey} language="العربية" dir="rtl" />
            </div>
        </div>
    );
}

function UrlField({ label, id, value, onChange }: { label: string; id: string; value: AboutSettingsForm; onChange: (key: string, next: string | boolean) => void }) {
    return (
        <label className="block">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</span>
            <input value={String(value[id] ?? "")} onChange={(event) => onChange(id, event.target.value)} placeholder="/uploads/... or https://..." className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10 dark:border-white/10 dark:bg-gray-800 dark:text-white" />
        </label>
    );
}

function SectionCard({ title, description, enabledKey, value, onChange, children, showLabel }: {
    title: string;
    description: string;
    enabledKey?: string;
    value: AboutSettingsForm;
    onChange: (key: string, next: string | boolean) => void;
    children: ReactNode;
    showLabel?: string;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[var(--color-surface-dark)] md:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
                </div>
                {enabledKey && <label className="inline-flex shrink-0 items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 dark:bg-white/5 dark:text-slate-200">
                    <input type="checkbox" checked={value[enabledKey] !== false} onChange={(event) => onChange(enabledKey, event.target.checked)} className="size-4 accent-[var(--color-brand)]" />
                    {showLabel || "Show"}
                </label>}
            </div>
            <div className="space-y-6">{children}</div>
        </section>
    );
}

export default function AboutContentSection({ value, onChange }: { value: AboutSettingsForm; onChange: (key: string, next: string | boolean) => void }) {
    const { language } = useLanguage();
    const isArabic = language === "ar";
    const tx = (ar: string, en: string) => isArabic ? ar : en;
    return (
        <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100">
                <Info className="mt-0.5 size-5 shrink-0" />
                <p className="text-sm leading-6">{tx('تحكم في محتوى صفحة «من نحن» بالعربية والإنجليزية. يمكن إخفاء الصفحة أو أي قسم، وتغيير النصوص والصور وروابط الأزرار من هنا.', 'Manage the About page in both languages. Hide the page or individual sections, and edit its text, images and button links here.')}</p>
            </div>

            <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-[var(--color-surface-dark)]">
                <span>
                    <span className="block font-extrabold text-slate-900 dark:text-white">{tx('إظهار صفحة من نحن', 'Show About page')}</span>
                    <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{tx('عند الإيقاف، لن تكون الصفحة متاحة للزوار.', 'When disabled, visitors cannot access the page.')}</span>
                </span>
                <input type="checkbox" checked={value.aboutPageEnabled !== false} onChange={(event) => onChange("aboutPageEnabled", event.target.checked)} className="size-5 accent-[var(--color-brand)]" />
            </label>

            <SectionCard title={tx('مقدمة الصفحة', 'Page introduction')} description={tx('العنوان والوصف والصورة والأزرار التي تظهر في أعلى الصفحة.', 'The heading, description, image and buttons at the top of the page.')} enabledKey="aboutHeroEnabled" value={value} onChange={onChange} showLabel={tx('إظهار', 'Show')}>
                <div className="grid gap-4 md:grid-cols-2">
                    <ImageUploadField label={tx('صورة المقدمة', 'Introduction image')} folder="about" value={String(value.aboutHeroImage ?? "")} onChange={(url) => onChange("aboutHeroImage", url)} />
                    <LocalizedFields label={tx('وصف الصورة البديل (لإمكانية الوصول)', 'Image alt text (accessibility)')} enKey="aboutHeroImageAlt" arKey="aboutHeroImageAltAr" value={value} onChange={onChange} />
                </div>
                <LocalizedFields label={tx('الشارة الصغيرة فوق العنوان', 'Eyebrow')} enKey="aboutHeroEyebrow" arKey="aboutHeroEyebrowAr" value={value} onChange={onChange} />
                <LocalizedFields label={tx('العنوان الرئيسي', 'Main heading')} enKey="aboutHeroTitle" arKey="aboutHeroTitleAr" value={value} onChange={onChange} />
                <LocalizedFields label={tx('الوصف', 'Description')} enKey="aboutHeroSubtitle" arKey="aboutHeroSubtitleAr" value={value} onChange={onChange} multiline />
                <div className="grid gap-4 md:grid-cols-2">
                    <LocalizedFields label={tx('نص الزر الأول', 'Primary button label')} enKey="aboutHeroPrimaryCtaLabel" arKey="aboutHeroPrimaryCtaLabelAr" value={value} onChange={onChange} />
                    <UrlField label={tx('رابط الزر الأول', 'Primary button link')} id="aboutHeroPrimaryCtaUrl" value={value} onChange={onChange} />
                    <LocalizedFields label={tx('نص الزر الثاني', 'Secondary button label')} enKey="aboutHeroSecondaryCtaLabel" arKey="aboutHeroSecondaryCtaLabelAr" value={value} onChange={onChange} />
                    <UrlField label={tx('رابط الزر الثاني', 'Secondary button link')} id="aboutHeroSecondaryCtaUrl" value={value} onChange={onChange} />
                </div>
            </SectionCard>

            <SectionCard title={tx('قصة الشركة', 'Company story')} description={tx('النص التعريفي والصورة والاقتباس في القسم الأوسط.', 'The story, image and quote in the middle section.')} enabledKey="aboutNarrativeEnabled" value={value} onChange={onChange} showLabel={tx('إظهار', 'Show')}>
                <div className="grid gap-4 md:grid-cols-2">
                    <ImageUploadField label={tx('صورة القصة', 'Story image')} folder="about" value={String(value.aboutNarrativeImage ?? "")} onChange={(url) => onChange("aboutNarrativeImage", url)} />
                    <LocalizedFields label={tx('وصف الصورة البديل (لإمكانية الوصول)', 'Image alt text (accessibility)')} enKey="aboutNarrativeImageAlt" arKey="aboutNarrativeImageAltAr" value={value} onChange={onChange} />
                </div>
                <LocalizedFields label={tx('الشارة الصغيرة', 'Eyebrow')} enKey="aboutNarrativeFounded" arKey="aboutNarrativeFoundedAr" value={value} onChange={onChange} />
                <LocalizedFields label={tx('عنوان القصة', 'Story heading')} enKey="aboutNarrativeTitle" arKey="aboutNarrativeTitleAr" value={value} onChange={onChange} />
                <LocalizedFields label={tx('الفقرة الأولى', 'Paragraph one')} enKey="aboutNarrativeDesc1" arKey="aboutNarrativeDesc1Ar" value={value} onChange={onChange} multiline />
                <LocalizedFields label={tx('الفقرة الثانية', 'Paragraph two')} enKey="aboutNarrativeDesc2" arKey="aboutNarrativeDesc2Ar" value={value} onChange={onChange} multiline />
                <LocalizedFields label={tx('الاقتباس الختامي', 'Closing quote')} enKey="aboutNarrativeQuote" arKey="aboutNarrativeQuoteAr" value={value} onChange={onChange} multiline />
            </SectionCard>

            <SectionCard title={tx('مبادئ العمل', 'How we work')} description={tx('عنوان القسم ووصفه وبطاقات المبادئ الثلاث.', 'The section heading, description and up to three principle cards.')} enabledKey="aboutValuesEnabled" value={value} onChange={onChange} showLabel={tx('إظهار', 'Show')}>
                <LocalizedFields label={tx('الشارة الصغيرة', 'Eyebrow')} enKey="aboutValuesEyebrow" arKey="aboutValuesEyebrowAr" value={value} onChange={onChange} />
                <LocalizedFields label={tx('عنوان القسم', 'Section heading')} enKey="aboutValuesTitle" arKey="aboutValuesTitleAr" value={value} onChange={onChange} />
                <LocalizedFields label={tx('وصف القسم', 'Section description')} enKey="aboutValuesDesc" arKey="aboutValuesDescAr" value={value} onChange={onChange} multiline />
                {[1, 2, 3].map((number) => {
                    const suffix = String(number);
                    return (
                        <div key={number} className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <h4 className="font-bold text-slate-800 dark:text-white">{tx(`البطاقة ${number}`, `Card ${number}`)}</h4>
                                <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                    <input type="checkbox" checked={value[`aboutValue${suffix}Enabled`] !== false} onChange={(event) => onChange(`aboutValue${suffix}Enabled`, event.target.checked)} className="size-4 accent-[var(--color-brand)]" />
                                    {tx('إظهار البطاقة', 'Show card')}
                                </label>
                            </div>
                            <div className="space-y-4">
                                <LocalizedFields label={tx('العنوان', 'Heading')} enKey={`aboutValue${suffix}Title`} arKey={`aboutValue${suffix}TitleAr`} value={value} onChange={onChange} />
                                <LocalizedFields label={tx('الوصف', 'Description')} enKey={`aboutValue${suffix}Desc`} arKey={`aboutValue${suffix}DescAr`} value={value} onChange={onChange} multiline />
                            </div>
                        </div>
                    );
                })}
            </SectionCard>

            <SectionCard title={tx('دعوة التواصل', 'Contact call to action')} description={tx('الدعوة الأخيرة للتواصل، مع نص الزر ورابطه.', 'The closing contact message, button label and link.')} enabledKey="aboutCtaEnabled" value={value} onChange={onChange} showLabel={tx('إظهار', 'Show')}>
                <LocalizedFields label={tx('الشارة الصغيرة', 'Eyebrow')} enKey="aboutCtaEyebrow" arKey="aboutCtaEyebrowAr" value={value} onChange={onChange} />
                <LocalizedFields label={tx('العنوان', 'Heading')} enKey="aboutCtaTitle" arKey="aboutCtaTitleAr" value={value} onChange={onChange} />
                <div className="grid gap-4 md:grid-cols-2">
                    <LocalizedFields label={tx('نص الزر', 'Button label')} enKey="aboutCtaButtonLabel" arKey="aboutCtaButtonLabelAr" value={value} onChange={onChange} />
                    <UrlField label={tx('رابط الزر', 'Button link')} id="aboutCtaUrl" value={value} onChange={onChange} />
                </div>
            </SectionCard>

            <SectionCard title={tx('نتائج البحث', 'Search metadata')} description={tx('عنوان ووصف الصفحة اللذان يظهران في نتائج البحث.', 'The page title and description shown in search results.')} value={value} onChange={onChange}>
                <div className="mb-1 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200"><Search className="size-4" />{tx('بيانات SEO', 'SEO details')}</div>
                <LocalizedFields label={tx('عنوان الصفحة', 'Page title')} enKey="aboutSeoTitle" arKey="aboutSeoTitleAr" value={value} onChange={onChange} />
                <LocalizedFields label={tx('وصف الصفحة', 'Page description')} enKey="aboutSeoDescription" arKey="aboutSeoDescriptionAr" value={value} onChange={onChange} multiline />
            </SectionCard>
            <div className="flex items-center gap-2 px-1 text-xs text-slate-500 dark:text-slate-400"><ImageIcon className="size-4" /><Sparkles className="size-4" />{tx('يمكن استخدام رابط صورة عام أو مسار ملف موجود ضمن مجلد uploads بالموقع.', 'Upload an image or use an existing public URL or uploads path.')}</div>
        </div>
    );
}

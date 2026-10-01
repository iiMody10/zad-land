"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import PlatformIcon from '@/app/components/PlatformIcon';
import { toWhatsAppUrl } from '@/lib/business-contact';

interface FooterCategoryOption {
    id: string;
    name: string;
}

interface FooterContentSectionProps {
    footerContent: Record<string, string>;
    categories: FooterCategoryOption[];
    onFieldChange: (field: string, value: string) => void;
    t: (key: string) => string;
}

function SectionTitle({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
            {description ? (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
            ) : null}
        </div>
    );
}

function TextField({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/15"
            />
        </div>
    );
}

function TextAreaField({
    label,
    value,
    onChange,
    rows = 4,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">{label}</label>
            <textarea
                rows={rows}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full resize-none rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/15"
            />
        </div>
    );
}

function SelectField({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: FooterCategoryOption[];
    onChange: (value: string) => void;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/15 cursor-pointer"
            >
                <option value="">{label}</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

function LinkEditor({
    title,
    labelValue,
    labelArValue,
    urlValue,
    onFieldChange,
    labelKey,
    labelArKey,
    urlKey,
    t,
}: {
    title: string;
    labelValue: string;
    labelArValue: string;
    urlValue: string;
    onFieldChange: (field: string, value: string) => void;
    labelKey: string;
    labelArKey: string;
    urlKey: string;
    t: (key: string) => string;
}) {
    return (
        <div className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-gray-800/40 p-4">
            <p className="mb-3 text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">{title}</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <TextField
                    label={`${t('admin.englishLabel') || 'English Label'}`}
                    value={labelValue}
                    onChange={(value) => onFieldChange(labelKey, value)}
                />
                <div dir="rtl">
                    <TextField
                        label={`${t('admin.arabicLabel') || 'Arabic Label'}`}
                        value={labelArValue}
                        onChange={(value) => onFieldChange(labelArKey, value)}
                    />
                </div>
                <TextField
                    label={t('admin.linkUrl') || 'Link URL'}
                    value={urlValue}
                    onChange={(value) => onFieldChange(urlKey, value)}
                    placeholder="/about-us or https://..."
                />
            </div>
        </div>
    );
}

export default function FooterContentSection({
    footerContent,
    categories,
    onFieldChange,
    t,
}: FooterContentSectionProps) {
    const [previewLanguage, setPreviewLanguage] = useState<'ar' | 'en'>('ar');
    const previewArabic = previewLanguage === 'ar';
    const localized = (englishKey: string, arabicKey: string, fallback = '') => {
        const english = footerContent[englishKey] || fallback;
        const arabic = footerContent[arabicKey] || english || fallback;
        return previewArabic ? arabic : english || arabic;
    };
    const selectedCategories = [1, 2, 3, 4]
        .map((slot) => categories.find((category) => category.id === footerContent[`footerCategory${slot}Id`]))
        .filter((category): category is FooterCategoryOption => Boolean(category));
    const previewSocialLinks = ([
        { platform: 'instagram' as const, href: footerContent.footerInstagramUrl, label: 'Instagram' },
        { platform: 'facebook' as const, href: footerContent.footerFacebookUrl, label: 'Facebook' },
        { platform: 'whatsapp' as const, href: footerContent.footerWhatsappUrl && footerContent.footerWhatsappUrl !== '#' ? footerContent.footerWhatsappUrl : toWhatsAppUrl(footerContent.footerPhone), label: 'WhatsApp' },
    ]).filter((social) => social.href.trim() && social.href.trim() !== '#');
    const companyLinks = [1, 2, 3].map((slot) => localized(
        `footerCompanyLink${slot}Label`,
        `footerCompanyLink${slot}LabelAr`,
        [previewArabic ? 'من نحن' : 'About Us', previewArabic ? 'علاماتنا التجارية' : 'Our Brands', previewArabic ? 'تواصل معنا' : 'Contact Us'][slot - 1],
    ));
    const supportLinks = [1, 2, 3].flatMap((slot) => {
        const label = localized(`footerSupportLink${slot}Label`, `footerSupportLink${slot}LabelAr`);
        const href = footerContent[`footerSupportLink${slot}Url`];
        return label && href && href !== '#' ? [{ label, href }] : [];
    });
    [
        { en: 'Shipping & Returns', ar: 'الشحن والتوصيل', href: '/shipping-returns' },
        { en: 'Privacy Policy', ar: 'سياسة الخصوصية', href: '/privacy-policy' },
    ].forEach((fallback) => {
        if (!supportLinks.some((link) => link.href.replace(/\/$/, '') === fallback.href)) {
            supportLinks.push({ label: previewArabic ? fallback.ar : fallback.en, href: fallback.href });
        }
    });

    return (
        <div className="space-y-8">
            {/* Live preview */}
            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-white/10 dark:bg-[var(--color-surface-dark)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 px-6 py-4 dark:border-white/10 md:px-8">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">معاينة مباشرة للتذييل</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">تتحدث المعاينة تلقائياً مع تعديل الحقول أدناه.</p>
                    </div>
                    <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-gray-800" aria-label="Preview language">
                        <button type="button" onClick={() => setPreviewLanguage('ar')} className={`rounded-md px-3 py-1.5 text-xs font-bold ${previewArabic ? 'bg-white text-slate-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-slate-500'}`}>العربية</button>
                        <button type="button" onClick={() => setPreviewLanguage('en')} className={`rounded-md px-3 py-1.5 text-xs font-bold ${!previewArabic ? 'bg-white text-slate-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-slate-500'}`}>English</button>
                    </div>
                </div>
                <div dir={previewArabic ? 'rtl' : 'ltr'} className="relative overflow-hidden bg-[#073b2d] px-5 py-8 text-white md:px-8">
                    <div className="pointer-events-none absolute inset-0 bg-[url('/images/footer-bg.webp')] bg-cover bg-center opacity-25" />
                    <div className="relative grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
                        <div className="text-center lg:text-start">
                            <div className="mb-3 text-xl font-black text-amber-300">{localized('footerBrandTitle', 'footerBrandTitleAr', 'زاد لاند')}</div>
                            <p className="text-xs leading-6 text-white/75">{localized('footerBrandDescription', 'footerBrandDescriptionAr')}</p>
                            {previewSocialLinks.length > 0 ? (
                                <div className="mt-3 flex justify-center gap-2 lg:justify-start">
                                    {previewSocialLinks.map((social) => <a key={social.platform} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="flex size-7 items-center justify-center rounded-full border border-amber-300/40 text-amber-200 transition-colors hover:bg-amber-300/15"><PlatformIcon platform={social.platform} className="size-3.5" /></a>)}
                                </div>
                            ) : (
                                <p className="mt-3 text-[11px] text-white/65">
                                    {previewArabic ? 'أضف روابط حساباتك من ' : 'Add your social links in '}
                                    <Link href="/admin/site-content?tab=business" className="font-bold text-amber-200 underline underline-offset-2">
                                        {previewArabic ? 'بيانات التواصل العامة' : 'Global Contact Details'}
                                    </Link>
                                    {previewArabic ? ' لتظهر للزوار.' : ' to display them to visitors.'}
                                </p>
                            )}
                        </div>
                        <PreviewColumn title={localized('footerCompanyTitle', 'footerCompanyTitleAr', previewArabic ? 'عن الشركة' : 'Company')} items={companyLinks} />
                        <PreviewColumn title={localized('footerSupportTitle', 'footerSupportTitleAr', previewArabic ? 'الدعم والسياسات' : 'Support & Policies')} items={supportLinks.map((link) => link.label)} />
                        <PreviewColumn title={localized('footerShopTitle', 'footerShopTitleAr', previewArabic ? 'المتجر' : 'Shop')} items={selectedCategories.length ? selectedCategories.map((category) => category.name) : [previewArabic ? 'جميع المنتجات' : 'All products']} />
                        <div className="text-center lg:text-start">
                            <h4 className="mb-3 text-sm font-extrabold text-amber-300">{localized('footerContactTitle', 'footerContactTitleAr', previewArabic ? 'معلومات التواصل' : 'Contact Information')}</h4>
                            <div className="space-y-2.5 text-xs text-white/85">
                                {localized('footerAddress', 'footerAddressAr') && <p className="flex items-center justify-center gap-2 lg:justify-start"><MapPin className="size-3.5 shrink-0 text-amber-300" />{localized('footerAddress', 'footerAddressAr')}</p>}
                                {footerContent.footerPhone && <p className="flex items-center justify-center gap-2 lg:justify-start"><Phone className="size-3.5 shrink-0 text-amber-300" /><span dir="ltr">{footerContent.footerPhone}</span></p>}
                                {footerContent.footerEmail && <p className="flex items-center justify-center gap-2 lg:justify-start"><Mail className="size-3.5 shrink-0 text-amber-300" />{footerContent.footerEmail}</p>}
                                {footerContent.footerWhatsappUrl && footerContent.footerWhatsappUrl !== '#' && <p className="pt-1 font-bold text-amber-200">{localized('footerWhatsappLabel', 'footerWhatsappLabelAr', previewArabic ? 'تواصل معنا عبر واتساب' : 'Chat on WhatsApp')}</p>}
                            </div>
                        </div>
                        <div className="text-center lg:text-start">
                            <h4 className="mb-2 text-sm font-extrabold text-amber-300">{previewArabic ? 'جودة عالمية' : 'Global Quality'}</h4>
                            <p className="text-xs text-white/75">{previewArabic ? 'في خدمة السوق السوري' : 'Serving the Syrian market'}</p>
                        </div>
                    </div>
                    <div className="relative mt-7 border-t border-amber-300/30 pt-3 text-center text-[11px] text-white/70">{localized('footerCopyright', 'footerCopyrightAr')}</div>
                </div>
            </section>

            {/* Branding Section */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[var(--color-surface-dark)] p-6 md:p-8 shadow-xs">
                <SectionTitle
                    title={t('admin.footerBranding') || 'Footer Branding'}
                    description={t('admin.footerBrandingDescription') || 'Edit brand title, company description, and copyright note in the footer.'}
                />

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                        <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-md text-slate-700 dark:text-slate-300">
                            🇬🇧 English Content
                        </span>
                        <TextField
                            label={t('admin.brandName') || 'Brand Name'}
                            value={footerContent.footerBrandTitle}
                            onChange={(value) => onFieldChange('footerBrandTitle', value)}
                        />
                        <TextAreaField
                            label={t('admin.description')}
                            value={footerContent.footerBrandDescription}
                            onChange={(value) => onFieldChange('footerBrandDescription', value)}
                            rows={3}
                        />
                        <TextField
                            label={t('admin.copyrightText') || 'Copyright Text'}
                            value={footerContent.footerCopyright}
                            onChange={(value) => onFieldChange('footerCopyright', value)}
                        />
                    </div>

                    <div className="space-y-4" dir="rtl">
                        <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-md text-slate-700 dark:text-slate-300">
                            🇸🇦 المحتوى العربي
                        </span>
                        <TextField
                            label={t('admin.brandName') || 'اسم العلامة'}
                            value={footerContent.footerBrandTitleAr}
                            onChange={(value) => onFieldChange('footerBrandTitleAr', value)}
                        />
                        <TextAreaField
                            label={t('admin.description') || 'النبذة'}
                            value={footerContent.footerBrandDescriptionAr}
                            onChange={(value) => onFieldChange('footerBrandDescriptionAr', value)}
                            rows={3}
                        />
                        <TextField
                            label={t('admin.copyrightText') || 'حقوق النشر'}
                            value={footerContent.footerCopyrightAr}
                            onChange={(value) => onFieldChange('footerCopyrightAr', value)}
                        />
                    </div>
                </div>
            </div>

            {/* Contact Information Section */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[var(--color-surface-dark)] md:p-8">
                <SectionTitle
                    title="معلومات التواصل"
                    description="حرر عناوين قسم التواصل والعنوان ونص رابط واتساب. تُدار أرقام الهاتف والبريد والروابط الاجتماعية مرة واحدة من تبويب بيانات التواصل العامة."
                />
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                        <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">🇬🇧 English</span>
                        <TextField label="Section heading" value={footerContent.footerContactTitle} onChange={(value) => onFieldChange('footerContactTitle', value)} />
                        <TextField label="Address" value={footerContent.footerAddress} onChange={(value) => onFieldChange('footerAddress', value)} />
                        <TextField label="WhatsApp link text" value={footerContent.footerWhatsappLabel} onChange={(value) => onFieldChange('footerWhatsappLabel', value)} />
                    </div>
                    <div dir="rtl" className="space-y-4">
                        <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">🇸🇦 العربية</span>
                        <TextField label="عنوان القسم" value={footerContent.footerContactTitleAr} onChange={(value) => onFieldChange('footerContactTitleAr', value)} />
                        <TextField label="العنوان" value={footerContent.footerAddressAr} onChange={(value) => onFieldChange('footerAddressAr', value)} />
                        <TextField label="نص رابط واتساب" value={footerContent.footerWhatsappLabelAr} onChange={(value) => onFieldChange('footerWhatsappLabelAr', value)} />
                    </div>
                </div>
            </div>

            {/* Shop Categories Section */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[var(--color-surface-dark)] p-6 md:p-8 shadow-xs">
                <SectionTitle
                    title={t('admin.footerShopSection') || 'Shop Categories Column'}
                    description={t('admin.footerShopSectionDescription') || 'Rename the shop column and select up to 4 quick shortcut categories.'}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <TextField
                        label={`${t('admin.englishLabel') || 'English Label'} (${t('admin.title') || 'Heading'})`}
                        value={footerContent.footerShopTitle}
                        onChange={(value) => onFieldChange('footerShopTitle', value)}
                    />
                    <div dir="rtl">
                        <TextField
                            label={`${t('admin.arabicLabel') || 'Arabic Label'} (${t('admin.title') || 'العنوان'})`}
                            value={footerContent.footerShopTitleAr}
                            onChange={(value) => onFieldChange('footerShopTitleAr', value)}
                        />
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    <SelectField
                        label={`${t('admin.footerCategorySlot') || 'Slot'} 1`}
                        value={footerContent.footerCategory1Id}
                        options={categories}
                        onChange={(value) => onFieldChange('footerCategory1Id', value)}
                    />
                    <SelectField
                        label={`${t('admin.footerCategorySlot') || 'Slot'} 2`}
                        value={footerContent.footerCategory2Id}
                        options={categories}
                        onChange={(value) => onFieldChange('footerCategory2Id', value)}
                    />
                    <SelectField
                        label={`${t('admin.footerCategorySlot') || 'Slot'} 3`}
                        value={footerContent.footerCategory3Id}
                        options={categories}
                        onChange={(value) => onFieldChange('footerCategory3Id', value)}
                    />
                    <SelectField
                        label={`${t('admin.footerCategorySlot') || 'Slot'} 4`}
                        value={footerContent.footerCategory4Id}
                        options={categories}
                        onChange={(value) => onFieldChange('footerCategory4Id', value)}
                    />
                </div>
            </div>

            {/* Support Links Section */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[var(--color-surface-dark)] p-6 md:p-8 shadow-xs">
                <SectionTitle
                    title={t('admin.footerSupportSection') || 'Customer Support Column'}
                    description={t('admin.footerSupportSectionDescription') || 'Edit heading and quick links for customer support and policies.'}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
                    <TextField
                        label={`${t('admin.englishLabel') || 'English Label'} (${t('admin.title') || 'Heading'})`}
                        value={footerContent.footerSupportTitle}
                        onChange={(value) => onFieldChange('footerSupportTitle', value)}
                    />
                    <div dir="rtl">
                        <TextField
                            label={`${t('admin.arabicLabel') || 'Arabic Label'} (${t('admin.title') || 'العنوان'})`}
                            value={footerContent.footerSupportTitleAr}
                            onChange={(value) => onFieldChange('footerSupportTitleAr', value)}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <LinkEditor
                        title={`${t('admin.footerLinkItem') || 'Link'} 1`}
                        labelValue={footerContent.footerSupportLink1Label}
                        labelArValue={footerContent.footerSupportLink1LabelAr}
                        urlValue={footerContent.footerSupportLink1Url}
                        onFieldChange={onFieldChange}
                        labelKey="footerSupportLink1Label"
                        labelArKey="footerSupportLink1LabelAr"
                        urlKey="footerSupportLink1Url"
                        t={t}
                    />
                    <LinkEditor
                        title={`${t('admin.footerLinkItem') || 'Link'} 2`}
                        labelValue={footerContent.footerSupportLink2Label}
                        labelArValue={footerContent.footerSupportLink2LabelAr}
                        urlValue={footerContent.footerSupportLink2Url}
                        onFieldChange={onFieldChange}
                        labelKey="footerSupportLink2Label"
                        labelArKey="footerSupportLink2LabelAr"
                        urlKey="footerSupportLink2Url"
                        t={t}
                    />
                    <LinkEditor
                        title={`${t('admin.footerLinkItem') || 'Link'} 3`}
                        labelValue={footerContent.footerSupportLink3Label}
                        labelArValue={footerContent.footerSupportLink3LabelAr}
                        urlValue={footerContent.footerSupportLink3Url}
                        onFieldChange={onFieldChange}
                        labelKey="footerSupportLink3Label"
                        labelArKey="footerSupportLink3LabelAr"
                        urlKey="footerSupportLink3Url"
                        t={t}
                    />
                </div>
            </div>

            {/* Company Links Section */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[var(--color-surface-dark)] p-6 md:p-8 shadow-xs">
                <SectionTitle
                    title={t('admin.footerCompanySection') || 'Company Information Column'}
                    description={t('admin.footerCompanySectionDescription') || 'Edit company column heading and up to three footer links.'}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
                    <TextField
                        label={`${t('admin.englishLabel') || 'English Label'} (${t('admin.title') || 'Heading'})`}
                        value={footerContent.footerCompanyTitle}
                        onChange={(value) => onFieldChange('footerCompanyTitle', value)}
                    />
                    <div dir="rtl">
                        <TextField
                            label={`${t('admin.arabicLabel') || 'Arabic Label'} (${t('admin.title') || 'العنوان'})`}
                            value={footerContent.footerCompanyTitleAr}
                            onChange={(value) => onFieldChange('footerCompanyTitleAr', value)}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <LinkEditor
                        title={`${t('admin.footerLinkItem') || 'Link'} 1`}
                        labelValue={footerContent.footerCompanyLink1Label}
                        labelArValue={footerContent.footerCompanyLink1LabelAr}
                        urlValue={footerContent.footerCompanyLink1Url}
                        onFieldChange={onFieldChange}
                        labelKey="footerCompanyLink1Label"
                        labelArKey="footerCompanyLink1LabelAr"
                        urlKey="footerCompanyLink1Url"
                        t={t}
                    />
                    <LinkEditor
                        title={`${t('admin.footerLinkItem') || 'Link'} 2`}
                        labelValue={footerContent.footerCompanyLink2Label}
                        labelArValue={footerContent.footerCompanyLink2LabelAr}
                        urlValue={footerContent.footerCompanyLink2Url}
                        onFieldChange={onFieldChange}
                        labelKey="footerCompanyLink2Label"
                        labelArKey="footerCompanyLink2LabelAr"
                        urlKey="footerCompanyLink2Url"
                        t={t}
                    />
                    <LinkEditor
                        title={`${t('admin.footerLinkItem') || 'Link'} 3`}
                        labelValue={footerContent.footerCompanyLink3Label}
                        labelArValue={footerContent.footerCompanyLink3LabelAr}
                        urlValue={footerContent.footerCompanyLink3Url}
                        onFieldChange={onFieldChange}
                        labelKey="footerCompanyLink3Label"
                        labelArKey="footerCompanyLink3LabelAr"
                        urlKey="footerCompanyLink3Url"
                        t={t}
                    />
                </div>
            </div>
        </div>
    );
}

function PreviewColumn({ title, items }: { title: string; items: string[] }) {
    return <div className="text-center lg:text-start">
        <h4 className="mb-3 text-sm font-extrabold text-amber-300">{title}</h4>
        <ul className="space-y-2 text-xs text-white/80">{items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
    </div>;
}

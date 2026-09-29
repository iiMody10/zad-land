'use client';

import React, { useState } from 'react';
import PlatformIcon from '@/app/components/PlatformIcon';
import { Phone as LuPhone, Mail as LuMail, MapPin as LuMapPin, Clock as LuClock, Send as LuSend, CircleCheck as IoCheckmarkCircle } from 'lucide-react';
import type { ContactPageContent } from '@/lib/contact-page-content';

interface ContactClientProps {
    language: 'ar' | 'en';
    dir: 'rtl' | 'ltr';
    content: ContactPageContent;
    settings: {
        footerWhatsappUrl?: string | null;
        footerFacebookUrl?: string | null;
        footerInstagramUrl?: string | null;
        footerEmail?: string | null;
    } | null;
}

export default function ContactClient({ language, dir, content, settings }: ContactClientProps) {
    const isAr = language === 'ar';
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', businessName: '', phone: '', message: '' });
    const copy = (key: string) => content[`${key}${isAr ? 'Ar' : 'En'}` as keyof ContactPageContent] as string;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 600);
    };

    const whatsappUrl = settings?.footerWhatsappUrl && settings.footerWhatsappUrl !== '#'
        ? settings.footerWhatsappUrl
        : 'https://wa.me/';

    return (
        <div className="min-h-screen bg-[var(--color-canvas)] py-8 dark:bg-[#141410] md:py-14" dir={dir}>
            <div className="container-custom max-w-5xl">
                {content.heroEnabled && <header className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100/70 px-3.5 py-1 text-xs font-bold text-[var(--color-accent)] dark:bg-amber-950/40 dark:text-[var(--color-accent-light)]">
                        <LuPhone className="text-sm" />
                        <span>{copy('heroBadge')}</span>
                    </div>
                    <h1 className="mb-3 text-2xl font-black text-[var(--color-brand)] dark:text-[#F5F0E0] sm:text-3xl md:text-4xl">{copy('heroTitle')}</h1>
                    <p className="text-sm leading-relaxed text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)] md:text-base">{copy('heroDescription')}</p>
                </header>}

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    {(content.whatsappEnabled || content.contactInfoEnabled || content.socialEnabled) && <aside className="space-y-4 lg:col-span-5">
                        {content.whatsappEnabled && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="group block rounded-2xl bg-emerald-600 p-6 text-white shadow-sm transition-all duration-300 hover:bg-emerald-700 hover:shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/20 text-3xl transition-transform group-hover:scale-110"><PlatformIcon platform="whatsapp" className="size-7" /></div>
                                <div><h2 className="text-base font-bold md:text-lg">{copy('whatsappTitle')}</h2><p className="mt-0.5 text-xs text-white/85">{copy('whatsappDescription')}</p></div>
                            </div>
                        </a>}

                        {content.contactInfoEnabled && (content.addressEnabled || content.hoursEnabled || content.emailEnabled) && <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[var(--color-surface-dark)]">
                            {content.addressEnabled && <InfoItem icon={<LuMapPin />} title={copy('addressTitle')} primary={copy('addressLine')} secondary={copy('addressDescription')} />}
                            {content.hoursEnabled && <InfoItem icon={<LuClock />} title={copy('hoursTitle')} primary={copy('hoursLine')} secondary={copy('hoursDescription')} />}
                            {content.emailEnabled && <InfoItem icon={<LuMail />} title={copy('emailTitle')} primary={settings?.footerEmail || ''} />}
                        </div>}

                        {content.socialEnabled && <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[var(--color-surface-dark)]">
                            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">{copy('socialTitle')}</span>
                            <div className="flex items-center gap-3">
                                {settings?.footerFacebookUrl && <SocialLink href={settings.footerFacebookUrl} platform="facebook" label="Facebook" />}
                                {settings?.footerInstagramUrl && <SocialLink href={settings.footerInstagramUrl} platform="instagram" label="Instagram" />}
                            </div>
                        </div>}
                    </aside>}

                    {content.formEnabled && <section className={`${content.whatsappEnabled || content.contactInfoEnabled || content.socialEnabled ? 'lg:col-span-7' : 'lg:col-span-12'} rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[var(--color-surface-dark)] sm:p-8`}>
                        <h2 className="mb-1 text-xl font-bold text-[var(--color-brand)] dark:text-white">{copy('formTitle')}</h2>
                        <p className="mb-6 text-xs text-slate-500 dark:text-zinc-400 sm:text-sm">{copy('formDescription')}</p>

                        {submitted ? <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-800 dark:bg-emerald-950/30">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400"><IoCheckmarkCircle /></div>
                            <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">{copy('successTitle')}</h3>
                            <p className="mx-auto max-w-md text-xs text-emerald-700 dark:text-emerald-300 sm:text-sm">{copy('successDescription')}</p>
                        </div> : <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <TextField label={copy('nameLabel')} placeholder={copy('namePlaceholder')} value={form.name} onChange={(name) => setForm((current) => ({ ...current, name }))} />
                                <TextField label={copy('businessLabel')} placeholder={copy('businessPlaceholder')} value={form.businessName} onChange={(businessName) => setForm((current) => ({ ...current, businessName }))} />
                            </div>
                            <TextField label={copy('phoneLabel')} placeholder={copy('phonePlaceholder')} value={form.phone} onChange={(phone) => setForm((current) => ({ ...current, phone }))} type="tel" />
                            <label className="block space-y-1.5 text-xs font-bold text-slate-700 dark:text-zinc-300">
                                <span>{copy('messageLabel')}</span>
                                <textarea required rows={4} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} placeholder={copy('messagePlaceholder')} className={inputClass + ' resize-none'} />
                            </label>
                            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[var(--color-accent-hover)] active:scale-[0.98] disabled:opacity-70">
                                {loading ? <span>{copy('sendingLabel')}</span> : <><LuSend className="text-base" /><span>{copy('submitLabel')}</span></>}
                            </button>
                        </form>}
                    </section>}
                </div>
            </div>
        </div>
    );
}

const inputClass = "w-full rounded-xl border border-gray-200 bg-[var(--color-canvas)] px-3.5 py-2.5 text-sm text-[var(--color-brand)] outline-none transition-all focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 dark:border-white/10 dark:bg-zinc-800 dark:text-white";

function InfoItem({ icon, title, primary, secondary }: { icon: React.ReactNode; title: string; primary: string; secondary?: string }) {
    return <div className="flex items-start gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-lg text-[var(--color-accent)] dark:bg-white/5 dark:text-[var(--color-accent-light)]">{icon}</div>
        <div><h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">{title}</h3><p className="mt-0.5 text-sm font-semibold text-[var(--color-brand)] dark:text-white">{primary}</p>{secondary && <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">{secondary}</p>}</div>
    </div>;
}

function SocialLink({ href, platform, label }: { href: string; platform: "facebook" | "instagram"; label: string }) {
    return <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-slate-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"><PlatformIcon platform={platform} className="size-4" /></a>;
}

function TextField({ label, placeholder, value, onChange, type = "text" }: { label: string; placeholder: string; value: string; onChange: (value: string) => void; type?: string }) {
    return <label className="block space-y-1.5 text-xs font-bold text-slate-700 dark:text-zinc-300"><span>{label}</span><input type={type} required value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} /></label>;
}

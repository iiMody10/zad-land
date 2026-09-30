import Link from 'next/link';
import { FileText, LockKeyhole, MessageCircle, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import { getI18n } from '@/lib/i18n';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'سياسة الخصوصية | Privacy Policy - Zad Land',
    description: 'معلومات حول البيانات التي نستخدمها لمعالجة الطلبات والتواصل مع العملاء في زاد لاند.',
    alternates: { canonical: '/privacy-policy' },
};

export default async function PrivacyPolicyPage() {
    const { t, dir } = await getI18n();
    const sections = [
        { icon: FileText, title: t('privacyPolicyPage.informationTitle'), body: t('privacyPolicyPage.informationBody') },
        { icon: LockKeyhole, title: t('privacyPolicyPage.useTitle'), body: t('privacyPolicyPage.useBody') },
        { icon: ShieldCheck, title: t('privacyPolicyPage.sharingTitle'), body: t('privacyPolicyPage.sharingBody') },
        { icon: MessageCircle, title: t('privacyPolicyPage.choicesTitle'), body: t('privacyPolicyPage.choicesBody') },
    ];

    return (
        <main className="container-custom flex-1 px-4 py-12 md:py-20" dir={dir}>
            <div className="mx-auto max-w-4xl">
                <nav className="mb-8 text-sm text-slate-500">
                    <Link href="/" className="transition-colors hover:text-[var(--color-brand)]">{t('common.home')}</Link>
                    <span className="mx-2" aria-hidden="true">/</span>
                    <span className="font-semibold text-[var(--color-brand)]">{t('privacyPolicyPage.title')}</span>
                </nav>

                <header className="rounded-3xl bg-[var(--color-brand)] px-6 py-9 text-white shadow-sm md:px-10 md:py-12">
                    <span className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 text-[var(--color-accent-light)]">
                        <LockKeyhole className="size-6" aria-hidden="true" />
                    </span>
                    <h1 className="text-3xl font-black leading-tight md:text-5xl">{t('privacyPolicyPage.title')}</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75 md:text-base">{t('privacyPolicyPage.intro')}</p>
                </header>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {sections.map(({ icon: Icon, title, body }, index) => (
                        <section key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[var(--color-surface-dark)] md:p-6">
                            <div className="mb-4 flex items-center gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand)]/8 text-[var(--color-brand)] dark:text-[var(--color-accent-light)]">
                                    <Icon className="size-5" aria-hidden="true" />
                                </span>
                                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{title}</h2>
                            </div>
                            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{body}</p>
                            <span className="mt-4 block text-xs font-bold text-[var(--color-accent)]">{String(index + 1).padStart(2, '0')}</span>
                        </section>
                    ))}
                </div>

                <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-[var(--color-brand)]/10 bg-slate-50 p-5 dark:bg-white/5 md:flex-row md:items-center md:justify-between md:p-6">
                    <div>
                        <h2 className="font-extrabold text-slate-900 dark:text-white">{t('privacyPolicyPage.contactTitle')}</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{t('privacyPolicyPage.contactBody')}</p>
                    </div>
                    <Link href="/contact" className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--color-brand-hover)]">
                        {t('privacyPolicyPage.contactCta')}
                    </Link>
                </section>
            </div>
        </main>
    );
}

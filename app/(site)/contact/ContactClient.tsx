'use client';

import React, { useState } from 'react';
import { MessageCircle as FaWhatsapp, ThumbsUp as FaFacebook, Camera as FaInstagram } from 'lucide-react';
import { Phone as LuPhone, Mail as LuMail, MapPin as LuMapPin, Clock as LuClock, Send as LuSend } from 'lucide-react';
import { CircleCheck as IoCheckmarkCircle } from 'lucide-react';

interface ContactSettings {
    footerWhatsappUrl?: string | null;
    footerFacebookUrl?: string | null;
    footerInstagramUrl?: string | null;
}

interface ContactClientProps {
    language: 'ar' | 'en';
    dir: 'rtl' | 'ltr';
    settings: ContactSettings | null;
}

export default function ContactClient({ language, dir, settings }: ContactClientProps) {
    const isAr = language === 'ar';
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        businessName: '',
        phone: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 600);
    };

    const whatsappUrl =
        settings?.footerWhatsappUrl && settings.footerWhatsappUrl !== '#'
            ? settings.footerWhatsappUrl
            : 'https://wa.me/';

    return (
        <div className="bg-[var(--color-canvas)] dark:bg-[#141410] min-h-screen py-8 md:py-14" dir={dir}>
            <div className="container-custom max-w-5xl">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/70 text-[var(--color-accent)] dark:bg-amber-950/40 dark:text-[var(--color-accent-light)] text-xs font-bold mb-3">
                        <LuPhone className="text-sm" />
                        <span>{isAr ? 'خدمة عملاء وتوريد الجملة' : 'Wholesale Support & Sales'}</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--color-brand)] dark:text-[#F5F0E0] mb-3">
                        {isAr ? 'تواصل معنا - شركة زاد لاند' : 'Contact Zad Land Wholesale'}
                    </h1>

                    <p className="text-sm md:text-base text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)] leading-relaxed">
                        {isAr
                            ? 'فريق مبيعات الجملة والتوزيع جاهز للرد على استفساراتكم وتزويدكم بعروض الأسعار وجداول التسليم لكافة المحافظات.'
                            : 'Our wholesale sales & distribution team is ready to assist your business with customized supply quotes and scheduled deliveries.'}
                    </p>

                    {/* Signature Ornamental Divider */}
                    <div className="flex items-center justify-center gap-3 mt-4 text-[var(--color-accent)] opacity-80 select-none">
                        <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--color-accent)]" />
                        <span>🌾</span>
                        <span className="text-xs font-bold tracking-wider">ZAD LAND</span>
                        <span>🌾</span>
                        <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--color-accent)]" />
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Contact Info Column */}
                    <div className="lg:col-span-5 space-y-4">
                        {/* Direct WhatsApp Action Card */}
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 shadow-sm hover:shadow-md group block"
                        >
                            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                                <FaWhatsapp />
                            </div>
                            <div>
                                <h2 className="font-bold text-base md:text-lg">
                                    {isAr ? 'محادثة مباشرة عبر واتساب' : 'Chat via WhatsApp'}
                                </h2>
                                <p className="text-xs text-white/85 mt-0.5">
                                    {isAr
                                        ? 'استجابة فورية لطلبات الجملة وقوائم الأسعار'
                                        : 'Instant response for wholesale quotes'}
                                </p>
                            </div>
                        </a>

                        {/* Info Card */}
                        <div className="bg-white dark:bg-[var(--color-surface-dark)] rounded-2xl border border-gray-100 dark:border-white/10 p-6 space-y-6 shadow-xs">
                            <div className="flex items-start gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-white/5 text-[var(--color-accent)] dark:text-[var(--color-accent-light)] flex items-center justify-center shrink-0 text-lg">
                                    <LuMapPin />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                        {isAr ? 'المقر الرئيسي والمستودعات' : 'Headquarters & Warehouses'}
                                    </h3>
                                    <p className="text-sm font-semibold text-[var(--color-brand)] dark:text-white mt-0.5">
                                        {isAr ? 'المنطقة الصناعية - حمص، سوريا' : 'Industrial Area - Homs, Syria'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                                        {isAr ? 'أسطول توزيع يغطي كافة المحافظات' : 'Logistics fleet covering all governorates'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-white/5 text-[var(--color-accent)] dark:text-[var(--color-accent-light)] flex items-center justify-center shrink-0 text-lg">
                                    <LuClock />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                        {isAr ? 'أوقات العمل والتوزيع' : 'Operating Hours'}
                                    </h3>
                                    <p className="text-sm font-semibold text-[var(--color-brand)] dark:text-white mt-0.5">
                                        {isAr ? 'السبت - الخميس: ٨:٠٠ ص - ٦:٠٠ م' : 'Sat - Thu: 8:00 AM - 6:00 PM'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                                        {isAr ? 'استقبال طلبات الشحن على مدار الساعة' : '24/7 order dispatch processing'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-white/5 text-[var(--color-accent)] dark:text-[var(--color-accent-light)] flex items-center justify-center shrink-0 text-lg">
                                    <LuMail />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                        {isAr ? 'البريد الإلكتروني التجاري' : 'Commercial Email'}
                                    </h3>
                                    <p className="text-sm font-semibold text-[var(--color-brand)] dark:text-white mt-0.5">
                                        info@zadland.com
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white dark:bg-[var(--color-surface-dark)] rounded-2xl border border-gray-100 dark:border-white/10 p-5 flex items-center justify-between shadow-xs">
                            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">
                                {isAr ? 'تابع صفحاتنا الرسمية:' : 'Follow Official Channels:'}
                            </span>
                            <div className="flex items-center gap-3">
                                {settings?.footerFacebookUrl && (
                                    <a
                                        href={settings.footerFacebookUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                        aria-label="Facebook"
                                    >
                                        <FaFacebook className="text-base" />
                                    </a>
                                )}
                                {settings?.footerInstagramUrl && (
                                    <a
                                        href={settings.footerInstagramUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                        aria-label="Instagram"
                                    >
                                        <FaInstagram className="text-base" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Inquiry Form Column */}
                    <div className="lg:col-span-7 bg-white dark:bg-[var(--color-surface-dark)] rounded-2xl border border-gray-100 dark:border-white/10 p-6 sm:p-8 shadow-xs">
                        <h2 className="text-xl font-bold text-[var(--color-brand)] dark:text-white mb-1">
                            {isAr ? 'طلب تسعير أو استفسار جملة' : 'Request Wholesale Quote'}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mb-6">
                            {isAr
                                ? 'أرسل تفاصيل نشاطك التجاري وسيتواصل معك مندوب المبيعات المعتمد فوراً.'
                                : 'Fill out your business details and our dedicated sales representative will reach out promptly.'}
                        </p>

                        {submitted ? (
                            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                                    <IoCheckmarkCircle />
                                </div>
                                <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                                    {isAr ? 'تم استلام طلبكم بنجاح!' : 'Inquiry Received Successfully!'}
                                </h3>
                                <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                                    {isAr
                                        ? 'شكراً لتواصلكم مع شركة زاد لاند. سيقوم فريق المبيعات بالتواصل معكم في أقرب وقت.'
                                        : 'Thank you for reaching out to Zad Land. Our wholesale sales team will contact you shortly.'}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                                            {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            placeholder={isAr ? 'محمد خالد' : 'John Doe'}
                                            className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-[var(--color-canvas)] dark:bg-zinc-800 px-3.5 py-2.5 text-sm text-[var(--color-brand)] dark:text-white outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                                            {isAr ? 'اسم المتجر / الشركة *' : 'Business / Store Name *'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={form.businessName}
                                            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                                            placeholder={isAr ? 'سوبرماركت الأمانة' : 'Al-Amana Supermarket'}
                                            className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-[var(--color-canvas)] dark:bg-zinc-800 px-3.5 py-2.5 text-sm text-[var(--color-brand)] dark:text-white outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                                        {isAr ? 'رقم الهاتف أو الواتساب *' : 'Phone or WhatsApp Number *'}
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        placeholder="+963..."
                                        className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-[var(--color-canvas)] dark:bg-zinc-800 px-3.5 py-2.5 text-sm text-[var(--color-brand)] dark:text-white outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                                        {isAr ? 'تفاصيل الطلب أو الاستفسار *' : 'Inquiry / Order Details *'}
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        placeholder={
                                            isAr
                                                ? 'اكتب المنتجات أو الكميات المطلوبة والمحافظة...'
                                                : 'Specify products, quantities needed, and location...'
                                        }
                                        className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-[var(--color-canvas)] dark:bg-zinc-800 px-3.5 py-2.5 text-sm text-[var(--color-brand)] dark:text-white outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-6 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 shadow-sm cursor-pointer disabled:opacity-70"
                                >
                                    {loading ? (
                                        <span>{isAr ? 'جاري الإرسال...' : 'Sending...'}</span>
                                    ) : (
                                        <>
                                            <LuSend className="text-base" />
                                            <span>{isAr ? 'إرسال طلب التسعير' : 'Submit Wholesale Inquiry'}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

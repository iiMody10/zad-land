'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft as LuArrowLeft, ArrowRight as LuArrowRight, CalendarDays as LuCalendar, Tag as LuTag, PackageCheck as LuPackageCheck } from 'lucide-react';

interface NewsClientProps {
    language: 'ar' | 'en';
    dir: 'rtl' | 'ltr';
}

export default function NewsClient({ language, dir }: NewsClientProps) {
    const isAr = language === 'ar';

    const newsItems = [
        {
            id: '1',
            title: isAr
                ? 'وصول شحنات كبرى من معكرونة دي سيكو الإيطالية الأصلية'
                : 'Arrival of Fresh Bulk Shipments of Authentic Italian De Cecco Pasta',
            summary: isAr
                ? 'وصلت إلى مستودعاتنا المركزية شحنات طازجة من عبوات وكراتين معكرونة دي سيكو بكافة أصنافها لتلبية طلبات الجملة للمتاجر والمطاعم.'
                : 'Fresh bulk containers of premium De Cecco pasta varieties have arrived at our central warehouses, ready for direct commercial distribution.',
            date: isAr ? '١٢ سبتمبر ٢٠٢٦' : 'Sep 12, 2026',
            category: isAr ? 'توريد وشحنات' : 'Supply & Shipments',
            tag: isAr ? 'دي سيكو' : 'De Cecco',
            link: '/products',
        },
        {
            id: '2',
            title: isAr
                ? 'توسيع أسطول النقل المبرد لتغطية شاملة لكافة المحافظات'
                : 'Expansion of Temperature-Controlled Fleet Across All Governorates',
            summary: isAr
                ? 'في إطار التزامنا بضمان وصول البضائع بأعلى معايير الجودة والسلامة الغذائية، تم تعزيز أسطول التوزيع بشاحنات مبردة حديثة.'
                : 'As part of our commitment to certified product safety, Zad Land has added modern refrigerated transport units to its distribution fleet.',
            date: isAr ? '٨ سبتمبر ٢٠٢٦' : 'Sep 08, 2026',
            category: isAr ? 'لوجستيات وتوزيع' : 'Logistics',
            tag: isAr ? 'أسطول زاد لاند' : 'Fleet',
            link: '/shipping-returns',
        },
        {
            id: '3',
            title: isAr
                ? 'شراكات توريد حصرية ومباشرة مع كبرى المصانع العالمية'
                : 'New Direct Partnerships with International Food Manufacturers',
            summary: isAr
                ? 'عقدت شركة زاد لاند اتفاقيات توريد وتوزيع رسمية مع علامات تجارية عالمية رائدة لتأمين أفضل أسعار الجملة للتجار والشركاء.'
                : 'Zad Land has signed direct authorized wholesale distribution agreements with world-class FMCG manufacturers, delivering optimal wholesale pricing.',
            date: isAr ? '١ سبتمبر ٢٠٢٦' : 'Sep 01, 2026',
            category: isAr ? 'شراكات تجارية' : 'Partnerships',
            tag: isAr ? 'شركاؤنا' : 'Partners',
            link: '/brands',
        },
    ];

    return (
        <div className="bg-[var(--color-canvas)] dark:bg-[#141410] min-h-screen py-8 md:py-14" dir={dir}>
            <div className="container-custom">
                {/* Header Title Section */}
                <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/70 text-[var(--color-accent)] dark:bg-amber-950/40 dark:text-[var(--color-accent-light)] text-xs font-bold mb-3">
                        <LuPackageCheck className="text-sm" />
                        <span>{isAr ? 'مستجدات التوريد والجملة' : 'Supply & Wholesale News'}</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--color-brand)] dark:text-[#F5F0E0] mb-3">
                        {isAr ? 'أخبار شركة زاد لاند' : 'Zad Land News & Announcements'}
                    </h1>

                    <p className="text-sm md:text-base text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)] leading-relaxed">
                        {isAr
                            ? 'تابع وصول الحاويات والشحنات الطازجة، أسعار الجملة التنافسية، وآخر الشراكات الرسمية مع كبرى الشركات العالمية.'
                            : 'Stay updated on fresh container arrivals, competitive wholesale pricing, and official partnerships with global manufacturers.'}
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

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newsItems.map((item) => (
                        <article
                            key={item.id}
                            className="bg-white dark:bg-[var(--color-surface-dark)] rounded-2xl border border-gray-100 dark:border-white/10 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-4 text-xs font-semibold">
                                    <span className="px-2.5 py-1 rounded-lg bg-[var(--color-canvas)] dark:bg-white/5 text-[var(--color-accent)] dark:text-[var(--color-accent-light)]">
                                        {item.category}
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-400 dark:text-zinc-500">
                                        <LuCalendar className="text-xs" />
                                        <span>{item.date}</span>
                                    </span>
                                </div>

                                <h2 className="text-lg font-bold text-[var(--color-brand)] dark:text-white mb-3 group-hover:text-[var(--color-accent)] transition-colors leading-snug">
                                    {item.title}
                                </h2>

                                <p className="text-xs md:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-3 mb-6">
                                    {item.summary}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400 font-medium">
                                    <LuTag className="text-xs text-[var(--color-accent)]" />
                                    <span>{item.tag}</span>
                                </span>

                                <Link
                                    href={item.link}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] dark:hover:text-[var(--color-accent-light)] transition-colors"
                                >
                                    <span>{isAr ? 'عرض التفاصيل' : 'Learn More'}</span>
                                    {isAr ? (
                                        <LuArrowLeft className="text-sm" />
                                    ) : (
                                        <LuArrowRight className="text-sm" />
                                    )}
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}

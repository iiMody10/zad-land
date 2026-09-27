import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PromoBannerProps {
    settings?: {
        middleBanner1Image?: string | null;
        middleBanner1Link?: string | null;
    };
    dir?: 'rtl' | 'ltr';
    language?: 'en' | 'ar';
}

const PromoBanner = ({ settings, dir = 'rtl', language = 'ar' }: PromoBannerProps) => {
    const isArabic = language === 'ar' || dir === 'rtl';
    const bannerLink = settings?.middleBanner1Link || '/categories';

    return (
        <section className="container-custom px-3 sm:px-4">
            <Link
                href={bannerLink}
                className="group relative block w-full aspect-[492/125] sm:aspect-[2097/650] md:h-[160px] lg:h-[185px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
            >
                {/* 2097x750 Ultra High-Definition Background Image */}
                <Image
                    src="/images/redesign/ad-banner-bg.png"
                    alt="منتجات عالمية لجودة حياة أفضل"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 1400px"
                    className="object-cover object-[25%_center] sm:object-center transition-transform duration-700 group-hover:scale-[1.02]"
                />

                {/* Ambient Depth Gradient on mobile to ensure supreme readability */}
                <div className="absolute inset-0 bg-gradient-to-l rtl:bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none md:hidden" />

                {/* Right Side: Headline, Subtitle & Gold CTA Button */}
                <div className="absolute inset-y-0 right-0 w-[52%] sm:w-[48%] md:w-[44%] flex flex-col justify-center items-start rtl:items-start text-start rtl:text-right px-3 sm:px-6 md:px-8 z-10">
                    <h3 className="text-[13px] sm:text-[17px] md:text-2xl lg:text-[28px] font-black text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight">
                        {isArabic ? 'منتجات عالمية' : 'Global Products'}
                    </h3>
                    <p className="text-[9.5px] sm:text-[12px] md:text-sm lg:text-base font-bold text-[var(--color-accent-light)] leading-tight mt-0.5 sm:mt-1 mb-1.5 sm:mb-3 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        {isArabic ? 'لجودة حياة أفضل' : 'For Better Quality Living'}
                    </p>

                    <div className="inline-flex items-center gap-1 sm:gap-2 text-[8.5px] sm:text-[11px] md:text-xs lg:text-sm font-extrabold text-white/95 group-hover:text-white transition-colors">
                        <span>{isArabic ? 'تسوق حسب الفئات' : 'Shop by Categories'}</span>
                        <span className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-[var(--color-accent)] group-hover:bg-[var(--color-accent-hover)] text-white flex items-center justify-center text-[10px] sm:text-xs transition-colors shadow-xs">
                            <span className="leading-none">{isArabic ? '›' : '‹'}</span>
                        </span>
                    </div>
                </div>
            </Link>
        </section>
    );
};

export default PromoBanner;

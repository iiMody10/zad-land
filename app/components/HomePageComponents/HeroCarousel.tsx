'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import type { HomepageBanner } from '@/lib/admin-actions';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HeroCarouselProps {
    banners: HomepageBanner[];
}

function HeroArtwork({
    src,
    alt,
    priority,
    sizes,
    className,
}: {
    src: string;
    alt: string;
    priority: boolean;
    sizes: string;
    className: string;
}) {
    const [failedSource, setFailedSource] = React.useState<string | null>(null);

    return (
        <>
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_42%,rgba(197,157,65,0.2),transparent_34%),linear-gradient(135deg,#102522_0%,#1b4437_56%,#0d2028_100%)]"
            />
            <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "low"}
                sizes={sizes}
                onLoad={() => setFailedSource(null)}
                onError={() => setFailedSource(src)}
                className={`${className}${failedSource === src ? ' invisible' : ''}`}
            />
        </>
    );
}

const isDefaultHeroArtwork = (image: string | null | undefined) =>
    Boolean(image && (image.includes('hero-bg') || image.includes('hero-banner')));

const getTitleSizeClass = (text: string) => {
    const len = text.length;
    if (len > 38) {
        return "text-[18px] xs:text-[20px] sm:text-[23px] leading-[1.25]";
    }
    if (len > 24) {
        return "text-[20px] xs:text-[22px] sm:text-[25px] leading-[1.23]";
    }
    return "text-[23px] xs:text-[26px] sm:text-[29px] leading-[1.2]";
};

const getSubtitleSizeClass = (text: string) => {
    return text.length > 80
        ? "text-[12px] xs:text-[13px] sm:text-[14px] leading-[1.4]"
        : "text-[13px] xs:text-[14px] sm:text-[14.5px] leading-[1.42]";
};

const HeroCarousel = ({ banners }: HeroCarouselProps) => {
    const { dir } = useLanguage();
    const isArabic = dir === 'rtl';
    const wrapperRef = React.useRef<HTMLElement>(null);
    
    const getBannerTitle = (banner: HomepageBanner): string => {
        return isArabic ? (banner.titleAr || banner.title || 'نصل بالعلامات العالمية إلى كل سوق') : (banner.title || banner.titleAr || 'Connecting Global Brands to Every Market');
    };

    const getBannerSubtitle = (banner: HomepageBanner): string => {
        return isArabic ? (banner.subtitleAr || banner.subtitle || 'زاد لاند شركة توزيع رائدة\nالوكيل الرسمي لمنتجات عالمية\nوطنية في سوريا - حمص') : (banner.subtitle || banner.subtitleAr || '');
    };

    const getBannerButtonText = (banner: HomepageBanner): string => {
        if (isArabic) {
            return banner.buttonTextAr || banner.buttonText || 'اكتشف المزيد';
        }
        return banner.buttonText || banner.buttonTextAr || 'Discover More';
    };

    const getBannerBadge = (banner: HomepageBanner): string => {
        if (isArabic) {
            return banner.badgeAr || banner.badge || 'توزيع جملة معتمد';
        }
        return banner.badge || banner.badgeAr || 'Certified Wholesale';
    };

    const sortedBanners = React.useMemo(() => {
        if (!banners || banners.length === 0) return [];
        const hero = banners.find(b => isDefaultHeroArtwork(b.image));
        if (hero) {
            return [hero, ...banners.filter(b => b.id !== hero.id)];
        }
        return banners;
    }, [banners]);

    const displayBanners = sortedBanners;

    if (displayBanners.length === 0) return null;

    return (
        <section ref={wrapperRef} className="w-full pt-0 pb-0 md:pb-6 group hero-carousel">
            {/* Mobile View (< md): High-Definition Swiper Hero with Dynamic Content & Proportional Height */}
            <div className="block md:hidden w-full relative min-h-[420px] aspect-[390/435] sm:min-h-[460px] sm:aspect-[420/400] overflow-hidden">
                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={displayBanners.length > 1}
                    speed={800}
                    autoplay={{
                        delay: 6000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        el: '.mobile-hero-pagination',
                        clickable: true,
                    }}
                    className="h-full w-full"
                >
                    {displayBanners.map((banner, index) => {
                        const mobileImage = banner.imageMobile || banner.image;
                        const isHeroBg = isDefaultHeroArtwork(mobileImage);
                        const title = getBannerTitle(banner);
                        const subtitle = getBannerSubtitle(banner);
                        const badge = getBannerBadge(banner);
                        const buttonText = getBannerButtonText(banner);
                        const isDefaultTitle =
                            title === 'نصل بالعلامات العالمية إلى كل سوق' ||
                            title === 'Connecting Global Brands to Every Market';

                        return (
                            <SwiperSlide key={`mob-${banner.id}`} className="h-full w-full relative">
                                {/* Slide Image */}
                                <HeroArtwork
                                    src={mobileImage}
                                    alt={title}
                                    priority={index === 0}
                                    sizes="100vw"
                                    className={`object-cover ${isHeroBg ? 'object-[72%_center]' : 'object-center'}`}
                                />

                                {/* Brand-toned scrim keeps every line readable across changing imagery */}
                                <div
                                    className={`absolute inset-y-0 pointer-events-none transition-all duration-300 ${
                                        isArabic
                                            ? 'right-0 w-[92%] xs:w-[88%] sm:w-[82%] max-w-[390px] bg-gradient-to-l from-[var(--color-brand)]/95 via-[var(--color-brand)]/80 via-60% to-transparent'
                                            : 'left-0 w-[92%] xs:w-[88%] sm:w-[82%] max-w-[390px] bg-gradient-to-r from-[var(--color-brand)]/95 via-[var(--color-brand)]/80 via-60% to-transparent'
                                    }`}
                                />
                                {/* Soft bottom vignette to smooth transition into BrandsRail curve */}
                                <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none bg-gradient-to-t from-black/40 to-transparent" />

                                {/* Text & CTA Overlay - Positioned with optimal vertical balance above BrandsRail overlap */}
                                <div
                                    dir={isArabic ? 'rtl' : 'ltr'}
                                    className={`absolute top-[48%] -translate-y-1/2 z-10 w-[84%] xs:w-[80%] sm:w-[72%] max-w-[325px] sm:max-w-[360px] flex flex-col ${
                                        isArabic
                                            ? 'right-3.5 xs:right-5 sm:right-6 items-start text-right'
                                            : 'left-3.5 xs:left-5 sm:left-6 items-start text-left'
                                    }`}
                                >
                                    {/* Wholesale Badge */}
                                    {badge && (
                                        <div className="mb-2 xs:mb-2.5">
                                            <span className="inline-flex items-center px-2.5 py-0.5 xs:px-3 xs:py-1 rounded-full text-[10.5px] xs:text-[11.5px] sm:text-xs font-black tracking-wider bg-[var(--color-accent)] text-white shadow-xs">
                                                {badge}
                                            </span>
                                        </div>
                                    )}

                                    {/* Main Headline - NEVER truncated with ellipsis, adaptive font scaling */}
                                    {isHeroBg && isDefaultTitle ? (
                                        <h1 className="text-[23px] xs:text-[26px] sm:text-[30px] font-black text-white leading-[1.2] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                                            {isArabic ? (
                                                <>
                                                    <span className="block">نصل بالعلامات</span>
                                                    <span className="block">العالمية</span>
                                                    <span className="block text-[var(--color-accent-light)]">إلى كل سوق</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="block">Connecting Global</span>
                                                    <span className="block">Brands to</span>
                                                    <span className="block text-[var(--color-accent-light)]">Every Market</span>
                                                </>
                                            )}
                                        </h1>
                                    ) : (
                                        <h1 className={`${getTitleSizeClass(title)} font-black text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] whitespace-pre-line`}>
                                            {title}
                                        </h1>
                                    )}

                                    {/* Subtitle - Adaptive sizing with generous line limit */}
                                    {subtitle && (
                                        <p className={`${getSubtitleSizeClass(subtitle)} text-white/95 font-semibold mt-2 xs:mt-2.5 sm:mt-3 drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)] max-w-[285px] sm:max-w-[320px] whitespace-pre-line line-clamp-4`}>
                                            {subtitle}
                                        </p>
                                    )}

                                    {/* CTA Button */}
                                    <Link
                                        href={banner.link || "/products"}
                                        className="inline-flex items-center gap-2 mt-3 xs:mt-3.5 sm:mt-4 px-5 xs:px-6 py-2 xs:py-2.5 sm:py-3 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-[13px] xs:text-[14px] sm:text-[15px] font-black shadow-[0_5px_15px_rgba(0,0,0,0.45)] transition-colors active:scale-95 border border-white/30 group/btn"
                                    >
                                        <span>{buttonText}</span>
                                        <span className="text-base sm:text-lg font-black leading-none transition-transform duration-200 group-hover/btn:-translate-x-0.5 rtl:group-hover/btn:translate-x-0.5">
                                            {isArabic ? '›' : '‹'}
                                        </span>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                {/* Mobile Pagination Dots - Positioned gracefully above BrandsRail curve */}
                {displayBanners.length > 1 && (
                    <div className="mobile-hero-pagination absolute bottom-9 xs:bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none" />
                )}
            </div>

            {/* Desktop View (>= md): Interactive Swiper Hero */}
            <div className="hidden md:block w-full">
                <div className="relative h-[420px] w-full overflow-hidden bg-[var(--color-canvas)] shadow-xs dark:bg-[#1a1a1a] md:h-[460px] lg:h-[520px] xl:h-[560px] 2xl:h-[600px]">
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={displayBanners.length > 1}
                        speed={1000}
                        autoplay={{
                            delay: 6000,
                            disableOnInteraction: false,
                        }}
                        onAutoplayTimeLeft={(swiper, time, progress) => {
                            if (wrapperRef.current) {
                                wrapperRef.current.style.setProperty('--autoplay-progress', `${(1 - progress) * 100}%`);
                            }
                        }}
                        pagination={{
                            el: '.hero-swiper-pagination',
                            clickable: true,
                            renderBullet: function (index, className) {
                                return '<span class="' + className + '"></span>';
                            },
                        }}
                        navigation={{
                            nextEl: '.swiper-button-next-hero',
                            prevEl: '.swiper-button-prev-hero',
                        }}
                        className="h-full w-full"
                    >
                        {displayBanners.map((banner, index) => (
                            <SwiperSlide key={banner.id} className="h-full w-full">
                                <div className="relative h-full w-full overflow-hidden">
                                    <HeroArtwork
                                        src={banner.image}
                                        alt={getBannerTitle(banner)}
                                        priority={index === 0}
                                        sizes="100vw"
                                        className="object-cover object-center"
                                    />

                                    {/* Darkened copy area while keeping the artwork visible edge-to-edge */}
                                    <div className="pointer-events-none absolute inset-y-0 right-0 w-[58%] bg-gradient-to-l from-[var(--color-brand)]/90 via-[var(--color-brand)]/55 to-transparent" />

                                    {/* Desktop content layered over the image */}
                                    <div
                                        dir={isArabic ? 'rtl' : 'ltr'}
                                        className={`absolute inset-y-0 right-0 z-10 hidden w-[48%] flex-col justify-center px-8 text-white md:flex lg:px-16 ${isArabic ? 'items-start text-right' : 'items-start text-left'}`}
                                    >
                                        <div className="animate-fadeInUp flex w-full max-w-xl flex-col items-start">
                                            <div className="mb-4">
                                                <span className="inline-flex rounded-full bg-[var(--color-accent-light)] px-4 py-1 text-xs font-bold tracking-wider text-[var(--color-brand)] shadow-sm">
                                                    {getBannerBadge(banner)}
                                                </span>
                                            </div>

                                            <h2 className="mb-4 text-4xl font-black leading-[1.15] tracking-tight drop-shadow-[0_3px_8px_rgba(0,0,0,0.7)] lg:text-6xl">
                                                {getBannerTitle(banner)}
                                            </h2>

                                            <p className="mb-7 line-clamp-3 max-w-lg whitespace-pre-line text-base font-medium leading-relaxed text-white/90 drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)] lg:text-lg">
                                                {getBannerSubtitle(banner)}
                                            </p>

                                            <Link
                                                href={banner.link || "/products"}
                                                className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-8 py-3 text-base font-extrabold text-white shadow-[0_5px_15px_rgba(0,0,0,0.4)] transition-colors hover:bg-[var(--color-accent-hover)] active:scale-95"
                                            >
                                                <span>{getBannerButtonText(banner)}</span>
                                                <span className="text-lg font-black leading-none">{isArabic ? '‹' : '›'}</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation and pagination stay centered on desktop for a predictable scan path. */}
                    {displayBanners.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/20 bg-black/25 px-2 py-1.5 shadow-lg backdrop-blur-sm">
                        <button aria-label={isArabic ? 'الشريحة السابقة' : 'Previous slide'} title={isArabic ? 'الشريحة السابقة' : 'Previous slide'} className="swiper-button-prev-hero pointer-events-auto hidden items-center justify-center rounded-full p-1.5 text-white transition-colors hover:bg-white/15 md:flex">
                            <svg className="w-4 h-4 rtl:scale-x-[-1]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.5 16.25L6.25 10L12.5 3.75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </button>

                        <div className="hero-swiper-pagination pointer-events-auto flex min-w-[76px] items-center justify-center" />

                        <button aria-label={isArabic ? 'الشريحة التالية' : 'Next slide'} title={isArabic ? 'الشريحة التالية' : 'Next slide'} className="swiper-button-next-hero pointer-events-auto hidden items-center justify-center rounded-full p-1.5 text-white transition-colors hover:bg-white/15 md:flex">
                            <svg className="w-4 h-4 rtl:scale-x-[-1]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 3.75L13.75 10L7.5 16.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .hero-carousel .swiper-pagination-bullet {
                    width: 6px;
                    height: 6px;
                    background: rgba(184, 134, 11, 0.4);
                    opacity: 1;
                    transition: all 0.3s;
                    border-radius: 99px;
                    margin: 0 3px !important;
                }
                .hero-carousel .swiper-pagination-bullet-active {
                    width: 36px;
                    background: rgba(184, 134, 11, 0.25) !important;
                    position: relative;
                    overflow: hidden;
                }
                .hero-carousel .swiper-pagination-bullet-active::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    width: var(--autoplay-progress, 0%);
                    background: var(--color-accent);
                    border-radius: 99px;
                }
                [dir="rtl"] .hero-carousel .swiper-pagination-bullet-active::after {
                    left: auto;
                    right: 0;
                }
                .hero-carousel .mobile-hero-pagination .swiper-pagination-bullet {
                    width: 6px;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.55);
                    opacity: 1;
                    transition: all 0.3s;
                    border-radius: 99px;
                    margin: 0 3px !important;
                }
                .hero-carousel .mobile-hero-pagination .swiper-pagination-bullet-active {
                    width: 20px;
                    background: var(--color-accent) !important;
                    border-radius: 99px;
                }
            `}</style>
        </section>
    );
};

export default HeroCarousel;

import Image from "next/image";
import Link from "next/link";

interface AboutSupplyBannerProps {
    language: "en" | "ar";
    dir: "ltr" | "rtl";
}

const AboutSupplyBanner = ({ language, dir }: AboutSupplyBannerProps) => {
    const isArabic = language === "ar";

    return (
        <section className="relative isolate z-20 w-full overflow-x-clip bg-[#FFFFFE] md:container-custom" aria-labelledby="about-supply-title">
            <div className="pointer-events-none absolute -bottom-10 -left-3 z-0 h-[230px] w-[84%] md:-bottom-36 md:-left-8 md:h-[350px] md:w-[70%] lg:-left-10 lg:h-[370px] lg:w-[66%]">
                <Image
                    src="/images/content.webp"
                    alt=""
                    fill
                    priority={false}
                    sizes="(max-width: 768px) 84vw, 70vw"
                    className="object-cover object-left-bottom"
                />
            </div>

            <div
                dir={dir}
                className="relative z-50 min-h-[140px] overflow-visible md:min-h-[132px]"
            >
                <div className="relative z-50 ml-auto flex min-h-[140px] w-[79%] items-center justify-center px-3 py-2 text-center md:min-h-[132px] md:w-[64%] md:px-10 md:py-2 lg:w-[61%] lg:px-14">
                    <div className="max-w-[690px]">
                        <div className="mb-3 flex items-center justify-center gap-3 text-[var(--color-accent)] sm:gap-4 md:mb-3 md:gap-6">
                            <div className="h-[1.5px] flex-1 max-w-[36px] bg-gradient-to-r from-transparent via-[var(--color-accent-light)]/40 to-[var(--color-accent)] sm:max-w-[90px] md:max-w-[200px] dark:to-[var(--color-accent-light)]" />
                            <svg className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12 2C11.5 4 10.5 6 9 7.5C10.5 9 11.5 11 12 13C12.5 11 13.5 9 15 7.5C13.5 6 12.5 4 12 2Z" opacity="0.9" />
                                <path d="M7 6C6.5 8 5.5 10 4 11.5C5.5 13 6.5 15 7 17C7.5 15 8.5 13 10 11.5C8.5 10 7.5 8 7 6Z" />
                                <path d="M17 6C16.5 8 15.5 10 14 11.5C15.5 13 16.5 15 17 17C17.5 15 18.5 13 20 11.5C18.5 10 17.5 8 17 6Z" />
                                <path d="M12 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <h2 id="about-supply-title" className="whitespace-nowrap px-1 text-base font-extrabold tracking-tight text-[var(--color-brand)] sm:text-2xl md:text-[28px] dark:text-white">
                                {isArabic ? "من نحن" : "About Us"}
                            </h2>
                            <svg className="h-4 w-4 shrink-0 scale-x-[-1] sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12 2C11.5 4 10.5 6 9 7.5C10.5 9 11.5 11 12 13C12.5 11 13.5 9 15 7.5C13.5 6 12.5 4 12 2Z" opacity="0.9" />
                                <path d="M7 6C6.5 8 5.5 10 4 11.5C5.5 13 6.5 15 7 17C7.5 15 8.5 13 10 11.5C8.5 10 7.5 8 7 6Z" />
                                <path d="M17 6C16.5 8 15.5 10 14 11.5C15.5 13 16.5 15 17 17C17.5 15 18.5 13 20 11.5C18.5 10 17.5 8 17 6Z" />
                                <path d="M12 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <div className="h-[1.5px] flex-1 max-w-[36px] bg-gradient-to-l from-transparent via-[var(--color-accent-light)]/40 to-[var(--color-accent)] sm:max-w-[90px] md:max-w-[200px] dark:to-[var(--color-accent-light)]" />
                        </div>

                        <p className="mx-auto max-w-[620px] text-[11px] font-bold leading-5 text-[var(--color-brand)] drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] md:text-sm md:leading-5">
                            {isArabic
                                ? "زاد لاند هي شركة توزيع متخصصة في استيراد وتوزيع المنتجات العالمية والوطنية تعمل على بناء شراكات طويلة المدى وتوفير أفضل المنتجات بأعلى معايير الجودة في السوق السوري."
                                : "Zad Land specializes in importing and distributing global and national products, building long-term partnerships and delivering quality goods to the Syrian market."}
                        </p>

                        <Link
                            href="/about-us"
                            className="mt-3 inline-flex min-w-[138px] items-center justify-center rounded-full border-2 border-[var(--color-accent-light)] px-7 py-1.5 text-sm font-extrabold text-[var(--color-brand)] transition-colors hover:bg-[var(--color-accent-light)] hover:text-white md:mt-2 md:min-w-[160px] md:px-8 md:py-1.5"
                        >
                            {isArabic ? "اقرأ المزيد" : "Read More"}
                        </Link>
                    </div>
                </div>

            </div>

        </section>
    );
};

export default AboutSupplyBanner;

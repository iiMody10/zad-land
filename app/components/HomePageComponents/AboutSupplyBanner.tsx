import Image from "next/image";
import Link from "next/link";

interface AboutSupplyBannerProps {
    language: "en" | "ar";
    dir: "ltr" | "rtl";
}

const AboutSupplyBanner = ({ language, dir }: AboutSupplyBannerProps) => {
    const isArabic = language === "ar";

    return (
        <section className="relative isolate z-20 w-full overflow-x-clip bg-[#FFFFFE] dark:bg-[var(--color-surface-dark)] pt-8 pb-0 sm:pt-10 sm:pb-0 md:py-8 md:container-custom lg:flex lg:min-h-[360px] lg:items-center xl:min-h-[420px]" aria-labelledby="about-supply-title">
            {/* Desktop botanical artwork. */}
            <div className="pointer-events-none absolute -left-6 z-0 hidden md:block md:-bottom-24 md:h-[340px] md:w-[44%] lg:bottom-0 lg:-left-8 lg:h-[360px] lg:w-[44%] xl:h-[420px]" aria-hidden="true">
                <Image
                    src="/images/content.webp"
                    alt=""
                    fill
                    priority={false}
                    sizes="(min-width: 1280px) 1260px, (min-width: 1024px) 1080px, (min-width: 768px) 44vw, 480px"
                    className="object-cover object-left-bottom md:object-contain lg:object-cover"
                />
            </div>

            <div
                dir={dir}
                className="relative z-10 w-full"
            >
                <div className="mx-auto flex w-full max-w-[480px] items-center justify-center px-6 py-2 text-center md:ml-auto md:max-w-[760px] md:w-[68%] md:px-8 lg:w-[64%]">
                    <div className="w-full">
                        <div className="mb-5 flex items-center justify-center gap-3 text-[var(--color-accent)] sm:gap-4 md:mb-4 md:gap-6">
                            <div className="h-[1.5px] flex-1 max-w-[36px] bg-gradient-to-r from-transparent via-[var(--color-accent-light)]/40 to-[var(--color-accent)] sm:max-w-[90px] md:max-w-[200px] dark:to-[var(--color-accent-light)]" />
                            <svg className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12 2C11.5 4 10.5 6 9 7.5C10.5 9 11.5 11 12 13C12.5 11 13.5 9 15 7.5C13.5 6 12.5 4 12 2Z" opacity="0.9" />
                                <path d="M7 6C6.5 8 5.5 10 4 11.5C5.5 13 6.5 15 7 17C7.5 15 8.5 13 10 11.5C8.5 10 7.5 8 7 6Z" />
                                <path d="M17 6C16.5 8 15.5 10 14 11.5C15.5 13 16.5 15 17 17C17.5 15 18.5 13 20 11.5C18.5 10 17.5 8 17 6Z" />
                                <path d="M12 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <h2 id="about-supply-title" className="whitespace-nowrap px-1 text-2xl font-extrabold tracking-tight text-[var(--color-brand)] md:text-[28px] dark:text-white">
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

                        <p className="mx-auto max-w-[620px] text-base font-medium leading-7 text-[var(--color-brand)] md:text-sm md:font-semibold md:leading-6 dark:text-slate-200">
                            {isArabic
                                ? "زاد لاند هي شركة توزيع متخصصة في استيراد وتوزيع المنتجات العالمية والوطنية تعمل على بناء شراكات طويلة المدى وتوفير أفضل المنتجات بأعلى معايير الجودة في السوق السوري."
                                : "Zad Land specializes in importing and distributing global and national products, building long-term partnerships and delivering quality goods to the Syrian market."}
                        </p>

                        <Link
                            href="/about-us"
                            className="mt-6 hidden md:inline-flex min-h-11 min-w-[160px] items-center justify-center rounded-full border-2 border-[var(--color-accent-light)] px-8 py-2 text-sm font-extrabold text-[var(--color-brand)] transition-colors hover:bg-[var(--color-accent-light)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] md:mt-3 md:min-h-0 md:py-1.5 dark:text-white"
                        >
                            {isArabic ? "اقرأ المزيد" : "Read More"}
                        </Link>
                    </div>
                </div>
            </div>
            {/* Leaves and CTA share a compact mobile composition. */}
            <div dir="ltr" className="relative mt-4 flex h-[160px] items-center justify-end overflow-hidden px-6 sm:h-[180px] sm:px-10 md:hidden">
                <div className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
                    <Image
                        src="/images/content.webp"
                        alt=""
                        fill
                        sizes="(min-width: 640px) 640px, 540px"
                        className="object-cover object-left-bottom"
                    />
                </div>
                <Link
                    href="/about-us"
                    dir={dir}
                    className="relative mb-6 inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[var(--color-accent-light)] bg-[#FFFFFE] px-6 py-2 text-sm font-extrabold text-[var(--color-brand)] transition-colors hover:bg-[var(--color-accent-light)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] dark:bg-[var(--color-surface-dark)] dark:text-white"
                >
                    {isArabic ? "اقرأ المزيد" : "Read More"}
                </Link>
            </div>
        </section>
    );
};

export default AboutSupplyBanner;

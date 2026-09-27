"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Boxes, Handshake, PackageCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import ResilientImage from "@/app/components/ResilientImage";

interface AboutUsSettings {
    aboutHeroTitle: string | null;
    aboutHeroTitleAr: string | null;
    aboutHeroSubtitle: string | null;
    aboutHeroSubtitleAr: string | null;
    aboutHeroImage: string | null;
    aboutNarrativeTitle: string | null;
    aboutNarrativeTitleAr: string | null;
    aboutNarrativeFounded: string | null;
    aboutNarrativeFoundedAr: string | null;
    aboutNarrativeDesc1: string | null;
    aboutNarrativeDesc1Ar: string | null;
    aboutNarrativeDesc2: string | null;
    aboutNarrativeDesc2Ar: string | null;
    aboutNarrativeQuote: string | null;
    aboutNarrativeQuoteAr: string | null;
    aboutNarrativeImage: string | null;
    aboutValuesTitle: string | null;
    aboutValuesTitleAr: string | null;
    aboutValuesDesc: string | null;
    aboutValuesDescAr: string | null;
    aboutValue1Title: string | null;
    aboutValue1TitleAr: string | null;
    aboutValue1Desc: string | null;
    aboutValue1DescAr: string | null;
    aboutValue2Title: string | null;
    aboutValue2TitleAr: string | null;
    aboutValue2Desc: string | null;
    aboutValue2DescAr: string | null;
    aboutValue3Title: string | null;
    aboutValue3TitleAr: string | null;
    aboutValue3Desc: string | null;
    aboutValue3DescAr: string | null;
}

const oldStockPhoto = (src?: string | null) => src?.includes("lh3.googleusercontent.com/aida-public/");

export default function AboutUsClient({ settings }: { settings: AboutUsSettings | null }) {
    const { t, dir, language } = useLanguage();
    const isArabic = language === "ar";
    const Arrow = isArabic ? ArrowLeft : ArrowRight;

    const copy = (
        en: string | null | undefined,
        ar: string | null | undefined,
        fallback: { en: string; ar: string },
        legacy?: { en: string; ar: string },
    ) => {
        const selected = isArabic ? ar : en;
        const legacyValue = legacy ? (isArabic ? legacy.ar : legacy.en) : undefined;
        return selected?.trim() && selected.trim() !== legacyValue ? selected : fallback[isArabic ? "ar" : "en"];
    };

    const heroImage = settings?.aboutHeroImage && !oldStockPhoto(settings.aboutHeroImage)
        ? settings.aboutHeroImage
        : "/images/redesign/hero-bg.png";
    const storyImage = settings?.aboutNarrativeImage && !oldStockPhoto(settings.aboutNarrativeImage)
        ? settings.aboutNarrativeImage
        : "/images/redesign/ad-banner-bg.png";

    const values = [
        {
            Icon: PackageCheck,
            title: copy(settings?.aboutValue1Title, settings?.aboutValue1TitleAr,
                { en: "A considered selection", ar: "اختيار بعناية" },
                { en: "Certified Quality", ar: "جودة ومواصفات قياسية" }),
            description: copy(settings?.aboutValue1Desc, settings?.aboutValue1DescAr,
                { en: "A varied range of food and everyday goods from brands our partners know.", ar: "تشكيلة متنوعة من المواد الغذائية والمنتجات اليومية من علامات يعرفها شركاؤنا." },
                { en: "All products are certified authentic from original manufacturers.", ar: "جميع المنتجات أصلية 100% ومطابقة لأعلى معايير الجودة والمواصفات." }),
        },
        {
            Icon: Handshake,
            title: copy(settings?.aboutValue2Title, settings?.aboutValue2TitleAr,
                { en: "Partnership that lasts", ar: "شراكة تدوم" },
                { en: "100% Authentic", ar: "أصلي 100٪" }),
            description: copy(settings?.aboutValue2Desc, settings?.aboutValue2DescAr,
                { en: "Straightforward, responsive collaboration with suppliers and local businesses.", ar: "تعاون واضح وسريع الاستجابة مع الموردين وأصحاب الأعمال في السوق المحلي." },
                { en: "Direct distribution partnerships with leading global brands.", ar: "شراكات توزيع مباشرة مع كبرى العلامات التجارية العالمية." }),
        },
        {
            Icon: Boxes,
            title: copy(settings?.aboutValue3Title, settings?.aboutValue3TitleAr,
                { en: "Reliable supply", ar: "توريد يمكن الاعتماد عليه" },
                { en: "Reliable Fleet", ar: "أسطول توزيع مجهز" }),
            description: copy(settings?.aboutValue3Desc, settings?.aboutValue3DescAr,
                { en: "Organized distribution shaped around the day-to-day needs of local trade.", ar: "توزيع منظم يراعي احتياجات التجارة المحلية اليومية." },
                { en: "Temperature-controlled logistics fleet covering all distribution channels.", ar: "أسطول سيارات وشاحنات مجهزة لنقل وتوزيع البضائع والمفرزات بدقة وكفاءة." }),
        },
    ];

    return (
        <main className="flex-1 overflow-hidden bg-[#fbfaf7] text-[#183e33]" dir={dir}>
            <div className="container-custom space-y-16 px-4 pb-16 pt-7 sm:space-y-20 sm:pb-20 sm:pt-10 lg:space-y-24">
                <section aria-labelledby="about-hero-title" className="grid overflow-hidden rounded-[1.75rem] bg-[#123d32] shadow-[0_24px_70px_-42px_rgba(10,47,37,0.7)] lg:min-h-[470px] lg:grid-cols-[1.02fr_0.98fr]">
                    <div className="relative order-2 min-h-[260px] sm:min-h-[360px] lg:order-1 lg:min-h-[470px]">
                        <ResilientImage
                            src={heroImage}
                            alt={isArabic ? "مركز زاد لاند للتخزين والتوزيع" : "Zad Land distribution and warehouse"}
                            className="absolute inset-0 h-full w-full object-cover object-center"
                            sizes="(max-width: 1024px) 100vw, 52vw"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#09271f]/65 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#123d32]/20" />
                        <div className="absolute bottom-5 start-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#10392f]/80 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm sm:bottom-7 sm:start-7 sm:text-sm">
                            <span className="size-2 rounded-full bg-[#d9aa43]" />
                            {isArabic ? "زاد لاند · حمص، سوريا" : "Zad Land · Homs, Syria"}
                        </div>
                    </div>

                    <div className="order-1 flex flex-col justify-center px-6 py-10 text-start sm:px-10 sm:py-12 lg:order-2 lg:px-12 xl:px-16">
                        <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#d7ab53]/35 bg-white/[0.06] px-3.5 py-2 text-xs font-bold tracking-wide text-[#e8c779] sm:text-sm">
                            <Sparkles size={15} aria-hidden="true" />
                            {isArabic ? "من سوريا إلى أسواقها" : "Rooted in Syria, built for local trade"}
                        </span>
                        <h1 id="about-hero-title" className="max-w-xl text-4xl font-black leading-[1.2] tracking-tight text-white sm:text-5xl xl:text-[3.75rem]">
                            {copy(settings?.aboutHeroTitle, settings?.aboutHeroTitleAr,
                                { en: "Good products. Trusted partnerships.", ar: "منتجات موثوقة، وشراكات تدوم." },
                                { en: "Our Story", ar: "قصتنا" })}
                        </h1>
                        <p className="mt-5 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
                            {copy(settings?.aboutHeroSubtitle, settings?.aboutHeroSubtitleAr,
                                { en: "Zad Land connects trusted food and everyday brands with the shops and people who rely on them across Syria.", ar: "تصل زاد لاند بين العلامات الموثوقة في الغذاء والمنتجات اليومية، وبين المتاجر والعائلات التي تعتمد عليها في سوريا." },
                                { en: "Your trusted partner for distributing top quality global goods and food products.", ar: "شريككم الموثوق لتوزيع البضائع والمواد الغذائية من أفضل الشركات العالمية." })}
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <Link href="/products" className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-[#d8aa3e] px-5 py-3 font-extrabold text-[#173c31] transition-colors hover:bg-[#e8c56d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                {isArabic ? "تصفّح المنتجات" : t("aboutUsPage.hero.cta")}
                                <Arrow size={17} aria-hidden="true" />
                            </Link>
                            <Link href="/contact" className="inline-flex min-h-12 items-center rounded-xl border border-white/25 px-5 py-3 font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                {isArabic ? "تواصلوا معنا" : "Talk to our team"}
                            </Link>
                        </div>
                    </div>
                </section>

                <section aria-labelledby="about-story-title" className="grid items-center gap-9 lg:grid-cols-2 lg:gap-16">
                    <div className="relative min-h-[300px] overflow-hidden rounded-[1.5rem] bg-[#e8e9dc] sm:min-h-[420px]">
                        <ResilientImage
                            src={storyImage}
                            alt={isArabic ? "منتجات غذائية واستهلاكية من علامات متنوعة" : "A selection of food and everyday consumer products"}
                            className="absolute inset-0 h-full w-full object-cover object-left"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#09271f]/45 via-transparent to-transparent" />
                        <div className="absolute bottom-5 start-5 rounded-xl border border-white/35 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm sm:bottom-7 sm:start-7">
                            <p className="text-xs font-bold text-[#547064]">{isArabic ? "نخدم حركة التجارة اليومية" : "Supporting everyday trade"}</p>
                            <p className="mt-1 text-sm font-black text-[#173c31]">{isArabic ? "غذائيات · عناية · احتياجات يومية" : "Food · Care · Daily essentials"}</p>
                        </div>
                    </div>

                    <div className="py-2 lg:py-8">
                        <p className="mb-4 text-sm font-extrabold tracking-wide text-[#a47a25]">
                            {copy(settings?.aboutNarrativeFounded, settings?.aboutNarrativeFoundedAr,
                                { en: "A reliable link in every delivery", ar: "حلقة موثوقة في كل توريد" },
                                { en: "Founded with Trust", ar: "تأسست على الثقة" })}
                        </p>
                        <h2 id="about-story-title" className="max-w-2xl text-3xl font-black leading-tight tracking-tight text-[#183e33] sm:text-4xl xl:text-5xl">
                            {copy(settings?.aboutNarrativeTitle, settings?.aboutNarrativeTitleAr,
                                { en: "From trusted brands to the shelves that serve you.", ar: "من العلامات الموثوقة إلى رفوف تخدمكم." },
                                { en: "Our Mission for Quality Distribution", ar: "مهمتنا في التوزيع الموثوق" })}
                        </h2>
                        <div className="mt-6 space-y-4 text-base leading-8 text-[#5d6c63] sm:text-lg">
                            <p>{copy(settings?.aboutNarrativeDesc1, settings?.aboutNarrativeDesc1Ar,
                                { en: "At Zad Land, we source and distribute a considered range of food and consumer goods, bringing familiar brands closer to the local shops and markets people depend on.", ar: "في زاد لاند، نوفر مجموعة مختارة من المنتجات الغذائية والاستهلاكية، ونقرّب العلامات التي تعرفونها من المتاجر والأسواق المحلية التي تعتمدون عليها." },
                                { en: "At Zad Land, we bridge the gap between world-renowned international brands and local markets. We believe in providing retailers and businesses with seamless access to authentic, top-tier goods at competitive wholesale prices.", ar: "في زاد لاند، نعمل كجسر موثوق يربط بين كبرى الشركات والعلامات التجارية العالمية والأسواق المحلية." })}</p>
                            <p>{copy(settings?.aboutNarrativeDesc2, settings?.aboutNarrativeDesc2Ar,
                                { en: "Good distribution is built on clear communication and dependable supply. We work closely with our partners to make ordering straightforward and build business relationships that last.", ar: "التوزيع الجيد يبدأ بالتواصل الواضح والتوريد الذي يمكن الاعتماد عليه. نعمل عن قرب مع شركائنا لنجعل التعامل أسهل ونبني علاقات عمل تستمر." },
                                { en: "With rigorous quality control, modern logistics, and a commitment to reliability, Zad Land has established itself as the trusted partner for food and consumer goods distribution across all governorates.", ar: "بفضل أسطول التوزيع المنظم والمستودعات المجهزة، أثبتت زاد لاند مكانتها كشركة رائدة وموثوقة لتوزيع البضائع الغذائية والاستهلاكية في جميع المحافظات." })}</p>
                        </div>
                        <div className="mt-7 flex items-center gap-4 border-t border-[#183e33]/15 pt-5">
                            <span className="h-9 w-1 rounded-full bg-[#d6a638]" />
                            <p className="text-base font-bold text-[#183e33] sm:text-lg">
                                {copy(settings?.aboutNarrativeQuote, settings?.aboutNarrativeQuoteAr,
                                    { en: "Dependable supply makes stronger local markets.", ar: "توريد موثوق، وسوق محلي أقوى." },
                                    { en: "Connecting you with the world's finest brands.", ar: "جودة مضمونة وخدمة توزيع موثوقة." })}
                            </p>
                        </div>
                    </div>
                </section>

                <section aria-labelledby="about-values-title" className="rounded-[1.75rem] border border-[#183e33]/10 bg-white px-5 py-9 shadow-[0_18px_55px_-45px_rgba(10,47,37,0.5)] sm:px-9 sm:py-12 lg:px-12">
                    <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
                        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#a47a25]">
                            {isArabic ? "ما يوجّه عملنا" : "What guides our work"}
                        </p>
                        <h2 id="about-values-title" className="text-3xl font-black tracking-tight text-[#183e33] sm:text-4xl">
                            {copy(settings?.aboutValuesTitle, settings?.aboutValuesTitleAr,
                                { en: "The way we do business", ar: "هكذا نبني شراكاتنا" },
                                { en: "Our Core Values", ar: "قيمنا الجوهرية" })}
                        </h2>
                        <p className="mt-3 text-base leading-7 text-[#66766d]">
                            {copy(settings?.aboutValuesDesc, settings?.aboutValuesDescAr,
                                { en: "Practical principles that keep our work useful to the people we serve.", ar: "مبادئ عملية تجعل عملنا مفيداً لمن نخدمهم." },
                                { en: "We are committed to transparency, reliability, and excellence in food distribution.", ar: "نحن ملتزمون بالشفافية والموثوقية والتميز في توزيع البضائع والمواد الغذائية." })}
                        </p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3 md:gap-4">
                        {values.map(({ Icon, title, description }, index) => (
                            <article key={title} className="flex gap-4 rounded-2xl border border-[#183e33]/10 bg-[#fbfaf7] p-5 sm:p-6">
                                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e8efe8] text-[#174333]" aria-hidden="true">
                                    <Icon size={21} strokeWidth={1.8} />
                                </span>
                                <div>
                                    <p className="mb-1 text-xs font-extrabold tracking-wide text-[#b1842b]">0{index + 1}</p>
                                    <h3 className="text-lg font-extrabold text-[#183e33]">{title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-[#66766d]">{description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="flex flex-col items-start justify-between gap-6 rounded-[1.5rem] bg-[#123d32] px-6 py-8 text-white sm:flex-row sm:items-center sm:px-9 sm:py-9 lg:px-12">
                    <div>
                        <p className="mb-2 text-sm font-bold text-[#e8c779]">{isArabic ? "لنبنِ شراكة نافعة" : "Let’s build a useful partnership"}</p>
                        <h2 className="text-2xl font-black leading-snug sm:text-3xl">
                            {isArabic ? "هل تبحثون عن منتجات موثوقة لأعمالكم؟" : "Looking for dependable products for your business?"}
                        </h2>
                    </div>
                    <Link href="/contact" className="inline-flex min-h-12 shrink-0 items-center gap-3 rounded-xl bg-[#d8aa3e] px-5 py-3 font-extrabold text-[#173c31] transition-colors hover:bg-[#e8c56d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                        {isArabic ? "تواصلوا مع زاد لاند" : "Get in touch"}
                        <Arrow size={17} aria-hidden="true" />
                    </Link>
                </section>
            </div>
        </main>
    );
}

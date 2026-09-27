"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Boxes, Handshake, PackageCheck } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import ResilientImage from "@/app/components/ResilientImage";

export interface AboutUsSettings {
    aboutPageEnabled?: boolean;
    aboutHeroEnabled?: boolean;
    aboutHeroEyebrow?: string | null;
    aboutHeroEyebrowAr?: string | null;
    aboutHeroTitle?: string | null;
    aboutHeroTitleAr?: string | null;
    aboutHeroSubtitle?: string | null;
    aboutHeroSubtitleAr?: string | null;
    aboutHeroImage?: string | null;
    aboutHeroImageAlt?: string | null;
    aboutHeroImageAltAr?: string | null;
    aboutHeroPrimaryCtaLabel?: string | null;
    aboutHeroPrimaryCtaLabelAr?: string | null;
    aboutHeroPrimaryCtaUrl?: string | null;
    aboutHeroSecondaryCtaLabel?: string | null;
    aboutHeroSecondaryCtaLabelAr?: string | null;
    aboutHeroSecondaryCtaUrl?: string | null;
    aboutNarrativeEnabled?: boolean;
    aboutNarrativeTitle?: string | null;
    aboutNarrativeTitleAr?: string | null;
    aboutNarrativeFounded?: string | null;
    aboutNarrativeFoundedAr?: string | null;
    aboutNarrativeDesc1?: string | null;
    aboutNarrativeDesc1Ar?: string | null;
    aboutNarrativeDesc2?: string | null;
    aboutNarrativeDesc2Ar?: string | null;
    aboutNarrativeQuote?: string | null;
    aboutNarrativeQuoteAr?: string | null;
    aboutNarrativeImage?: string | null;
    aboutNarrativeImageAlt?: string | null;
    aboutNarrativeImageAltAr?: string | null;
    aboutValuesEnabled?: boolean;
    aboutValuesEyebrow?: string | null;
    aboutValuesEyebrowAr?: string | null;
    aboutValuesTitle?: string | null;
    aboutValuesTitleAr?: string | null;
    aboutValuesDesc?: string | null;
    aboutValuesDescAr?: string | null;
    aboutValue1Enabled?: boolean;
    aboutValue1Title?: string | null;
    aboutValue1TitleAr?: string | null;
    aboutValue1Desc?: string | null;
    aboutValue1DescAr?: string | null;
    aboutValue2Enabled?: boolean;
    aboutValue2Title?: string | null;
    aboutValue2TitleAr?: string | null;
    aboutValue2Desc?: string | null;
    aboutValue2DescAr?: string | null;
    aboutValue3Enabled?: boolean;
    aboutValue3Title?: string | null;
    aboutValue3TitleAr?: string | null;
    aboutValue3Desc?: string | null;
    aboutValue3DescAr?: string | null;
    aboutCtaEnabled?: boolean;
    aboutCtaEyebrow?: string | null;
    aboutCtaEyebrowAr?: string | null;
    aboutCtaTitle?: string | null;
    aboutCtaTitleAr?: string | null;
    aboutCtaButtonLabel?: string | null;
    aboutCtaButtonLabelAr?: string | null;
    aboutCtaUrl?: string | null;
    aboutSeoTitle?: string | null;
    aboutSeoTitleAr?: string | null;
    aboutSeoDescription?: string | null;
    aboutSeoDescriptionAr?: string | null;
}

type CopyPair = { en: string; ar: string };

const text = (enValue: string | null | undefined, arValue: string | null | undefined, fallback: CopyPair, isArabic: boolean) => {
    const value = isArabic ? arValue : enValue;
    return value == null ? fallback[isArabic ? "ar" : "en"] : value.trim();
};

const image = (value: string | null | undefined, fallback: string) => value?.trim() || fallback;

export default function AboutUsClient({ settings }: { settings: AboutUsSettings | null }) {
    const { dir, language } = useLanguage();
    const isArabic = language === "ar";
    const Arrow = isArabic ? ArrowLeft : ArrowRight;
    const values = [
        {
            enabled: settings?.aboutValue1Enabled !== false,
            Icon: PackageCheck,
            title: text(settings?.aboutValue1Title, settings?.aboutValue1TitleAr, { en: "A considered selection", ar: "اختيار بعناية" }, isArabic),
            description: text(settings?.aboutValue1Desc, settings?.aboutValue1DescAr, { en: "A practical range of food and everyday goods from brands our partners know.", ar: "تشكيلة عملية من المواد الغذائية والمنتجات اليومية من علامات يعرفها شركاؤنا." }, isArabic),
        },
        {
            enabled: settings?.aboutValue2Enabled !== false,
            Icon: Handshake,
            title: text(settings?.aboutValue2Title, settings?.aboutValue2TitleAr, { en: "Partnership that lasts", ar: "شراكة تدوم" }, isArabic),
            description: text(settings?.aboutValue2Desc, settings?.aboutValue2DescAr, { en: "Clear, responsive collaboration with suppliers and local businesses.", ar: "تعاون واضح وسريع الاستجابة مع الموردين وأصحاب الأعمال." }, isArabic),
        },
        {
            enabled: settings?.aboutValue3Enabled !== false,
            Icon: Boxes,
            title: text(settings?.aboutValue3Title, settings?.aboutValue3TitleAr, { en: "Reliable supply", ar: "توريد يمكن الاعتماد عليه" }, isArabic),
            description: text(settings?.aboutValue3Desc, settings?.aboutValue3DescAr, { en: "Organized distribution shaped around the needs of local trade.", ar: "توزيع منظم يراعي احتياجات التجارة المحلية." }, isArabic),
        },
    ].filter((value) => value.enabled);

    if (settings?.aboutPageEnabled === false) return null;

    return (
        <main className="flex-1 bg-[#f7f8f5] text-[#153d32]" dir={dir}>
            <div className="container-custom space-y-14 px-4 pb-16 pt-8 sm:space-y-20 sm:pb-20 sm:pt-12 lg:space-y-24">
                {settings?.aboutHeroEnabled !== false && <section aria-labelledby="about-hero-title" className="grid overflow-hidden rounded-[1.5rem] bg-[#143e33] shadow-[0_22px_55px_-38px_rgba(10,47,37,.55)] lg:min-h-[420px] lg:grid-cols-2">
                    <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
                        <p className="mb-4 text-sm font-bold tracking-wide text-[#e7bf65]">
                            {text(settings?.aboutHeroEyebrow, settings?.aboutHeroEyebrowAr, { en: "Zad Land · Wholesale distribution", ar: "زاد لاند · تجارة وتوزيع بالجملة" }, isArabic)}
                        </p>
                        <h1 id="about-hero-title" className="max-w-xl text-4xl font-extrabold leading-[1.2] tracking-tight text-white sm:text-5xl xl:text-[3.5rem]">
                            {text(settings?.aboutHeroTitle, settings?.aboutHeroTitleAr, { en: "A dependable partner for everyday trade.", ar: "شريك موثوق لتجارة تلبي الاحتياجات اليومية." }, isArabic)}
                        </h1>
                        <p className="mt-5 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
                            {text(settings?.aboutHeroSubtitle, settings?.aboutHeroSubtitleAr, { en: "We bring trusted food and consumer brands closer to the businesses and communities that count on them.", ar: "نقرّب العلامات الموثوقة في الغذاء والمنتجات الاستهلاكية من المتاجر والمجتمعات التي تعتمد عليها." }, isArabic)}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            {text(settings?.aboutHeroPrimaryCtaLabel, settings?.aboutHeroPrimaryCtaLabelAr, { en: "Explore products", ar: "تصفّح المنتجات" }, isArabic) && <Link href={settings?.aboutHeroPrimaryCtaUrl?.trim() || "/products"} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#d9ad4a] px-5 py-2.5 font-bold text-[#153d32] transition-colors hover:bg-[#ebc86e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                {text(settings?.aboutHeroPrimaryCtaLabel, settings?.aboutHeroPrimaryCtaLabelAr, { en: "Explore products", ar: "تصفّح المنتجات" }, isArabic)}
                                <Arrow size={17} aria-hidden="true" />
                            </Link>}
                            {text(settings?.aboutHeroSecondaryCtaLabel, settings?.aboutHeroSecondaryCtaLabelAr, { en: "Contact us", ar: "تواصلوا معنا" }, isArabic) && <Link href={settings?.aboutHeroSecondaryCtaUrl?.trim() || "/contact"} className="inline-flex min-h-11 items-center rounded-lg border border-white/25 px-5 py-2.5 font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                {text(settings?.aboutHeroSecondaryCtaLabel, settings?.aboutHeroSecondaryCtaLabelAr, { en: "Contact us", ar: "تواصلوا معنا" }, isArabic)}
                            </Link>}
                        </div>
                    </div>
                    <div className="relative min-h-[250px] bg-[#e8ece5] sm:min-h-[340px] lg:min-h-[420px]">
                        <ResilientImage
                            src={image(settings?.aboutHeroImage, "/images/redesign/hero-bg.png")}
                            alt={text(settings?.aboutHeroImageAlt, settings?.aboutHeroImageAltAr, { en: "Zad Land wholesale distribution", ar: "مركز زاد لاند للتوزيع" }, isArabic)}
                            className="absolute inset-0 h-full w-full object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                        />
                    </div>
                </section>}

                {settings?.aboutNarrativeEnabled !== false && <section aria-labelledby="about-story-title" className="grid items-center gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
                    <div className="relative min-h-[280px] overflow-hidden rounded-[1.25rem] bg-[#e7ebe4] sm:min-h-[390px]">
                        <ResilientImage
                            src={image(settings?.aboutNarrativeImage, "/images/redesign/ad-banner-bg.png")}
                            alt={text(settings?.aboutNarrativeImageAlt, settings?.aboutNarrativeImageAltAr, { en: "Products supplied by Zad Land", ar: "منتجات توزعها زاد لاند" }, isArabic)}
                            className="absolute inset-0 h-full w-full object-cover"
                            sizes="(max-width: 1024px) 100vw, 45vw"
                        />
                    </div>
                    <div className="py-2 lg:py-8">
                        <p className="mb-3 text-sm font-bold tracking-wide text-[#a47a25]">
                            {text(settings?.aboutNarrativeFounded, settings?.aboutNarrativeFoundedAr, { en: "Our story", ar: "قصتنا" }, isArabic)}
                        </p>
                        <h2 id="about-story-title" className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-[#153d32] sm:text-4xl">
                            {text(settings?.aboutNarrativeTitle, settings?.aboutNarrativeTitleAr, { en: "Reliable supply, built on long-term relationships.", ar: "توريد موثوق، وعلاقات عمل تدوم." }, isArabic)}
                        </h2>
                        <div className="mt-5 space-y-4 text-base leading-8 text-[#56665f] sm:text-lg">
                            <p>{text(settings?.aboutNarrativeDesc1, settings?.aboutNarrativeDesc1Ar, { en: "Zad Land sources and distributes a considered range of food and consumer goods, connecting trusted brands with the local shops and markets people depend on.", ar: "توفر زاد لاند مجموعة مختارة من المنتجات الغذائية والاستهلاكية، وتربط العلامات الموثوقة بالمتاجر والأسواق المحلية التي يعتمد عليها الناس." }, isArabic)}</p>
                            <p>{text(settings?.aboutNarrativeDesc2, settings?.aboutNarrativeDesc2Ar, { en: "We believe good distribution starts with clear communication and dependable service. Our team works closely with suppliers and customers to make wholesale trade easier and more consistent.", ar: "نؤمن بأن التوزيع الجيد يبدأ بالتواصل الواضح والخدمة التي يمكن الاعتماد عليها. يعمل فريقنا عن قرب مع الموردين والعملاء لتسهيل تجارة الجملة وجعلها أكثر انتظاماً." }, isArabic)}</p>
                        </div>
                        <blockquote className="mt-6 border-s-2 border-[#d5a93e] ps-4 text-base font-bold leading-7 text-[#153d32] sm:text-lg">
                            {text(settings?.aboutNarrativeQuote, settings?.aboutNarrativeQuoteAr, { en: "Dependable supply helps local businesses grow.", ar: "التوريد الموثوق يدعم نمو الأعمال المحلية." }, isArabic)}
                        </blockquote>
                    </div>
                </section>}

                {settings?.aboutValuesEnabled !== false && values.length > 0 && <section aria-labelledby="about-values-title" className="border-y border-[#153d32]/10 py-10 sm:py-14">
                    <div className="mb-8 max-w-2xl">
                        <p className="mb-2 text-sm font-bold tracking-wide text-[#a47a25]">
                            {text(settings?.aboutValuesEyebrow, settings?.aboutValuesEyebrowAr, { en: "How we work", ar: "نهجنا في العمل" }, isArabic)}
                        </p>
                        <h2 id="about-values-title" className="text-3xl font-extrabold tracking-tight text-[#153d32] sm:text-4xl">
                            {text(settings?.aboutValuesTitle, settings?.aboutValuesTitleAr, { en: "What our partners can expect.", ar: "ما يمكن لشركائنا الاعتماد عليه." }, isArabic)}
                        </h2>
                        <p className="mt-3 max-w-xl text-base leading-7 text-[#65736c]">
                            {text(settings?.aboutValuesDesc, settings?.aboutValuesDescAr, { en: "A practical approach focused on product choice, lasting partnerships and reliable delivery.", ar: "نهج عملي يركز على تنوع المنتجات، والشراكات المستمرة، والتوريد الموثوق." }, isArabic)}
                        </p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3 md:gap-5">
                        {values.map(({ Icon, title, description }, index) => (
                            <article key={`${index}-${title}`} className="rounded-xl border border-[#153d32]/10 bg-white p-5 sm:p-6">
                                <span className="mb-5 flex size-10 items-center justify-center rounded-lg bg-[#edf2ec] text-[#174333]" aria-hidden="true">
                                    <Icon size={20} strokeWidth={1.8} />
                                </span>
                                <h3 className="text-lg font-bold text-[#153d32]">{title}</h3>
                                <p className="mt-2 text-sm leading-6 text-[#65736c]">{description}</p>
                            </article>
                        ))}
                    </div>
                </section>}

                {settings?.aboutCtaEnabled !== false && <section className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-[#143e33] px-6 py-7 text-white sm:flex-row sm:items-center sm:px-9 sm:py-8">
                    <div>
                        <p className="mb-2 text-sm font-bold text-[#e7bf65]">
                            {text(settings?.aboutCtaEyebrow, settings?.aboutCtaEyebrowAr, { en: "For retailers and businesses", ar: "للمتاجر وأصحاب الأعمال" }, isArabic)}
                        </p>
                        <h2 className="max-w-3xl text-xl font-extrabold leading-snug sm:text-2xl">
                            {text(settings?.aboutCtaTitle, settings?.aboutCtaTitleAr, { en: "Looking for a dependable wholesale partner?", ar: "هل تبحثون عن شريك موثوق لتجارة الجملة؟" }, isArabic)}
                        </h2>
                    </div>
                    {text(settings?.aboutCtaButtonLabel, settings?.aboutCtaButtonLabelAr, { en: "Talk to our team", ar: "تواصلوا مع فريقنا" }, isArabic) && <Link href={settings?.aboutCtaUrl?.trim() || "/contact"} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-[#d9ad4a] px-5 py-2.5 font-bold text-[#153d32] transition-colors hover:bg-[#ebc86e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                        {text(settings?.aboutCtaButtonLabel, settings?.aboutCtaButtonLabelAr, { en: "Talk to our team", ar: "تواصلوا مع فريقنا" }, isArabic)}
                        <Arrow size={17} aria-hidden="true" />
                    </Link>}
                </section>}
            </div>
        </main>
    );
}

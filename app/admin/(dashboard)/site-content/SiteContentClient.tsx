"use client";

import { useState } from "react";
import { Image as MdImage, Truck as MdLocalShipping, ArrowLeftRight as MdCurrencyExchange, GalleryHorizontalEnd as MdViewCarousel, Info as MdInfoOutline, ListOrdered, Save as MdSave, Store as MdStorefront } from 'lucide-react';
import AdminHeader from "../../components/AdminHeader";
import { useAdminSidebar } from "../../context/AdminSidebarContext";
import { updateSiteSettings } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/context/LanguageContext";
import FooterContentSection from "./FooterContentSection";
import HeaderNavigationSection from "./HeaderNavigationSection";
import type { HeaderNavItemRef } from "@/lib/header-navigation";

interface FooterCategoryOption {
    id: string;
    name: string;
}

interface SiteSettings {
    id: string;
    headerNavItems: string | null;
    categoriesCtaTitle: string | null;
    categoriesCtaDesc: string | null;
    categoriesCtaTitleAr: string | null;
    categoriesCtaDescAr: string | null;
    categoriesCtaImage: string | null;
    footerBrandTitle: string | null;
    footerBrandTitleAr: string | null;
    footerBrandDescription: string | null;
    footerBrandDescriptionAr: string | null;
    footerCopyright: string | null;
    footerCopyrightAr: string | null;
    footerInstagramUrl: string | null;
    footerFacebookUrl: string | null;
    footerWhatsappUrl: string | null;
    footerShopTitle: string | null;
    footerShopTitleAr: string | null;
    footerSupportTitle: string | null;
    footerSupportTitleAr: string | null;
    footerCompanyTitle: string | null;
    footerCompanyTitleAr: string | null;
    footerSupportLink1Label: string | null;
    footerSupportLink1LabelAr: string | null;
    footerSupportLink1Url: string | null;
    footerSupportLink2Label: string | null;
    footerSupportLink2LabelAr: string | null;
    footerSupportLink2Url: string | null;
    footerSupportLink3Label: string | null;
    footerSupportLink3LabelAr: string | null;
    footerSupportLink3Url: string | null;
    footerCompanyLink1Label: string | null;
    footerCompanyLink1LabelAr: string | null;
    footerCompanyLink1Url: string | null;
    footerCompanyLink2Label: string | null;
    footerCompanyLink2LabelAr: string | null;
    footerCompanyLink2Url: string | null;
    footerCompanyLink3Label: string | null;
    footerCompanyLink3LabelAr: string | null;
    footerCompanyLink3Url: string | null;
    footerCategory1Id: string | null;
    footerCategory2Id: string | null;
    footerCategory3Id: string | null;
    footerCategory4Id: string | null;
    shippingTitle: string | null;
    shippingDesc: string | null;
    shippingTitleAr: string | null;
    shippingDescAr: string | null;
    verificationTitle: string | null;
    verificationDesc: string | null;
    verificationTitleAr: string | null;
    verificationDescAr: string | null;
    standardShippingTime: string | null;
    expressShippingTime: string | null;
    returnsTitle: string | null;
    returnsDesc: string | null;
    returnsTitleAr: string | null;
    returnsDescAr: string | null;
    finalSaleTitle: string | null;
    finalSaleDesc: string | null;
    finalSaleTitleAr: string | null;
    finalSaleDescAr: string | null;
    hygieneTitle: string | null;
    hygieneDesc: string | null;
    hygieneTitleAr: string | null;
    hygieneDescAr: string | null;
    shippingReturnsImage: string | null;
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
    exchangeRate: number | null;
    middleBanner1Image: string | null;
    middleBanner1Link: string | null;
    middleBanner2Image: string | null;
    middleBanner2Link: string | null;
    middleBanner2Title: string | null;
    middleBanner2TitleAr: string | null;
    middleBanner2Subtitle: string | null;
    middleBanner2SubtitleAr: string | null;
    middleBanner2ButtonText: string | null;
    middleBanner2ButtonTextAr: string | null;
    featuredCollectionEnabled: boolean;
    featuredCollectionNewArrivalsEnabled: boolean;
    featuredCollectionBestSellersEnabled: boolean;
    featuredCollectionTitle: string | null;
    featuredCollectionTitleAr: string | null;
    featuredCollectionNewArrivalsLabel: string | null;
    featuredCollectionNewArrivalsLabelAr: string | null;
    featuredCollectionBestSellersLabel: string | null;
    featuredCollectionBestSellersLabelAr: string | null;
    featuredCollectionAllProductsLabel: string | null;
    featuredCollectionAllProductsLabelAr: string | null;
    featuredCollectionAllProductsUrl: string | null;
}

type TabType = "currency" | "navigation" | "footer" | "banners" | "shipping" | "about" | "featured";

export default function SiteContentClient({ 
    initialSettings,
    categories,
    mainCategories,
    initialHeaderNavItems,
}: { 
    initialSettings: SiteSettings | null;
    categories: FooterCategoryOption[];
    mainCategories: Array<FooterCategoryOption & { nameEn?: string }>;
    initialHeaderNavItems: HeaderNavItemRef[];
}) {
    const { t, dir } = useLanguage();
    const { openSidebar } = useAdminSidebar();
    const [activeTab, setActiveTab] = useState<TabType>("currency");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [headerNavItems, setHeaderNavItems] = useState<HeaderNavItemRef[]>(initialHeaderNavItems);

    // Site Settings State - Categories CTA
    const [ctaTitle, setCtaTitle] = useState(initialSettings?.categoriesCtaTitle || "");
    const [ctaDesc, setCtaDesc] = useState(initialSettings?.categoriesCtaDesc || "");
    const [ctaTitleAr, setCtaTitleAr] = useState(initialSettings?.categoriesCtaTitleAr || "");
    const [ctaDescAr, setCtaDescAr] = useState(initialSettings?.categoriesCtaDescAr || "");
    const [ctaImage, setCtaImage] = useState(initialSettings?.categoriesCtaImage || "");

    // Site Settings State - Footer Content
    const [footerContent, setFooterContent] = useState({
        footerBrandTitle: initialSettings?.footerBrandTitle || "",
        footerBrandTitleAr: initialSettings?.footerBrandTitleAr || "",
        footerBrandDescription: initialSettings?.footerBrandDescription || "",
        footerBrandDescriptionAr: initialSettings?.footerBrandDescriptionAr || "",
        footerCopyright: initialSettings?.footerCopyright || "",
        footerCopyrightAr: initialSettings?.footerCopyrightAr || "",
        footerInstagramUrl: initialSettings?.footerInstagramUrl || "",
        footerFacebookUrl: initialSettings?.footerFacebookUrl || "",
        footerWhatsappUrl: initialSettings?.footerWhatsappUrl || "",
        footerShopTitle: initialSettings?.footerShopTitle || "",
        footerShopTitleAr: initialSettings?.footerShopTitleAr || "",
        footerSupportTitle: initialSettings?.footerSupportTitle || "",
        footerSupportTitleAr: initialSettings?.footerSupportTitleAr || "",
        footerCompanyTitle: initialSettings?.footerCompanyTitle || "",
        footerCompanyTitleAr: initialSettings?.footerCompanyTitleAr || "",
        footerSupportLink1Label: initialSettings?.footerSupportLink1Label || "",
        footerSupportLink1LabelAr: initialSettings?.footerSupportLink1LabelAr || "",
        footerSupportLink1Url: initialSettings?.footerSupportLink1Url || "",
        footerSupportLink2Label: initialSettings?.footerSupportLink2Label || "",
        footerSupportLink2LabelAr: initialSettings?.footerSupportLink2LabelAr || "",
        footerSupportLink2Url: initialSettings?.footerSupportLink2Url || "",
        footerSupportLink3Label: initialSettings?.footerSupportLink3Label || "",
        footerSupportLink3LabelAr: initialSettings?.footerSupportLink3LabelAr || "",
        footerSupportLink3Url: initialSettings?.footerSupportLink3Url || "",
        footerCompanyLink1Label: initialSettings?.footerCompanyLink1Label || "",
        footerCompanyLink1LabelAr: initialSettings?.footerCompanyLink1LabelAr || "",
        footerCompanyLink1Url: initialSettings?.footerCompanyLink1Url || "",
        footerCompanyLink2Label: initialSettings?.footerCompanyLink2Label || "",
        footerCompanyLink2LabelAr: initialSettings?.footerCompanyLink2LabelAr || "",
        footerCompanyLink2Url: initialSettings?.footerCompanyLink2Url || "",
        footerCompanyLink3Label: initialSettings?.footerCompanyLink3Label || "",
        footerCompanyLink3LabelAr: initialSettings?.footerCompanyLink3LabelAr || "",
        footerCompanyLink3Url: initialSettings?.footerCompanyLink3Url || "",
        footerCategory1Id: initialSettings?.footerCategory1Id || "",
        footerCategory2Id: initialSettings?.footerCategory2Id || "",
        footerCategory3Id: initialSettings?.footerCategory3Id || "",
        footerCategory4Id: initialSettings?.footerCategory4Id || "",
    });

    // Site Settings State - About Us
    const [aboutHeroTitle, setAboutHeroTitle] = useState(initialSettings?.aboutHeroTitle || "");
    const [aboutHeroTitleAr, setAboutHeroTitleAr] = useState(initialSettings?.aboutHeroTitleAr || "");
    const [aboutHeroSubtitle, setAboutHeroSubtitle] = useState(initialSettings?.aboutHeroSubtitle || "");
    const [aboutHeroSubtitleAr, setAboutHeroSubtitleAr] = useState(initialSettings?.aboutHeroSubtitleAr || "");
    const [aboutHeroImage, setAboutHeroImage] = useState(initialSettings?.aboutHeroImage || "");
    
    const [aboutNarrativeTitle, setAboutNarrativeTitle] = useState(initialSettings?.aboutNarrativeTitle || "");
    const [aboutNarrativeTitleAr, setAboutNarrativeTitleAr] = useState(initialSettings?.aboutNarrativeTitleAr || "");
    const [aboutNarrativeFounded, setAboutNarrativeFounded] = useState(initialSettings?.aboutNarrativeFounded || "Founded in 2024");
    const [aboutNarrativeFoundedAr, setAboutNarrativeFoundedAr] = useState(initialSettings?.aboutNarrativeFoundedAr || "تأسست في 2024");
    const [aboutNarrativeDesc1, setAboutNarrativeDesc1] = useState(initialSettings?.aboutNarrativeDesc1 || "");
    const [aboutNarrativeDesc1Ar, setAboutNarrativeDesc1Ar] = useState(initialSettings?.aboutNarrativeDesc1Ar || "");
    const [aboutNarrativeDesc2, setAboutNarrativeDesc2] = useState(initialSettings?.aboutNarrativeDesc2 || "");
    const [aboutNarrativeDesc2Ar, setAboutNarrativeDesc2Ar] = useState(initialSettings?.aboutNarrativeDesc2Ar || "");
    const [aboutNarrativeQuote, setAboutNarrativeQuote] = useState(initialSettings?.aboutNarrativeQuote || "");
    const [aboutNarrativeQuoteAr, setAboutNarrativeQuoteAr] = useState(initialSettings?.aboutNarrativeQuoteAr || "");
    const [aboutNarrativeImage, setAboutNarrativeImage] = useState(initialSettings?.aboutNarrativeImage || "");

    // Site Settings State - Shipping & Returns
    const [shippingTitle, setShippingTitle] = useState(initialSettings?.shippingTitle || "");
    const [shippingDesc, setShippingDesc] = useState(initialSettings?.shippingDesc || "");
    const [shippingTitleAr, setShippingTitleAr] = useState(initialSettings?.shippingTitleAr || "");
    const [shippingDescAr, setShippingDescAr] = useState(initialSettings?.shippingDescAr || "");

    const [verificationTitle, setVerificationTitle] = useState(initialSettings?.verificationTitle || "");
    const [verificationDesc, setVerificationDesc] = useState(initialSettings?.verificationDesc || "");
    const [verificationTitleAr, setVerificationTitleAr] = useState(initialSettings?.verificationTitleAr || "");
    const [verificationDescAr, setVerificationDescAr] = useState(initialSettings?.verificationDescAr || "");

    const [standardShippingTime, setStandardShippingTime] = useState(initialSettings?.standardShippingTime || "");
    const [expressShippingTime, setExpressShippingTime] = useState(initialSettings?.expressShippingTime || "");

    const [returnsTitle, setReturnsTitle] = useState(initialSettings?.returnsTitle || "");
    const [returnsDesc, setReturnsDesc] = useState(initialSettings?.returnsDesc || "");
    const [returnsTitleAr, setReturnsTitleAr] = useState(initialSettings?.returnsTitleAr || "");
    const [returnsDescAr, setReturnsDescAr] = useState(initialSettings?.returnsDescAr || "");

    const [finalSaleTitle, setFinalSaleTitle] = useState(initialSettings?.finalSaleTitle || "");
    const [finalSaleDesc, setFinalSaleDesc] = useState(initialSettings?.finalSaleDesc || "");
    const [finalSaleTitleAr, setFinalSaleTitleAr] = useState(initialSettings?.finalSaleTitleAr || "");
    const [finalSaleDescAr, setFinalSaleDescAr] = useState(initialSettings?.finalSaleDescAr || "");

    const [hygieneTitle, setHygieneTitle] = useState(initialSettings?.hygieneTitle || "");
    const [hygieneDesc, setHygieneDesc] = useState(initialSettings?.hygieneDesc || "");
    const [hygieneTitleAr, setHygieneTitleAr] = useState(initialSettings?.hygieneTitleAr || "");
    const [hygieneDescAr, setHygieneDescAr] = useState(initialSettings?.hygieneDescAr || "");

    const [shippingReturnsImage, setShippingReturnsImage] = useState(initialSettings?.shippingReturnsImage || "");

    const [exchangeRate, setExchangeRate] = useState(initialSettings?.exchangeRate || 135);

    // Middle Banner 1
    const [middleBanner1Image, setMiddleBanner1Image] = useState(initialSettings?.middleBanner1Image || "");
    const [middleBanner1Link, setMiddleBanner1Link] = useState(initialSettings?.middleBanner1Link || "");

    // Middle Banner 2
    const [middleBanner2Image, setMiddleBanner2Image] = useState(initialSettings?.middleBanner2Image || "");
    const [middleBanner2Link, setMiddleBanner2Link] = useState(initialSettings?.middleBanner2Link || "");
    const [middleBanner2Title, setMiddleBanner2Title] = useState(initialSettings?.middleBanner2Title || "");
    const [middleBanner2TitleAr, setMiddleBanner2TitleAr] = useState(initialSettings?.middleBanner2TitleAr || "");
    const [middleBanner2Subtitle, setMiddleBanner2Subtitle] = useState(initialSettings?.middleBanner2Subtitle || "");
    const [middleBanner2SubtitleAr, setMiddleBanner2SubtitleAr] = useState(initialSettings?.middleBanner2SubtitleAr || "");
    const [middleBanner2ButtonText, setMiddleBanner2ButtonText] = useState(initialSettings?.middleBanner2ButtonText || "");
    const [middleBanner2ButtonTextAr, setMiddleBanner2ButtonTextAr] = useState(initialSettings?.middleBanner2ButtonTextAr || "");

    const [featuredCollection, setFeaturedCollection] = useState({
        featuredCollectionEnabled: initialSettings?.featuredCollectionEnabled !== false,
        featuredCollectionNewArrivalsEnabled: initialSettings?.featuredCollectionNewArrivalsEnabled !== false,
        featuredCollectionBestSellersEnabled: initialSettings?.featuredCollectionBestSellersEnabled !== false,
        featuredCollectionTitle: initialSettings?.featuredCollectionTitle || "",
        featuredCollectionTitleAr: initialSettings?.featuredCollectionTitleAr || "",
        featuredCollectionNewArrivalsLabel: initialSettings?.featuredCollectionNewArrivalsLabel || "",
        featuredCollectionNewArrivalsLabelAr: initialSettings?.featuredCollectionNewArrivalsLabelAr || "",
        featuredCollectionBestSellersLabel: initialSettings?.featuredCollectionBestSellersLabel || "",
        featuredCollectionBestSellersLabelAr: initialSettings?.featuredCollectionBestSellersLabelAr || "",
        featuredCollectionAllProductsLabel: initialSettings?.featuredCollectionAllProductsLabel || "",
        featuredCollectionAllProductsLabelAr: initialSettings?.featuredCollectionAllProductsLabelAr || "",
        featuredCollectionAllProductsUrl: initialSettings?.featuredCollectionAllProductsUrl || "",
    });

    const handleFooterFieldChange = (field: string, value: string) => {
        setFooterContent((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSaveAll = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await updateSiteSettings({
                exchangeRate: Number(exchangeRate) || 135,
                headerNavItems: JSON.stringify(headerNavItems),
                categoriesCtaTitle: ctaTitle,
                categoriesCtaDesc: ctaDesc,
                categoriesCtaTitleAr: ctaTitleAr,
                categoriesCtaDescAr: ctaDescAr,
                categoriesCtaImage: ctaImage,
                ...footerContent,
                footerCategory1Id: footerContent.footerCategory1Id || null,
                footerCategory2Id: footerContent.footerCategory2Id || null,
                footerCategory3Id: footerContent.footerCategory3Id || null,
                footerCategory4Id: footerContent.footerCategory4Id || null,
                shippingTitle,
                shippingDesc,
                shippingTitleAr,
                shippingDescAr,
                verificationTitle,
                verificationDesc,
                verificationTitleAr,
                verificationDescAr,
                standardShippingTime,
                expressShippingTime,
                returnsTitle,
                returnsDesc,
                returnsTitleAr,
                returnsDescAr,
                finalSaleTitle,
                finalSaleDesc,
                finalSaleTitleAr,
                finalSaleDescAr,
                hygieneTitle,
                hygieneDesc,
                hygieneTitleAr,
                hygieneDescAr,
                shippingReturnsImage,
                aboutHeroTitle,
                aboutHeroTitleAr,
                aboutHeroSubtitle,
                aboutHeroSubtitleAr,
                aboutHeroImage,
                aboutNarrativeTitle,
                aboutNarrativeTitleAr,
                aboutNarrativeFounded,
                aboutNarrativeFoundedAr,
                aboutNarrativeDesc1,
                aboutNarrativeDesc1Ar,
                aboutNarrativeDesc2,
                aboutNarrativeDesc2Ar,
                aboutNarrativeQuote,
                aboutNarrativeQuoteAr,
                aboutNarrativeImage,
                middleBanner1Image,
                middleBanner1Link,
                middleBanner2Image,
                middleBanner2Link,
                middleBanner2Title,
                middleBanner2TitleAr,
                middleBanner2Subtitle,
                middleBanner2SubtitleAr,
                middleBanner2ButtonText,
                middleBanner2ButtonTextAr,
                ...featuredCollection,
            });

            if (result.success) {
                toast.success(t('admin.settingsUpdated') || "Settings updated successfully!");
            } else {
                toast.error(result.error || t('admin.failedToUpdate') || "Failed to update settings");
            }
        } catch (error) {
            console.error("Error updating settings:", error);
            toast.error(t('admin.failedToUpdate') || "Failed to update");
        } finally {
            setIsSubmitting(false);
        }
    };

    const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
        { id: "currency", label: t('admin.tabCurrency') || "Currency & Rates", icon: <MdCurrencyExchange className="text-lg" /> },
        { id: "navigation", label: t('admin.tabNavigation') || "Header Navigation", icon: <ListOrdered className="text-lg" /> },
        { id: "footer", label: t('admin.tabFooter') || "Footer & Social", icon: <MdStorefront className="text-lg" /> },
        { id: "banners", label: t('admin.tabBanners') || "Promo Banners", icon: <MdViewCarousel className="text-lg" /> },
        { id: "featured", label: t('admin.tabFeaturedCollection') || "Featured Collection", icon: <MdViewCarousel className="text-lg" /> },
        { id: "shipping", label: t('admin.tabShipping') || "Shipping & Policy", icon: <MdLocalShipping className="text-lg" /> },
        { id: "about", label: t('admin.tabAbout') || "About Us Story", icon: <MdInfoOutline className="text-lg" /> },
    ];

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-[var(--color-background-dark)]">
            <AdminHeader title={t('admin.siteContent')} onMenuClick={openSidebar} />

            {/* Sub-Header & Sticky Action Bar */}
            <div className="bg-white dark:bg-[var(--color-surface-dark)] border-b border-slate-200/80 dark:border-white/10 px-6 md:px-10 py-5 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {t('admin.siteContent')}
                        </h2>
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {t('admin.siteContentSubtitle') || "Customize pages, banners, policies, and store information across both languages."}
                        </p>
                    </div>

                    <button
                        onClick={() => handleSaveAll()}
                        disabled={isSubmitting}
                        className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed self-start md:self-auto"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                                <span>{t('admin.saving')}</span>
                            </>
                        ) : (
                            <>
                                <MdSave className="text-lg" />
                                <span>{t('admin.saveChanges')}</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="max-w-6xl mx-auto mt-5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                                    isActive
                                        ? 'bg-[var(--color-brand)] text-white shadow-xs'
                                        : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                                }`}
                            >
                                <span className={isActive ? 'text-[var(--color-accent-light)]' : 'text-slate-400'}>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-6xl mx-auto pb-12">
                    {/* TAB 1: CURRENCY & EXCHANGE RATES */}
                    {activeTab === "currency" && (
                        <div className="bg-white dark:bg-[var(--color-surface-dark)] rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 md:p-8 shadow-xs animate-in fade-in-50 duration-200">
                            <div className="mb-6 flex items-start gap-4">
                                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-[var(--color-accent)] dark:text-[var(--color-accent-light)] rounded-xl">
                                    <MdCurrencyExchange className="text-2xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {t('admin.currencySettings')}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        {t('admin.currencySettingsDesc')}
                                    </p>
                                </div>
                            </div>

                            <div className="max-w-md space-y-4">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                                    {t('admin.exchangeRateLabel')} (1 USD = X SYP)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={exchangeRate}
                                        onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200/80 dark:border-white/10 rounded-xl text-lg font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-brand)] outline-none transition-all"
                                        placeholder="135"
                                        required
                                    />
                                    <span className="absolute end-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                        SYP / USD
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400">
                                    {t('admin.currencyHelpText') || "All prices stored in USD will be multiplied by this rate when customer views prices in Syrian Pounds."}
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === "navigation" && (
                        <HeaderNavigationSection
                            items={headerNavItems}
                            mainCategories={mainCategories}
                            onChange={setHeaderNavItems}
                        />
                    )}

                    {/* TAB 2: FOOTER & SOCIAL LINKS */}
                    {activeTab === "footer" && (
                        <div className="animate-in fade-in-50 duration-200">
                            <FooterContentSection
                                footerContent={footerContent}
                                categories={categories}
                                onFieldChange={handleFooterFieldChange}
                                t={t}
                            />
                        </div>
                    )}

                    {activeTab === "featured" && (
                        <section className="space-y-6 animate-in fade-in-50 duration-200">
                            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[var(--color-surface-dark)] md:p-8">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {t('admin.featuredCollectionSettingsTitle')}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {t('admin.featuredCollectionSettingsDesc')}
                                </p>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    {([
                                        ['featuredCollectionEnabled', 'admin.featuredCollectionEnabled'],
                                        ['featuredCollectionNewArrivalsEnabled', 'admin.featuredCollectionNewArrivalsEnabled'],
                                        ['featuredCollectionBestSellersEnabled', 'admin.featuredCollectionBestSellersEnabled'],
                                    ] as const).map(([key, labelKey]) => (
                                        <label key={key} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-slate-200">
                                            <input
                                                type="checkbox"
                                                checked={featuredCollection[key]}
                                                onChange={(event) => setFeaturedCollection((current) => ({ ...current, [key]: event.target.checked }))}
                                                className="size-4 accent-[var(--color-brand)]"
                                            />
                                            {t(labelKey)}
                                        </label>
                                    ))}
                                </div>

                                <div className="mt-7 grid gap-6 lg:grid-cols-2">
                                    <div className="space-y-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/40">
                                        <h4 className="font-bold text-slate-800 dark:text-white">English</h4>
                                        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
                                            {t('admin.featuredCollectionTitleLabel')}
                                            <input value={featuredCollection.featuredCollectionTitle} onChange={(event) => setFeaturedCollection((current) => ({ ...current, featuredCollectionTitle: event.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-brand)] dark:border-white/10 dark:bg-gray-800 dark:text-white" />
                                        </label>
                                        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
                                            {t('admin.featuredCollectionNewArrivalsLabel')}
                                            <input value={featuredCollection.featuredCollectionNewArrivalsLabel} onChange={(event) => setFeaturedCollection((current) => ({ ...current, featuredCollectionNewArrivalsLabel: event.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-brand)] dark:border-white/10 dark:bg-gray-800 dark:text-white" />
                                        </label>
                                        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
                                            {t('admin.featuredCollectionBestSellersLabel')}
                                            <input value={featuredCollection.featuredCollectionBestSellersLabel} onChange={(event) => setFeaturedCollection((current) => ({ ...current, featuredCollectionBestSellersLabel: event.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-brand)] dark:border-white/10 dark:bg-gray-800 dark:text-white" />
                                        </label>
                                        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
                                            {t('admin.featuredCollectionAllProductsLabel')}
                                            <input value={featuredCollection.featuredCollectionAllProductsLabel} onChange={(event) => setFeaturedCollection((current) => ({ ...current, featuredCollectionAllProductsLabel: event.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-brand)] dark:border-white/10 dark:bg-gray-800 dark:text-white" />
                                        </label>
                                    </div>

                                    <div className="space-y-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/40" dir="rtl">
                                        <h4 className="font-bold text-slate-800 dark:text-white">العربية</h4>
                                        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
                                            {t('admin.featuredCollectionTitleLabel')}
                                            <input value={featuredCollection.featuredCollectionTitleAr} onChange={(event) => setFeaturedCollection((current) => ({ ...current, featuredCollectionTitleAr: event.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-brand)] dark:border-white/10 dark:bg-gray-800 dark:text-white" />
                                        </label>
                                        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
                                            {t('admin.featuredCollectionNewArrivalsLabel')}
                                            <input value={featuredCollection.featuredCollectionNewArrivalsLabelAr} onChange={(event) => setFeaturedCollection((current) => ({ ...current, featuredCollectionNewArrivalsLabelAr: event.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-brand)] dark:border-white/10 dark:bg-gray-800 dark:text-white" />
                                        </label>
                                        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
                                            {t('admin.featuredCollectionBestSellersLabel')}
                                            <input value={featuredCollection.featuredCollectionBestSellersLabelAr} onChange={(event) => setFeaturedCollection((current) => ({ ...current, featuredCollectionBestSellersLabelAr: event.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-brand)] dark:border-white/10 dark:bg-gray-800 dark:text-white" />
                                        </label>
                                        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
                                            {t('admin.featuredCollectionAllProductsLabel')}
                                            <input value={featuredCollection.featuredCollectionAllProductsLabelAr} onChange={(event) => setFeaturedCollection((current) => ({ ...current, featuredCollectionAllProductsLabelAr: event.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-brand)] dark:border-white/10 dark:bg-gray-800 dark:text-white" />
                                        </label>
                                    </div>
                                </div>

                                <label className="mt-6 block max-w-2xl text-sm font-semibold text-slate-600 dark:text-slate-300">
                                    {t('admin.featuredCollectionAllProductsUrl')}
                                    <input value={featuredCollection.featuredCollectionAllProductsUrl} onChange={(event) => setFeaturedCollection((current) => ({ ...current, featuredCollectionAllProductsUrl: event.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-brand)] dark:border-white/10 dark:bg-gray-800 dark:text-white" placeholder="/products" dir="ltr" />
                                </label>
                            </div>

                            <p className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
                                {t('admin.featuredCollectionProductManagementNote')}
                            </p>
                        </section>
                    )}

                    {/* TAB 3: PROMO & MIDDLE BANNERS */}
                    {activeTab === "banners" && (
                        <div className="space-y-8 animate-in fade-in-50 duration-200">
                            {/* Categories CTA Banner */}
                            <div className="bg-white dark:bg-[var(--color-surface-dark)] rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 md:p-8 shadow-xs">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {t('admin.categoriesCtaBanner') || "Categories CTA Banner"}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        {t('admin.categoriesCtaBannerDesc') || "Control the Call To Action banner shown on the Categories landing page."}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                            {t('admin.imageUrl')}
                                        </label>
                                        <div className="flex gap-4 items-start">
                                            <input
                                                type="text"
                                                value={ctaImage}
                                                onChange={(e) => setCtaImage(e.target.value)}
                                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-brand)] outline-none text-sm"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                            <div className="w-28 h-16 rounded-xl border border-slate-200/80 dark:border-white/10 overflow-hidden bg-slate-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                                {ctaImage ? (
                                                    <img src={ctaImage} alt="CTA Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                                ) : (
                                                    <MdImage className="text-2xl text-slate-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-md text-slate-700 dark:text-slate-300">🇬🇧 English</span>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">{t('admin.bannerTitle') || "Title"}</label>
                                                <input type="text" value={ctaTitle} onChange={(e) => setCtaTitle(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">{t('admin.description')}</label>
                                                <textarea rows={3} value={ctaDesc} onChange={(e) => setCtaDesc(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm resize-none" />
                                            </div>
                                        </div>

                                        <div className="space-y-4" dir="rtl">
                                            <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-md text-slate-700 dark:text-slate-300">🇸🇦 العربية</span>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">{t('admin.bannerTitle') || "العنوان"}</label>
                                                <input type="text" value={ctaTitleAr} onChange={(e) => setCtaTitleAr(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">{t('admin.description')}</label>
                                                <textarea rows={3} value={ctaDescAr} onChange={(e) => setCtaDescAr(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm resize-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Middle Banner 1 */}
                            <div className="bg-white dark:bg-[var(--color-surface-dark)] rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 md:p-8 shadow-xs">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {t('admin.middleBanner1') || "Middle Banner 1 (After Trending)"}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        {t('admin.middleBanner1Desc') || "Control the full-width banner that appears after the Trending Products section."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-200">{t('admin.imageUrl')}</label>
                                        <input type="text" value={middleBanner1Image} onChange={(e) => setMiddleBanner1Image(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" placeholder="https://..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-200">{t('admin.linkUrl')}</label>
                                        <input type="text" value={middleBanner1Link} onChange={(e) => setMiddleBanner1Link(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" placeholder="/categories or /products" />
                                    </div>
                                </div>
                            </div>

                            {/* Middle Banner 2 */}
                            <div className="bg-white dark:bg-[var(--color-surface-dark)] rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 md:p-8 shadow-xs">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {t('admin.middleBanner2') || "Middle Banner 2 (After Featured Collection)"}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        {t('admin.middleBanner2Desc') || "Configure the secondary promotional banner with call to action button."}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">{t('admin.imageUrl')}</label>
                                            <input type="text" value={middleBanner2Image} onChange={(e) => setMiddleBanner2Image(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" placeholder="https://..." />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">{t('admin.linkUrl')}</label>
                                            <input type="text" value={middleBanner2Link} onChange={(e) => setMiddleBanner2Link(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" placeholder="/categories" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-md text-slate-700 dark:text-slate-300">🇬🇧 English</span>
                                            <input type="text" value={middleBanner2Title} onChange={(e) => setMiddleBanner2Title(e.target.value)} placeholder="Title" className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                            <input type="text" value={middleBanner2Subtitle} onChange={(e) => setMiddleBanner2Subtitle(e.target.value)} placeholder="Subtitle" className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                            <input type="text" value={middleBanner2ButtonText} onChange={(e) => setMiddleBanner2ButtonText(e.target.value)} placeholder="Button Text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                        </div>
                                        <div className="space-y-3" dir="rtl">
                                            <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-md text-slate-700 dark:text-slate-300">🇸🇦 العربية</span>
                                            <input type="text" value={middleBanner2TitleAr} onChange={(e) => setMiddleBanner2TitleAr(e.target.value)} placeholder="العنوان" className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                            <input type="text" value={middleBanner2SubtitleAr} onChange={(e) => setMiddleBanner2SubtitleAr(e.target.value)} placeholder="العنوان الفرعي" className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                            <input type="text" value={middleBanner2ButtonTextAr} onChange={(e) => setMiddleBanner2ButtonTextAr(e.target.value)} placeholder="نص الزر" className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: SHIPPING & POLICIES */}
                    {activeTab === "shipping" && (
                        <div className="space-y-8 animate-in fade-in-50 duration-200">
                            {/* Shipping & Delivery Timelines */}
                            <div className="bg-white dark:bg-[var(--color-surface-dark)] rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 md:p-8 shadow-xs">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {t('admin.shippingSection') || "Shipping & Delivery Policy"}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        {t('admin.shippingSectionDesc') || "Configure customer-facing shipping timeline details and inspection instructions."}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">{t('admin.standardShippingTime') || "Standard Shipping Timeline"}</label>
                                            <input type="text" value={standardShippingTime} onChange={(e) => setStandardShippingTime(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" placeholder="1-3 Business Days" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">{t('admin.expressShippingTime') || "Express Shipping Timeline"}</label>
                                            <input type="text" value={expressShippingTime} onChange={(e) => setExpressShippingTime(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" placeholder="Within 24 Hours" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-md text-slate-700 dark:text-slate-300">🇬🇧 English</span>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">{t('admin.shippingTitle') || "Policy Title"}</label>
                                                <input type="text" value={shippingTitle} onChange={(e) => setShippingTitle(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">{t('admin.shippingDesc') || "Description"}</label>
                                                <textarea rows={3} value={shippingDesc} onChange={(e) => setShippingDesc(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm resize-none" />
                                            </div>
                                        </div>

                                        <div className="space-y-4" dir="rtl">
                                            <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-md text-slate-700 dark:text-slate-300">🇸🇦 العربية</span>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">{t('admin.shippingTitle') || "عنوان السياسة"}</label>
                                                <input type="text" value={shippingTitleAr} onChange={(e) => setShippingTitleAr(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">{t('admin.shippingDesc') || "الوصف"}</label>
                                                <textarea rows={3} value={shippingDescAr} onChange={(e) => setShippingDescAr(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm resize-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Returns Policy */}
                            <div className="bg-white dark:bg-[var(--color-surface-dark)] rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 md:p-8 shadow-xs">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {t('admin.returnsSection') || "Quality & Claims Policy"}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        {t('admin.returnsSectionDesc') || "Explain terms for wholesale cases, packaging standards, and claim procedures."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-md text-slate-700 dark:text-slate-300">🇬🇧 English</span>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Heading</label>
                                            <input type="text" value={returnsTitle} onChange={(e) => setReturnsTitle(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Policy Content</label>
                                            <textarea rows={4} value={returnsDesc} onChange={(e) => setReturnsDesc(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm resize-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-4" dir="rtl">
                                        <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-md text-slate-700 dark:text-slate-300">🇸🇦 العربية</span>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">العنوان</label>
                                            <input type="text" value={returnsTitleAr} onChange={(e) => setReturnsTitleAr(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">نص السياسة</label>
                                            <textarea rows={4} value={returnsDescAr} onChange={(e) => setReturnsDescAr(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm resize-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: ABOUT US STORY */}
                    {activeTab === "about" && (
                        <div className="space-y-8 animate-in fade-in-50 duration-200">
                            {/* Hero Header */}
                            <div className="bg-white dark:bg-[var(--color-surface-dark)] rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 md:p-8 shadow-xs">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {t('admin.aboutHero') || "About Us Hero Header"}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        {t('admin.aboutHeroDesc') || "Top banner text and background photo for the /about-us page."}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-200">{t('admin.imageUrl')}</label>
                                        <input type="text" value={aboutHeroImage} onChange={(e) => setAboutHeroImage(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" placeholder="https://..." />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-md text-slate-700 dark:text-slate-300">🇬🇧 English</span>
                                            <input type="text" value={aboutHeroTitle} onChange={(e) => setAboutHeroTitle(e.target.value)} placeholder="Hero Title (e.g. Our Story)" className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                            <input type="text" value={aboutHeroSubtitle} onChange={(e) => setAboutHeroSubtitle(e.target.value)} placeholder="Hero Subtitle" className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                        </div>
                                        <div className="space-y-3" dir="rtl">
                                            <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-md text-slate-700 dark:text-slate-300">🇸🇦 العربية</span>
                                            <input type="text" value={aboutHeroTitleAr} onChange={(e) => setAboutHeroTitleAr(e.target.value)} placeholder="عنوان البانر (مثال: قصتنا)" className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                            <input type="text" value={aboutHeroSubtitleAr} onChange={(e) => setAboutHeroSubtitleAr(e.target.value)} placeholder="العنوان الفرعي" className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Narrative */}
                            <div className="bg-white dark:bg-[var(--color-surface-dark)] rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 md:p-8 shadow-xs">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {t('admin.aboutNarrative') || "Company Story & Narrative"}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        {t('admin.aboutNarrativeDesc') || "Detailed mission paragraphs, founding badge, and brand motto."}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-md text-slate-700 dark:text-slate-300">🇬🇧 English</span>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">Badge Text</label>
                                                <input type="text" value={aboutNarrativeFounded} onChange={(e) => setAboutNarrativeFounded(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">Section Title</label>
                                                <input type="text" value={aboutNarrativeTitle} onChange={(e) => setAboutNarrativeTitle(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">Paragraph 1</label>
                                                <textarea rows={3} value={aboutNarrativeDesc1} onChange={(e) => setAboutNarrativeDesc1(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm resize-none" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">Paragraph 2</label>
                                                <textarea rows={3} value={aboutNarrativeDesc2} onChange={(e) => setAboutNarrativeDesc2(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm resize-none" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">Brand Quote / Motto</label>
                                                <input type="text" value={aboutNarrativeQuote} onChange={(e) => setAboutNarrativeQuote(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                            </div>
                                        </div>

                                        <div className="space-y-4" dir="rtl">
                                            <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-md text-slate-700 dark:text-slate-300">🇸🇦 العربية</span>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">نص الشارة</label>
                                                <input type="text" value={aboutNarrativeFoundedAr} onChange={(e) => setAboutNarrativeFoundedAr(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">عنوان القسم</label>
                                                <input type="text" value={aboutNarrativeTitleAr} onChange={(e) => setAboutNarrativeTitleAr(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">الفقرة الأولى</label>
                                                <textarea rows={3} value={aboutNarrativeDesc1Ar} onChange={(e) => setAboutNarrativeDesc1Ar(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm resize-none" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">الفقرة الثانية</label>
                                                <textarea rows={3} value={aboutNarrativeDesc2Ar} onChange={(e) => setAboutNarrativeDesc2Ar(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm resize-none" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">الاقتباس أو الشعار</label>
                                                <input type="text" value={aboutNarrativeQuoteAr} onChange={(e) => setAboutNarrativeQuoteAr(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

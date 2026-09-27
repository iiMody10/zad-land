"use client";

import { useLanguage } from "@/app/context/LanguageContext";

/** A visual price placeholder. The real amount is never rendered as text. */
export default function HiddenPrice({ className = "" }: { className?: string }) {
    const { language } = useLanguage();

    return (
        <span
            role="text"
            aria-label={language === "ar" ? "السعر مخفي" : "Price hidden"}
            className={`relative inline-flex max-w-full items-center overflow-hidden rounded-md ${className}`}
        >
            <span aria-hidden="true" dir="ltr" className="select-none whitespace-nowrap blur-[6px]">$000.00</span>
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white/20 dark:bg-zinc-900/20" />
        </span>
    );
}

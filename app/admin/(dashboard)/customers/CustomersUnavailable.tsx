"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { AlertTriangle, RotateCw } from "lucide-react";
import AdminHeader from "../../components/AdminHeader";
import { useAdminSidebar } from "../../context/AdminSidebarContext";

export default function CustomersUnavailable() {
    const { t, language, dir } = useLanguage();
    const { openSidebar } = useAdminSidebar();
    const isArabic = language === "ar";

    return (
        <div dir={dir} className="flex flex-1 flex-col overflow-hidden bg-background-light dark:bg-background-dark">
            <AdminHeader title={t("admin.merchantAccounts")} onMenuClick={openSidebar} />
            <main className="flex flex-1 items-center justify-center p-4 sm:p-8">
                <section className="w-full max-w-2xl rounded-2xl border border-amber-200 bg-white p-6 text-center shadow-sm dark:border-amber-900/50 dark:bg-[var(--color-surface-dark)] sm:p-10">
                    <AlertTriangle className="mx-auto mb-4 size-8 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                        {isArabic ? "تعذر تحميل حسابات التجار" : "Merchant accounts could not be loaded"}
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        {isArabic ? "تعذر الاتصال بالخادم. أعد المحاولة بعد قليل." : "The backend could not be reached. Please try again shortly."}
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                    >
                        <RotateCw size={16} aria-hidden="true" />
                        {isArabic ? "إعادة المحاولة" : "Try again"}
                    </button>
                </section>
            </main>
        </div>
    );
}

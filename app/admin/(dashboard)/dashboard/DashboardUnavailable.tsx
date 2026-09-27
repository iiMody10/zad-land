"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { useAdminSidebar } from "../../context/AdminSidebarContext";
import AdminHeader from "../../components/AdminHeader";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function DashboardUnavailable() {
    const { t, language, dir } = useLanguage();
    const { openSidebar } = useAdminSidebar();
    const isArabic = language === "ar";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[var(--color-canvas-dark)]" dir={dir}>
            <AdminHeader title={t("admin.dashboard")} onMenuClick={openSidebar} />
            <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-12 sm:px-6">
                <section className="w-full rounded-2xl border border-amber-200 bg-white p-6 text-center shadow-sm dark:border-amber-900/50 dark:bg-[var(--color-surface-dark)] sm:p-10">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                        <AlertTriangle aria-hidden="true" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                        {isArabic ? "تعذر تحميل بيانات لوحة التحكم" : "Dashboard data could not be loaded"}
                    </h1>
                    <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {isArabic
                            ? "لم نتمكن من الاتصال بالخادم. أعد المحاولة بعد قليل؛ لم يتم عرض أرقام افتراضية حتى لا تبدو البيانات غير الصحيحة حقيقية."
                            : "The backend could not be reached. Try again shortly. We did not substitute zeroes, so unavailable data cannot be mistaken for real totals."}
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

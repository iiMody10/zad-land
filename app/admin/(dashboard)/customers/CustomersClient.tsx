"use client";

import { useMemo, useState } from "react";
import { Search, Store, Clock3, CircleCheck, MapPin, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { laravelClientFetch } from "@/lib/laravel-client";
import { useLanguage } from "@/app/context/LanguageContext";
import AdminHeader from "../../components/AdminHeader";
import { useAdminSidebar } from "../../context/AdminSidebarContext";

type Merchant = {
    id: string;
    shopName: string;
    ownerName: string;
    phone: string;
    city: string;
    address: string;
    notes: string | null;
    isActive: boolean;
    createdAt: string;
    _count?: { orders?: number; wishlistItems?: number };
};

export default function CustomersClient({ initialCustomers }: { initialCustomers: Merchant[] }) {
    const { t, dir, language } = useLanguage();
    const { openSidebar } = useAdminSidebar();
    const [customers, setCustomers] = useState(initialCustomers);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const isArabic = language === "ar";
    const numberLocale = isArabic ? "ar" : "en";

    const visible = useMemo(() => customers.filter((customer) =>
        `${customer.shopName} ${customer.ownerName} ${customer.phone} ${customer.city}`
            .toLowerCase().includes(search.trim().toLowerCase())
    ), [customers, search]);
    const pending = visible.filter((customer) => !customer.isActive);
    const active = visible.filter((customer) => customer.isActive);

    const updateStatus = async (id: string, isActive: boolean) => {
        setBusyId(id);
        try {
            const response = await laravelClientFetch("/api/admin/customers", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isActive }),
            });
            if (!response.ok) throw new Error("Could not update merchant");
            setCustomers((current) => current.map((customer) => customer.id === id ? { ...customer, isActive } : customer));
            toast.success(t(isActive ? "admin.merchantApproved" : "admin.merchantSuspended"));
        } catch {
            toast.error(t("admin.merchantUpdateFailed"));
        } finally {
            setBusyId(null);
        }
    };

    const renderList = (items: Merchant[], isPending: boolean) => items.length ? (
        <div className="grid gap-3">
            {items.map((customer) => (
                <article key={customer.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-[var(--color-surface-dark)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{customer.shopName}</h3>
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${isPending ? "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"}`}>
                                {t(isPending ? "admin.pendingApproval" : "admin.merchantActive")}
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{customer.ownerName}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1.5"><Phone className="size-3.5" aria-hidden="true" />{customer.phone}</span>
                            <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" aria-hidden="true" />{customer.city}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{customer.address}{customer.notes ? ` · ${customer.notes}` : ""}</p>
                        <p className="text-xs font-semibold text-[var(--color-brand-hover)] dark:text-[var(--color-accent-light)]">
                            {customer._count?.orders ?? 0} {t("admin.merchantOrders")} <span aria-hidden="true">·</span> {customer._count?.wishlistItems ?? 0} {t("admin.merchantSavedProducts")}
                        </p>
                    </div>
                    <button
                        type="button"
                        disabled={busyId === customer.id}
                        onClick={() => updateStatus(customer.id, !customer.isActive)}
                        className={`inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors disabled:cursor-wait disabled:opacity-50 sm:min-w-36 ${isPending ? "bg-emerald-700 hover:bg-emerald-800" : "bg-slate-600 hover:bg-slate-700"}`}
                    >
                        {isPending ? <CircleCheck className="size-4" aria-hidden="true" /> : null}
                        {t(isPending ? "admin.approveMerchant" : "admin.suspendMerchant")}
                    </button>
                </article>
            ))}
        </div>
    ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-5 py-10 text-center dark:border-white/15 dark:bg-white/[0.02]">
            <Store className="mx-auto mb-3 size-8 text-slate-300 dark:text-slate-600" aria-hidden="true" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{search ? t("admin.noMerchantMatches") : t("admin.noMerchants")}</p>
        </div>
    );

    const statCards = [
        { label: t("admin.totalMerchants"), value: customers.length, icon: Store, tone: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300" },
        { label: t("admin.pendingApproval"), value: customers.filter((customer) => !customer.isActive).length, icon: Clock3, tone: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300" },
        { label: t("admin.activeMerchants"), value: customers.filter((customer) => customer.isActive).length, icon: CircleCheck, tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" },
    ];

    return (
        <div dir={dir} className="flex flex-1 flex-col overflow-hidden bg-[var(--color-canvas)] dark:bg-[var(--color-background-dark)]">
            <AdminHeader title={t("admin.merchantAccounts")} onMenuClick={openSidebar} />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                <div className="mx-auto flex max-w-[1440px] flex-col gap-6">
                    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] dark:text-[var(--color-accent-light)]">
                                <span className="size-2.5 rounded-full bg-[var(--color-accent)]" />
                                {t("admin.merchantManagement")}
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-brand)] dark:text-white sm:text-3xl">{t("admin.merchantAccounts")}</h1>
                            <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{t("admin.merchantAccountsDescription")}</p>
                        </div>
                        <label className="relative block w-full sm:max-w-sm">
                            <span className="sr-only">{t("admin.searchMerchants")}</span>
                            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder={t("admin.merchantSearchPlaceholder")}
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white ps-10 pe-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 dark:border-white/10 dark:bg-[var(--color-surface-dark)] dark:text-white"
                            />
                        </label>
                    </header>

                    <section aria-label={t("admin.merchantSummary")} className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                        {statCards.map(({ label, value, icon: Icon, tone }) => (
                            <article key={label} className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[var(--color-surface-dark)] sm:p-5">
                                <div>
                                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
                                    <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{value.toLocaleString(numberLocale)}</p>
                                </div>
                                <span className={`grid size-11 place-items-center rounded-xl ${tone}`}><Icon className="size-5" aria-hidden="true" /></span>
                            </article>
                        ))}
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t("admin.pendingApproval")}</h2>
                            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">{pending.length.toLocaleString(numberLocale)}</span>
                        </div>
                        {renderList(pending, true)}
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t("admin.activeMerchants")}</h2>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">{active.length.toLocaleString(numberLocale)}</span>
                        </div>
                        {renderList(active, false)}
                    </section>
                </div>
            </main>
        </div>
    );
}

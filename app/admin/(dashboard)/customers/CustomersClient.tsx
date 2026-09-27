"use client";

import { laravelClientFetch } from "@/lib/laravel-client";

import { useState } from "react";
import toast from "react-hot-toast";

type Merchant = { id: string; shopName: string; ownerName: string; phone: string; city: string; address: string; notes: string | null; isActive: boolean; createdAt: string; _count: { orders: number; wishlistItems: number } };

export default function CustomersClient({ initialCustomers }: { initialCustomers: Merchant[] }) {
    const [customers, setCustomers] = useState(initialCustomers);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const visible = customers.filter((customer) => `${customer.shopName} ${customer.ownerName} ${customer.phone} ${customer.city}`.toLowerCase().includes(search.trim().toLowerCase()));
    const pending = visible.filter((customer) => !customer.isActive);
    const active = visible.filter((customer) => customer.isActive);

    const updateStatus = async (id: string, isActive: boolean) => {
        setBusyId(id);
        try {
            const response = await laravelClientFetch("/api/admin/customers", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, isActive }) });
            if (!response.ok) throw new Error("Could not update merchant");
            setCustomers((current) => current.map((customer) => customer.id === id ? { ...customer, isActive } : customer));
            toast.success(isActive ? "Merchant approved" : "Merchant access suspended");
        } catch {
            toast.error("Could not update merchant");
        } finally {
            setBusyId(null);
        }
    };

    const renderList = (items: Merchant[]) => items.length ? (
        <div className="grid gap-3">
            {items.map((customer) => <article key={customer.id} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[var(--color-surface-dark)] sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">{customer.shopName}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{customer.ownerName} · {customer.phone} · {customer.city}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{customer.address}{customer.notes ? ` · ${customer.notes}` : ""}</p>
                    <p className="text-xs font-semibold text-[var(--color-brand-hover)]">{customer._count?.orders ?? 0} orders · {customer._count?.wishlistItems ?? 0} saved products</p>
                </div>
                <button type="button" disabled={busyId === customer.id} onClick={() => updateStatus(customer.id, !customer.isActive)} className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold text-white disabled:opacity-50 ${customer.isActive ? "bg-slate-600" : "bg-emerald-700"}`}>
                    {customer.isActive ? "Suspend access" : "Approve merchant"}
                </button>
            </article>)}
        </div>
    ) : <p className="rounded-xl border border-dashed border-slate-200 p-8 text-sm text-slate-500 dark:border-white/10">No merchants here.</p>;

    return <div className="space-y-9 p-5 sm:p-8">
        <header><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Merchant accounts</h1><p className="mt-2 text-sm text-slate-500">Approved merchants can access wholesale prices. Suspended merchants lose access immediately.</p></header>
        <label className="block max-w-md text-sm font-bold text-slate-700 dark:text-white">Search merchants<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Shop, owner, phone, or city" className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal outline-none focus:border-[var(--color-brand-hover)] dark:border-white/15 dark:bg-[var(--color-surface-dark)]" /></label>
        <section className="space-y-4"><h2 className="text-lg font-bold text-slate-900 dark:text-white">Pending approval ({pending.length})</h2>{renderList(pending)}</section>
        <section className="space-y-4"><h2 className="text-lg font-bold text-slate-900 dark:text-white">Active merchants ({active.length})</h2>{renderList(active)}</section>
    </div>;
}

"use client";

import { laravelClientFetch } from "@/lib/laravel-client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Truck as MdLocalShipping, ShoppingBag as MdShoppingBag } from 'lucide-react';
import { useCart } from "@/app/context/CartContext";
import { useLanguage } from "@/app/context/LanguageContext";
import PriceText from "@/app/components/PriceText";
import { formatPackageQuantity } from "@/lib/packaging";

type OrderProduct = {
    id: string; name: string; nameAr: string | null; nameEn: string | null;
    slug: string; images: string; stock: number | null; minOrder: number;
    packaging: string | null; itemsPerPackage: string | null;
    options: string | null; price: string | null; discountPrice: string | null;
    brand: { isActive: boolean };
};
type Order = {
    id: string; status: string; createdAt: string; totalAmount: string;
    city: string; streetAddress: string;
    items: { id: string; quantity: number; price: string; options: string | null; product: OrderProduct }[];
};

const statuses: Record<string, [string, string]> = {
    PENDING: ["بانتظار التأكيد", "Pending"], PROCESSING: ["قيد المعالجة", "Processing"],
    SHIPPED: ["في الطريق", "Shipped"], DELIVERED: ["تم التسليم", "Delivered"],
    CANCELLED: ["ملغي", "Cancelled"],
};

export default function OrderHistory({ customerPhone }: { customerPhone: string }) {
    const { language } = useLanguage();
    const { addItem, openDrawer } = useCart();
    const ar = language === "ar";
    const [orders, setOrders] = useState<Order[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [claimId, setClaimId] = useState("");
    const [claiming, setClaiming] = useState(false);

    const load = useCallback(async (nextPage: number) => {
        setLoading(true);
        setError("");
        try {
            const response = await laravelClientFetch(`/api/customer/orders?page=${nextPage}`, { cache: "no-store" });
            if (!response.ok) throw new Error("Could not load orders");
            const data = await response.json() as { orders: Order[]; hasMore: boolean };
            setOrders((current) => nextPage === 1 ? data.orders : [...current, ...data.orders]);
            setPage(nextPage);
            setHasMore(data.hasMore);
        } catch {
            setError(ar ? "تعذر تحميل الطلبات. حاول مجدداً." : "Could not load orders. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [ar]);

    useEffect(() => { void load(1); }, [load]);

    const claim = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!claimId.trim()) return;
        setClaiming(true);
        try {
            const response = await laravelClientFetch("/api/customer/orders/claim", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: claimId.trim() }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not claim order");
            toast.success(ar ? "تم ربط الطلب بحسابك" : "Order linked to your account");
            setClaimId("");
            await load(1);
        } catch (cause) {
            toast.error(cause instanceof Error ? cause.message : "Could not claim order");
        } finally {
            setClaiming(false);
        }
    };

    const reorder = (order: Order) => {
        let added = 0;
        for (const item of order.items) {
            const product = item.product;
            if (!product?.brand.isActive || (product.stock != null && product.stock < product.minOrder) || product.price == null) continue;
            if (item.options && !product.options?.split(",").map((option) => option.trim()).includes(item.options)) continue;
            const currentPrice = Number(product.price);
            const discounted = Number(product.discountPrice);
            const price = discounted > 0 && discounted < currentPrice ? discounted : currentPrice;
            addItem({
                id: product.id, slug: product.slug,
                name: (ar ? product.nameAr : product.nameEn) || product.name,
                image: product.images.split(",")[0]?.trim() || "",
                price, quantity: product.stock == null ? Math.max(product.minOrder, item.quantity) : Math.min(product.stock, Math.max(product.minOrder, item.quantity)),
                minOrder: product.minOrder, stock: product.stock, packaging: product.packaging,
                itemsPerPackage: product.itemsPerPackage, selectedOption: item.options || undefined,
            });
            added++;
        }
        if (added) { openDrawer(); toast.success(ar ? "أُضيفت المنتجات المتوفرة. راجع الأسعار والكميات الحالية." : "Available items added. Review current prices and quantities."); }
        else toast.error(ar ? "لا توجد منتجات متوفرة لإعادة الطلب." : "No items are available to reorder.");
    };

    return <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-labelledby="orders-heading" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 id="orders-heading" className="text-xl font-bold text-[var(--color-brand)] dark:text-white">{ar ? "سجل الطلبات" : "Order history"}</h2><p className="mt-1 text-sm text-slate-500">{ar ? "تابع حالة طلباتك وأعد طلب المنتجات المتوفرة." : "Track orders and reorder available products."}</p></div><Link href="/products" className="text-sm font-bold text-[var(--color-brand-hover)] hover:underline">{ar ? "تصفح المنتجات" : "Browse products"}</Link></div>
            {error && <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}<button type="button" onClick={() => void load(page || 1)} className="ms-3 font-bold underline">{ar ? "إعادة المحاولة" : "Retry"}</button></div>}
            {loading && page === 0 && <p className="rounded-2xl border border-slate-200 p-8 text-sm text-slate-500">{ar ? "جاري تحميل الطلبات..." : "Loading orders..."}</p>}
            {!loading && !error && orders.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-white/15"><MdShoppingBag className="mx-auto text-3xl text-slate-400"/><h3 className="mt-3 font-bold text-[var(--color-brand)] dark:text-white">{ar ? "لا توجد طلبات بعد" : "No orders yet"}</h3><p className="mt-2 text-sm text-slate-500">{ar ? "ستظهر تفاصيل طلباتك هنا." : "Your orders will appear here."}</p></div>}
            {orders.map((order) => <article key={order.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[var(--color-surface-dark)]">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-5 dark:border-white/10"><div><p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString(ar ? "ar-SY" : "en-US", { year: "numeric", month: "short", day: "numeric" })}</p><h3 className="mt-1 text-sm font-bold text-[var(--color-brand)] dark:text-white">{ar ? "طلب" : "Order"} #{order.id.slice(-8).toUpperCase()}</h3><p className="mt-1 break-all text-[11px] text-slate-400">{order.id}</p></div><div className="text-end"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${order.status === "DELIVERED" ? "bg-emerald-100 text-emerald-800" : order.status === "CANCELLED" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-900"}`}>{statuses[order.status]?.[ar ? 0 : 1] || order.status}</span><div className="mt-2 text-sm font-bold text-[var(--color-brand)] dark:text-white"><PriceText amount={order.totalAmount} /></div></div></div>
                <div className="space-y-3 p-5"><p className="flex items-center gap-2 text-xs text-slate-500"><MdLocalShipping className="text-base" />{order.city} · {order.streetAddress}</p><div className="space-y-2">{order.items.map((item) => <div key={item.id} className="flex items-start justify-between gap-3 text-sm"><div className="min-w-0"><Link href={`/products/${item.product.slug}`} className="font-semibold text-[var(--color-brand)] hover:underline dark:text-white">{(ar ? item.product.nameAr : item.product.nameEn) || item.product.name}</Link><p className="text-xs text-slate-500">{formatPackageQuantity(item.quantity, item.product.packaging, language)}{item.options ? ` · ${item.options}` : ""}</p></div><PriceText amount={Number(item.price) * item.quantity} className="shrink-0 text-xs font-bold text-[var(--color-brand)] dark:text-white" /></div>)}</div><button type="button" onClick={() => reorder(order)} className="mt-2 rounded-xl border border-[var(--color-brand-hover)] px-4 py-2 text-xs font-bold text-[var(--color-brand-hover)] hover:bg-[var(--color-brand-soft)]">{ar ? "إعادة الطلب" : "Reorder available items"}</button></div>
            </article>)}
            {hasMore && <button type="button" disabled={loading} onClick={() => void load(page + 1)} className="w-full rounded-xl border border-slate-300 py-3 text-sm font-bold text-[var(--color-brand)] disabled:opacity-50 dark:border-white/15 dark:text-white">{loading ? (ar ? "جاري التحميل..." : "Loading...") : (ar ? "عرض طلبات أقدم" : "Load older orders")}</button>}
        </section>
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[var(--color-surface-dark)]"><h2 className="text-base font-bold text-[var(--color-brand)] dark:text-white">{ar ? "ربط طلب سابق" : "Claim an earlier order"}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{ar ? "أدخل الرمز المكون من 8 أحرف الموجود في إيصال الطلب أو رقم الطلب الكامل. يجب أن يطابق رقم الجوال في الطلب رقم حسابك المعتمد." : "Enter the 8-character reference on your order receipt or the full order ID. The order phone must match your approved account."}</p><p className="mt-2 text-xs text-slate-500" dir="ltr">{customerPhone}</p><form onSubmit={claim} className="mt-4 space-y-3"><label htmlFor="claim-order-id" className="block text-xs font-bold text-[var(--color-brand)] dark:text-white">{ar ? "رمز الطلب أو رقمه الكامل" : "Order reference or full ID"}</label><input id="claim-order-id" value={claimId} onChange={(event) => setClaimId(event.target.value)} required maxLength={100} className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[var(--color-brand-hover)] dark:border-white/15 dark:bg-zinc-900 dark:text-white" placeholder="A1B2C3D4" /><button type="submit" disabled={claiming} className="w-full rounded-xl bg-[var(--color-brand-hover)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{claiming ? (ar ? "جاري الربط..." : "Claiming...") : (ar ? "ربط الطلب" : "Claim order")}</button></form></aside>
    </div>;
}

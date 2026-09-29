"use client";

import { laravelClientFetch } from "@/lib/laravel-client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PlatformIcon from '@/app/components/PlatformIcon';
import { RefreshCw as MdRefresh } from 'lucide-react';
import { useLanguage } from "@/app/context/LanguageContext";
import { useCurrency } from "@/app/context/CurrencyContext";
import OrderSuccessHeader from "@/app/components/CompleteOrderComponents/OrderSuccessHeader";
import OrderBasicInfo from "@/app/components/CompleteOrderComponents/OrderBasicInfo";
import OrderShippingAndPayment from "@/app/components/CompleteOrderComponents/OrderShippingAndPayment";
import OrderItemsSelection from "@/app/components/CompleteOrderComponents/OrderItemsSelection";
import OrderSupportFooter from "@/app/components/CompleteOrderComponents/OrderSupportFooter";
import { buildWhatsAppOrderUrl, type WhatsAppOrder } from "@/lib/order-whatsapp";
import { useBusinessContact } from "@/app/context/BusinessContactContext";

type Order = WhatsAppOrder & { createdAt: string; whatsappNumber?: string };

function CompleteOrderContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { language } = useLanguage();
    const { formatPrice } = useCurrency();
    const { whatsappNumber } = useBusinessContact();
    const orderId = searchParams.get("id");
    const token = searchParams.get("token");
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) { router.replace("/"); return; }
        let active = true;
        const url = token ? `/api/orders/${encodeURIComponent(orderId)}?token=${encodeURIComponent(token)}` : `/api/orders/${encodeURIComponent(orderId)}`;
        laravelClientFetch(url, { cache: "no-store" })
            .then((response) => {
                if (!response.ok) throw new Error("Order unavailable");
                return response.json();
            })
            .then((data) => {
                if (!active) return;
                setOrder(data);
                if (token) {
                    const cleanUrl = new URL(window.location.href);
                    cleanUrl.searchParams.delete("token");
                    window.history.replaceState(window.history.state, "", cleanUrl.pathname + cleanUrl.search);
                }
            })
            .catch(() => { if (active) router.replace("/"); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [orderId, token, router]);

    if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><MdRefresh className="animate-spin text-4xl text-[var(--color-brand)]" /></div>;
    if (!order) return null;

    const whatsappUrl = buildWhatsAppOrderUrl(order.whatsappNumber || whatsappNumber, order, formatPrice);
    return <main className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-8 md:py-16">
        <OrderSuccessHeader />

        <div className="mb-8 flex w-full flex-col items-center justify-between gap-5 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-5 shadow-sm dark:bg-[#25D366]/15 sm:flex-row sm:p-6">
            <div className="flex items-center gap-4 text-center sm:text-start">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white"><PlatformIcon platform="whatsapp" className="size-6" /></span>
                <div><h2 className="text-base font-extrabold text-[var(--color-brand)] dark:text-white">{language === "ar" ? "أرسل تفاصيل الطلب عبر واتساب" : "Send your order through WhatsApp"}</h2><p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{language === "ar" ? "أرسل الطلب إلى فريق المبيعات والتوزيع لتسريع تأكيده وتجهيزه." : "Send the order to our sales team to speed up confirmation and preparation."}</p></div>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1ebe5d] sm:w-auto"><PlatformIcon platform="whatsapp" className="size-4" />{language === "ar" ? "إرسال عبر واتساب" : "Send via WhatsApp"}</a>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <OrderBasicInfo orderId={order.id} totalAmount={Number(order.totalAmount)} />
            <OrderShippingAndPayment shopName={order.shopName} name={order.Name} streetAddress={order.streetAddress} city={order.city} phone={order.phone} notes={order.notes} />
            <OrderItemsSelection items={order.items} />
        </div>
        <OrderSupportFooter />
    </main>;
}

export default function CompleteOrderPage() {
    return <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><MdRefresh className="animate-spin text-4xl text-[var(--color-brand)]" /></div>}><CompleteOrderContent /></Suspense>;
}

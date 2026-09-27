"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import PriceText from "@/app/components/PriceText";
import { getSafeImageUrl } from "@/lib/image-utils";
import { formatItemsPerPackage, formatPackageQuantity } from "@/lib/packaging";

type OrderItem = {
    id?: string;
    options?: string | null;
    product: { images?: string; name: string; nameAr?: string | null; packaging?: string | null; itemsPerPackage?: string | null };
    quantity: number;
    price: number | string;
};

export default function OrderItemsSelection({ items }: { items: OrderItem[] }) {
    const { language } = useLanguage();
    const ar = language === "ar";
    return <section className="border-t border-slate-200 bg-slate-50/60 p-5 dark:border-white/10 dark:bg-zinc-800/40 sm:p-7">
        <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-sm font-extrabold text-[var(--color-brand)] dark:text-white">{ar ? "تفاصيل المنتجات والطرود المطلوبة" : "Ordered wholesale items"}</h2><span className="text-xs font-semibold text-slate-500">{items.reduce((sum, item) => sum + item.quantity, 0)} {ar ? "طرد إجمالي" : "packages total"}</span></div>
        <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-zinc-900">
            {items.map((item, index) => {
                const image = item.product.images?.split(",").map((value) => value.trim()).filter(Boolean)[0] || "";
                const details = formatItemsPerPackage(item.product.itemsPerPackage, item.product.packaging, language);
                return <div key={item.id || index} className="flex items-center justify-between gap-3 p-3 sm:p-4">
                    <div className="flex min-w-0 items-center gap-3"><div className="size-12 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-zinc-800">{image && <img src={getSafeImageUrl(image)} alt="" className="h-full w-full object-contain p-1" loading="lazy" />}</div><div className="min-w-0"><p className="truncate text-xs font-bold text-[var(--color-brand)] dark:text-white sm:text-sm">{(ar ? item.product.nameAr : item.product.name) || item.product.name}</p><p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{formatPackageQuantity(item.quantity, item.product.packaging, language)}{item.options ? ` · ${item.options}` : ""}{details ? ` · ${details}` : ""}</p></div></div>
                    <PriceText amount={Number(item.price) * item.quantity} className="shrink-0 text-xs font-extrabold text-[var(--color-brand)] dark:text-white sm:text-sm" />
                </div>;
            })}
        </div>
    </section>;
}

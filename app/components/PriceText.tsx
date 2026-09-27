"use client";

import HiddenPrice from "@/app/components/HiddenPrice";
import { useCurrency } from "@/app/context/CurrencyContext";
import { usePriceVisibility } from "@/app/context/PriceVisibilityContext";

export default function PriceText({ amount, className = "" }: { amount: string | number | null | undefined; className?: string }) {
    const { formatPrice } = useCurrency();
    const allowed = usePriceVisibility();
    if (!allowed || amount == null) return <HiddenPrice className={className} />;
    return <span className={className}>{formatPrice(Number(amount))}</span>;
}

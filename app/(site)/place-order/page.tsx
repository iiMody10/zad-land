"use client";

import { laravelClientFetch } from "@/lib/laravel-client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "@/app/context/CartContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useCurrency } from "@/app/context/CurrencyContext";
import CheckoutSteps from "@/app/components/PlaceOrderComponents/CheckoutSteps";
import ShippingForm from "@/app/components/PlaceOrderComponents/ShippingForm";
import OrderSummary from "@/app/components/PlaceOrderComponents/OrderSummary";
import { validatePromoCode } from "@/lib/admin-actions";
import { buildWhatsAppOrderUrl, type WhatsAppOrder } from "@/lib/order-whatsapp";
import { findGovernorate, normalizeSyrianPhone, validateOrderForm, type OrderFormData, type OrderFormErrors } from "@/lib/order-validation";
import { useBusinessContact } from "@/app/context/BusinessContactContext";

const emptyForm: OrderFormData = { shopName: "", ownerName: "", phone: "", streetAddress: "", city: "", notes: "" };

export default function PlaceOrderPage() {
    const { items, subtotal, clearCart, isHydrated } = useCart();
    const { language } = useLanguage();
    const { whatsappNumber } = useBusinessContact();
    const { formatPrice } = useCurrency();
    const router = useRouter();
    const [formData, setFormData] = useState<OrderFormData>(emptyForm);
    const [errors, setErrors] = useState<OrderFormErrors>({});
    const [touched, setTouched] = useState<Partial<Record<keyof OrderFormData, boolean>>>({});
    const [feedback, setFeedback] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [promoDetails, setPromoDetails] = useState<{ id: string; percentage: number } | null>(null);
    const [idempotencyKey] = useState(() => `ord_${crypto.randomUUID()}`);

    useEffect(() => {
        let active = true;
        laravelClientFetch("/api/customer/auth/me", { cache: "no-store" })
            .then((response) => response.ok ? response.json() : null)
            .then((data) => {
                if (!active || !data?.customer) return;
                const customer = data.customer;
                setFormData((current) => ({
                    shopName: current.shopName || customer.shopName || "",
                    ownerName: current.ownerName || customer.ownerName || "",
                    phone: current.phone || normalizeSyrianPhone(customer.phone || ""),
                    streetAddress: current.streetAddress || customer.address || "",
                    city: current.city || findGovernorate(customer.city || "")?.key || "",
                    notes: current.notes || customer.notes || "",
                }));
            })
            .catch(() => undefined);
        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (isHydrated && items.length === 0 && !loading && !isSuccess) router.replace("/cart");
    }, [isHydrated, items.length, loading, isSuccess, router]);

    const discount = promoDetails ? (subtotal * promoDetails.percentage) / 100 : 0;
    const total = Math.max(0, subtotal - discount);

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const field = event.target.name as keyof OrderFormData;
        const value = field === "phone" ? event.target.value.replace(/[^0-9٠-٩۰-۹+().\s-]/gu, "").slice(0, 24) : event.target.value;
        const next = { ...formData, [field]: value };
        setFormData(next);
        if (touched[field]) setErrors(validateOrderForm(next, language).errors);
    };

    const onBlur = (field: keyof OrderFormData) => {
        if (field === "phone") {
            setFormData((current) => ({ ...current, phone: normalizeSyrianPhone(current.phone) }));
        }
        setTouched((current) => ({ ...current, [field]: true }));
        setErrors(validateOrderForm(formData, language).errors);
    };

    const onApplyPromo = useCallback(async (code: string) => {
        const result = await validatePromoCode(code);
        if (result.success && result.promoCode) {
            setPromoDetails({ id: result.promoCode.id, percentage: result.promoCode.discountPercentage });
            return { success: true, message: `${result.promoCode.discountPercentage}% ${language === "ar" ? "خصم" : "discount applied"}` };
        }
        setPromoDetails(null);
        return { success: false, message: result.error };
    }, [language]);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (loading) return;
        setFeedback(null);
        const validation = validateOrderForm(formData, language);
        if (!validation.isValid) {
            setErrors(validation.errors);
            setTouched({ shopName: true, ownerName: true, phone: true, city: true, streetAddress: true, notes: true });
            const first = Object.keys(validation.errors)[0] as keyof OrderFormData;
            document.getElementById(`field-${first}`)?.focus();
            setFeedback(validation.errors[first] || (language === "ar" ? "يرجى تصحيح بيانات الطلب" : "Please correct the order details"));
            return;
        }
        if (!items.length) return;

        setLoading(true);
        try {
            const response = await laravelClientFetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
                body: JSON.stringify({
                    ...validation.cleanData,
                    promoCodeId: promoDetails?.id || null,
                    items: items.map((item) => ({ productId: item.id, quantity: item.quantity, options: item.selectedOption || null })),
                }),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                if (data.errors) setErrors(data.errors);
                setFeedback(data.message || (language === "ar" ? "تعذر تسجيل الطلب. حاول مرة أخرى." : "Could not place the order. Please try again."));
                return;
            }

            setIsSuccess(true);
            toast.success(language === "ar" ? "تم تسجيل الطلب بنجاح" : "Order placed successfully");
            const whatsappUrl = buildWhatsAppOrderUrl(data.whatsappNumber || whatsappNumber, data as WhatsAppOrder, formatPrice);
            try { window.open(whatsappUrl, "_blank", "noopener,noreferrer"); } catch { /* The confirmation page provides the same link. */ }
            clearCart();
            const token = data.orderToken ? `&token=${encodeURIComponent(data.orderToken)}` : "";
            router.push(`/complete-order?id=${encodeURIComponent(data.id)}${token}`);
        } catch (error) {
            console.error("Order submission failed", error);
            setFeedback(language === "ar" ? "تعذر الاتصال بالخادم. بياناتك محفوظة ويمكنك إعادة المحاولة." : "Connection failed. Your details are saved; please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isHydrated) return <main className="container-custom min-h-[65vh] py-8" aria-busy="true"><div className="h-10 w-48 animate-pulse rounded-xl bg-slate-100 dark:bg-white/10" /></main>;

    return <main className="min-h-[65vh] bg-[#fafbf9] py-5 dark:bg-[var(--color-background-dark)] lg:py-8">
        <div className="container-custom">
            <form onSubmit={onSubmit} noValidate className="grid gap-7 lg:grid-cols-12 lg:gap-8">
                <div className="order-2 lg:order-1 lg:col-span-7">
                    <CheckoutSteps />
                    <ShippingForm formData={formData} errors={errors} touched={touched} onChange={onChange} onBlur={onBlur} loading={loading} feedback={feedback} />
                </div>
                <div className="order-1 lg:order-2 lg:col-span-5"><OrderSummary items={items} subtotal={subtotal} total={total} discount={discount} onApplyPromo={onApplyPromo} /></div>
            </form>
            <div className="mt-5 text-center text-xs text-slate-500 lg:text-start"><Link href="/account/login" className="font-semibold text-[var(--color-brand-hover)] hover:underline">{language === "ar" ? "لديك حساب تاجر؟ سجّل الدخول لتعبئة بياناتك تلقائياً" : "Have a merchant account? Sign in to fill your details automatically"}</Link></div>
        </div>
    </main>;
}

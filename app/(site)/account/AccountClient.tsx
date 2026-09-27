"use client";

import { laravelClientFetch } from "@/lib/laravel-client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart as MdFavoriteBorder, UserRound as MdPersonOutline, ShoppingBag as MdShoppingBag } from 'lucide-react';
import { useCart } from "@/app/context/CartContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useWishlist } from "@/app/context/WishlistContext";
import OrderHistory from "./OrderHistory";
import SavedProducts from "./SavedProducts";
import ProfileEditor from "./ProfileEditor";

export type MerchantProfile = { shopName: string; ownerName: string; phone: string; city: string; address: string | null; notes: string | null };
type Tab = "orders" | "wishlist" | "profile";

export default function AccountClient({ customer }: { customer: MerchantProfile }) {
    const router = useRouter();
    const { language } = useLanguage();
    const { clearCart } = useCart();
    const { reset: resetWishlist } = useWishlist();
    const [tab, setTab] = useState<Tab>("orders");
    const [profile, setProfile] = useState(customer);
    const ar = language === "ar";
    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "orders", label: ar ? "طلباتي" : "Orders", icon: <MdShoppingBag /> },
        { id: "wishlist", label: ar ? "المفضلة" : "Saved products", icon: <MdFavoriteBorder /> },
        { id: "profile", label: ar ? "بيانات المتجر" : "Shop profile", icon: <MdPersonOutline /> },
    ];

    const logout = async () => {
        await laravelClientFetch("/api/customer/auth/logout", { method: "POST" });
        clearCart();
        resetWishlist();
        localStorage.removeItem("cart");
        router.push("/account/login");
        router.refresh();
    };

    return <main className="container-custom min-h-[65vh] py-8 sm:py-12">
        <div className="overflow-hidden rounded-3xl bg-[var(--color-brand)] px-6 py-8 text-white sm:px-10 sm:py-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">ZAD LAND · B2B</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
                <div><h1 className="text-3xl font-bold sm:text-4xl">{ar ? "حساب التاجر" : "Merchant account"}</h1><p className="mt-2 text-sm text-white/70">{profile.shopName} · {profile.city}</p></div>
                <button type="button" onClick={logout} className="rounded-xl border border-white/25 px-4 py-2.5 text-sm font-bold hover:bg-white/10">{ar ? "تسجيل الخروج" : "Sign out"}</button>
            </div>
        </div>
        <nav aria-label={ar ? "أقسام الحساب" : "Account sections"} className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3 dark:border-white/10">
            {tabs.map((item) => <button key={item.id} type="button" onClick={() => setTab(item.id)} aria-current={tab === item.id ? "page" : undefined} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${tab === item.id ? "bg-[var(--color-brand-hover)] text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"}`}>{item.icon}{item.label}</button>)}
        </nav>
        {tab === "orders" && <OrderHistory customerPhone={profile.phone} />}
        {tab === "wishlist" && <SavedProducts />}
        {tab === "profile" && <ProfileEditor profile={profile} onSaved={setProfile} />}
    </main>;
}

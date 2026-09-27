"use client";

import { laravelClientFetch } from "@/lib/laravel-client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type WishlistContextValue = {
    ids: Set<string>;
    ready: boolean;
    signedIn: boolean;
    revision: number;
    toggle: (productId: string) => Promise<void>;
    refresh: () => Promise<void>;
    reset: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [ids, setIds] = useState<Set<string>>(new Set());
    const [ready, setReady] = useState(false);
    const [signedIn, setSignedIn] = useState(false);
    const [revision, setRevision] = useState(0);

    const refresh = useCallback(async () => {
        try {
            const response = await laravelClientFetch("/api/customer/wishlist?idsOnly=true", { cache: "no-store" });
            if (!response.ok) { setSignedIn(false); setIds(new Set()); return; }
            const data = await response.json();
            setSignedIn(true);
            setIds(new Set(Array.isArray(data.wishlistIds) ? data.wishlistIds as string[] : []));
        } finally {
            setReady(true);
        }
    }, []);

    useEffect(() => { void refresh().catch(() => setReady(true)); }, [refresh]);

    const reset = useCallback(() => { setSignedIn(false); setIds(new Set()); setRevision(0); }, []);

    const toggle = useCallback(async (productId: string) => {
        if (!signedIn) { router.push("/account/login"); return; }
        const shouldAdd = !ids.has(productId);
        setIds((current) => {
            const next = new Set(current);
            if (shouldAdd) next.add(productId); else next.delete(productId);
            return next;
        });
        try {
            const response = await laravelClientFetch(shouldAdd ? "/api/customer/wishlist" : `/api/customer/wishlist?productId=${encodeURIComponent(productId)}`, {
                method: shouldAdd ? "POST" : "DELETE",
                headers: shouldAdd ? { "Content-Type": "application/json" } : undefined,
                body: shouldAdd ? JSON.stringify({ productId }) : undefined,
            });
            if (response.status === 401) {
                setIds((current) => {
                    const next = new Set(current);
                    if (shouldAdd) next.delete(productId); else next.add(productId);
                    return next;
                });
                setSignedIn(false);
                router.push("/account/login");
                return;
            }
            if (!response.ok) throw new Error("Wishlist update failed");
            setRevision((current) => current + 1);
        } catch {
            setIds((current) => {
                const next = new Set(current);
                if (shouldAdd) next.delete(productId); else next.add(productId);
                return next;
            });
            toast.error("Could not update saved products");
        }
    }, [ids, router, signedIn]);

    return <WishlistContext.Provider value={{ ids, ready, signedIn, revision, toggle, refresh, reset }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
    return context;
}

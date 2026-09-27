"use client";

import { createContext, useContext } from "react";
import { laravelClientFetch } from "@/lib/laravel-client";

export type AdminSessionUser = {
    id: string;
    username: string;
    name?: string;
    role: "ADMIN" | "SUPER_ADMIN";
    canManageBrands?: boolean;
    canManageProducts?: boolean;
    canManageCategories?: boolean;
    canManageBanners?: boolean;
    canManageOrders?: boolean;
    canManagePromoCodes?: boolean;
    canManageReviews?: boolean;
    canDeleteOrders?: boolean;
    canDeleteBrands?: boolean;
    canDeleteProducts?: boolean;
    canDeleteCategories?: boolean;
    canDeleteBanners?: boolean;
    canDeletePromoCodes?: boolean;
    [permission: string]: unknown;
};

const AdminSessionContext = createContext<AdminSessionUser | null>(null);

export function AdminSessionProvider({ user, children }: { user: AdminSessionUser; children: React.ReactNode }) {
    return <AdminSessionContext.Provider value={user}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession() {
    const user = useContext(AdminSessionContext);
    return { data: user ? { user } : null, status: user ? "authenticated" : "unauthenticated" as const };
}

export async function signOutAdmin() {
    await laravelClientFetch("/api/admin/auth/logout", { method: "POST" }).catch(() => undefined);
    window.location.href = "/admin/login";
}

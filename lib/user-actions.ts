"use server";

import { revalidatePath } from "next/cache";
import { laravelJson, laravelRequest } from "@/lib/laravel-server";

interface UserInput {
    username: string;
    password?: string;
    role?: "ADMIN" | "SUPER_ADMIN";
    canManageBrands: boolean; canDeleteBrands: boolean; canManageProducts: boolean; canDeleteProducts: boolean;
    canManageCategories: boolean; canDeleteCategories: boolean; canManageBanners: boolean; canDeleteBanners: boolean;
    canManageOrders: boolean; canDeleteOrders: boolean; canManagePromoCodes: boolean; canDeletePromoCodes: boolean;
}

async function send(path: string, method: string, body?: UserInput) {
    const response = await laravelRequest(`/api${path}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result?.message || result?.error || "User operation failed");
    revalidatePath("/admin/users");
    return result;
}

export async function getUsers() {
    return laravelJson<Record<string, unknown>[]>("/api/admin/users", []);
}

export async function createUser(data: UserInput) {
    try { await send("/admin/users", "POST", data); return { success: true }; }
    catch (error) { return { success: false, error: error instanceof Error ? error.message : "Failed to create user" }; }
}

export async function updateUser(id: string, data: UserInput) {
    try { await send(`/admin/users/${encodeURIComponent(id)}`, "PATCH", data); return { success: true }; }
    catch (error) { return { success: false, error: error instanceof Error ? error.message : "Failed to update user" }; }
}

export async function deleteUser(id: string) {
    try { await send(`/admin/users/${encodeURIComponent(id)}`, "DELETE"); return { success: true }; }
    catch (error) { return { success: false, error: error instanceof Error ? error.message : "Failed to delete user" }; }
}

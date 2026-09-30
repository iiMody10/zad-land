import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getLaravelAdmin } from "@/lib/laravel-server";
import DashboardLayoutClient from "./DashboardLayoutClient";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getLaravelAdmin();

    // Don't check auth for login page - it's handled by route group
    // This layout only applies to protected routes
    if (!user) {
        const destination = (await headers()).get("x-admin-return-to") || "/admin/dashboard";
        redirect(`/admin/login?callbackUrl=${encodeURIComponent(destination)}`);
    }

    return <DashboardLayoutClient session={{ user: user as never }}>{children}</DashboardLayoutClient>;
}

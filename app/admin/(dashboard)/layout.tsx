import { redirect } from "next/navigation";
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
        redirect("/admin/login");
    }

    return <DashboardLayoutClient session={{ user: user as never }}>{children}</DashboardLayoutClient>;
}

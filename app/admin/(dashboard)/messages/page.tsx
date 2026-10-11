import { notFound } from "next/navigation";
import { getLaravelAdmin } from "@/lib/laravel-server";
import { getAdminContactMessages } from "@/lib/admin-actions";
import MessagesClient from "./MessagesClient";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
    const admin = await getLaravelAdmin();
    if (!admin || !["ADMIN", "SUPER_ADMIN"].includes(admin.role as string)) {
        notFound();
    }

    try {
        const data = await getAdminContactMessages();
        return <MessagesClient initialData={data} />;
    } catch {
        return <MessagesClient initialData={{ messages: [], unreadCount: 0, totalCount: 0 }} />;
    }
}

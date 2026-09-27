import { getAdminUser } from "../../../../lib/admin-actions";
import SettingsClient from "./SettingsClient";
import { getLaravelAdmin } from "@/lib/laravel-server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const session = await getLaravelAdmin();

    if (!session || session.role !== 'SUPER_ADMIN') {
        redirect('/admin/dashboard');
    }

    const adminUser = await getAdminUser();
    
    return <SettingsClient initialUser={adminUser} />;
}

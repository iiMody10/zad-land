import { getDashboardStats } from "../../../../lib/admin-actions";
import DashboardClient from "./DashboardClient";
import DashboardUnavailable from "./DashboardUnavailable";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    try {
        const stats = await getDashboardStats();
        return <DashboardClient stats={stats} />;
    } catch {
        return <DashboardUnavailable />;
    }

}

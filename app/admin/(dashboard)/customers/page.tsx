import { notFound } from "next/navigation";
import { getLaravelAdmin, laravelJson } from "@/lib/laravel-server";
import CustomersClient from "./CustomersClient";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
    const admin = await getLaravelAdmin();
    if (!admin || admin.role !== "SUPER_ADMIN") notFound();
    const customers = await laravelJson<Array<Record<string, unknown>>>("/api/admin/customers", []);
    return <CustomersClient initialCustomers={customers as never[]} />;
}

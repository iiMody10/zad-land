import { redirect } from "next/navigation";
import { laravelJson } from "@/lib/laravel-server";
import AccountClient, { type MerchantProfile } from "./AccountClient";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
    const { customer } = await laravelJson<{ customer: MerchantProfile | null }>(
        "/api/customer/auth/me",
        { customer: null },
    );
    if (!customer) redirect("/account/login");
    return <AccountClient customer={customer} />;
}

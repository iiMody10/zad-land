import { getLaravelAdmin } from "@/lib/laravel-server";
import { redirect } from "next/navigation";
import ReviewsClient from "./ReviewsClient";

export const metadata = {
    title: "Manage Reviews - Admin Dashboard",
};

export default async function ReviewsPage() {
    const session = await getLaravelAdmin();

    if (!session) {
        redirect("/admin/login");
    }

    if (!session.canManageReviews && session.role !== "SUPER_ADMIN") {
        redirect("/admin/dashboard");
    }

    return <ReviewsClient />;
}

import { getUsers } from "@/lib/user-actions";
import UsersClient from "./UsersClient";
import { getLaravelAdmin } from "@/lib/laravel-server";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
    const session = await getLaravelAdmin();

    if (!session || session.role !== 'SUPER_ADMIN') {
        redirect('/admin/dashboard');
    }

    const users = await getUsers();

    return <UsersClient users={users as any[]} />;
}

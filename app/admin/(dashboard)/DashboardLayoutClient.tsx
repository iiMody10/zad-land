"use client";

import AdminSidebar from "../components/AdminSidebar";
import { AdminSidebarProvider, useAdminSidebar } from "../context/AdminSidebarContext";
import { AdminSessionProvider, type AdminSessionUser } from "../context/AdminSessionContext";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
    const { isOpen, closeSidebar } = useAdminSidebar();

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <AdminSidebar isOpen={isOpen} onClose={closeSidebar} />
            <main className="min-w-0 flex-1 flex flex-col h-full overflow-hidden relative">
                <div className="flex-1 flex flex-col overflow-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default function DashboardLayoutClient({
    children,
    session,
}: {
    children: React.ReactNode;
    session: { user: AdminSessionUser };
}) {
    return (
        <AdminSessionProvider user={session.user}>
            <AdminSidebarProvider>
                <DashboardLayoutInner>{children}</DashboardLayoutInner>
            </AdminSidebarProvider>
        </AdminSessionProvider>
    );
}

"use client";

import { useMemo, useState } from "react";
import { Search, Mail, MessageSquare, Phone, Store, Check, CheckCheck, Archive, Trash2, Clock, Calendar, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/app/context/LanguageContext";
import AdminHeader from "../../components/AdminHeader";
import { useAdminSidebar } from "../../context/AdminSidebarContext";
import {
    type ContactMessageItem,
    type ContactMessagesResponse,
    updateAdminContactMessageStatus,
    deleteAdminContactMessage,
} from "@/lib/admin-actions";

interface MessagesClientProps {
    initialData: ContactMessagesResponse;
}

type FilterStatus = "all" | "unread" | "read" | "archived";

export default function MessagesClient({ initialData }: MessagesClientProps) {
    const { dir, language } = useLanguage();
    const isArabic = language === "ar";
    const { openSidebar } = useAdminSidebar();

    const [messages, setMessages] = useState<ContactMessageItem[]>(initialData.messages || []);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
    const [search, setSearch] = useState("");
    const [busyId, setBusyId] = useState<string | null>(null);

    const counts = useMemo(() => {
        const total = messages.length;
        const unread = messages.filter((m) => m.status === "unread").length;
        const read = messages.filter((m) => m.status === "read").length;
        const archived = messages.filter((m) => m.status === "archived").length;
        return { total, unread, read, archived };
    }, [messages]);

    const filtered = useMemo(() => {
        return messages.filter((msg) => {
            if (filterStatus !== "all" && msg.status !== filterStatus) {
                return false;
            }
            if (!search.trim()) return true;
            const query = search.trim().toLowerCase();
            return (
                msg.name.toLowerCase().includes(query) ||
                (msg.businessName && msg.businessName.toLowerCase().includes(query)) ||
                msg.phone.toLowerCase().includes(query) ||
                msg.message.toLowerCase().includes(query)
            );
        });
    }, [messages, filterStatus, search]);

    const handleUpdateStatus = async (id: string, newStatus: "unread" | "read" | "archived") => {
        setBusyId(id);
        try {
            const res = await updateAdminContactMessageStatus(id, newStatus);
            if (!res.success) {
                throw new Error(res.error || "Failed to update status");
            }
            setMessages((prev) =>
                prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
            );
            toast.success(
                newStatus === "read"
                    ? isArabic ? "تم تحديد الرسالة كمقروءة" : "Message marked as read"
                    : newStatus === "unread"
                    ? isArabic ? "تم تحديد الرسالة كغير مقروءة" : "Message marked as unread"
                    : isArabic ? "تم نقل الرسالة إلى الأرشيف" : "Message archived"
            );
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : isArabic ? "حدث خطأ أثناء التحديث" : "Update failed");
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(isArabic ? "هل أنت متأكد من حذف هذه الرسالة نهائياً؟" : "Are you sure you want to permanently delete this message?")) {
            return;
        }
        setBusyId(id);
        try {
            const res = await deleteAdminContactMessage(id);
            if (!res.success) {
                throw new Error(res.error || "Failed to delete message");
            }
            setMessages((prev) => prev.filter((msg) => msg.id !== id));
            toast.success(isArabic ? "تم حذف الرسالة بنجاح" : "Message deleted");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : isArabic ? "تعذر حذف الرسالة" : "Delete failed");
        } finally {
            setBusyId(null);
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat(isArabic ? "ar-SY" : "en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(date);
        } catch {
            return dateStr;
        }
    };

    const buildWhatsAppUrl = (phone: string, name: string) => {
        const cleanPhone = phone.replace(/[^0-9]/g, "");
        const text = isArabic
            ? `مرحباً ${name}، نتواصل معك من فريق زاد لاند بخصوص استفسارك:`
            : `Hello ${name}, contacting you from Zad Land team regarding your inquiry:`;
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-[var(--color-background-dark)]" dir={dir}>
            <AdminHeader title={isArabic ? "رسائل واستفسارات التواصل" : "Contact Messages"} onMenuClick={openSidebar} />

            <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
                {/* Top Banner & Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                    <div className="bg-white dark:bg-[var(--color-surface-dark)] p-4 md:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">{isArabic ? "إجمالي الرسائل" : "Total Messages"}</span>
                            <span className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300"><MessageSquare className="size-4" /></span>
                        </div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{counts.total}</p>
                    </div>

                    <div className="bg-white dark:bg-[var(--color-surface-dark)] p-4 md:p-5 rounded-2xl border border-amber-200/80 dark:border-amber-500/20 bg-amber-50/20 dark:bg-amber-950/10 shadow-2xs">
                        <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">{isArabic ? "جديدة وغير مقروءة" : "Unread Messages"}</span>
                            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300"><Mail className="size-4" /></span>
                        </div>
                        <p className="text-2xl font-black text-amber-600 dark:text-amber-300">{counts.unread}</p>
                    </div>

                    <div className="bg-white dark:bg-[var(--color-surface-dark)] p-4 md:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xs">
                        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">{isArabic ? "تمت القراءة" : "Read Messages"}</span>
                            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300"><CheckCheck className="size-4" /></span>
                        </div>
                        <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{counts.read}</p>
                    </div>

                    <div className="bg-white dark:bg-[var(--color-surface-dark)] p-4 md:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">{isArabic ? "المؤرشفة" : "Archived"}</span>
                            <span className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500"><Archive className="size-4" /></span>
                        </div>
                        <p className="text-2xl font-black text-slate-700 dark:text-slate-300">{counts.archived}</p>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white dark:bg-[var(--color-surface-dark)] p-4 md:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                        {(
                            [
                                { id: "all", label: isArabic ? "الكل" : "All", count: counts.total },
                                { id: "unread", label: isArabic ? "غير مقروءة" : "Unread", count: counts.unread },
                                { id: "read", label: isArabic ? "مقروءة" : "Read", count: counts.read },
                                { id: "archived", label: isArabic ? "مؤرشفة" : "Archived", count: counts.archived },
                            ] as const
                        ).map((tab) => {
                            const isActive = filterStatus === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setFilterStatus(tab.id)}
                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                                        isActive
                                            ? "bg-[var(--color-brand)] text-white shadow-xs"
                                            : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    {tab.count > 0 && (
                                        <span
                                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                                                isActive
                                                    ? "bg-white/20 text-white"
                                                    : tab.id === "unread"
                                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
                                                    : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                                            }`}
                                        >
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Field */}
                    <div className="relative w-full md:w-80">
                        <Search className={`absolute ${dir === "rtl" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 size-4 text-slate-400`} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={isArabic ? "ابحث بالاسم، المتجر، أو الهاتف..." : "Search by name, shop, or phone..."}
                            className={`w-full rounded-xl border border-slate-200 bg-slate-50 ${dir === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 text-xs md:text-sm text-slate-900 outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/15 dark:border-white/10 dark:bg-zinc-800/80 dark:text-white`}
                        />
                    </div>
                </div>

                {/* Messages List */}
                <div className="space-y-4">
                    {filtered.length === 0 ? (
                        <div className="bg-white dark:bg-[var(--color-surface-dark)] p-12 text-center rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xs">
                            <div className="size-16 rounded-full bg-slate-100 dark:bg-white/5 mx-auto flex items-center justify-center text-slate-400 mb-3">
                                <Mail className="size-8" />
                            </div>
                            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">
                                {isArabic ? "لا توجد رسائل تواصل" : "No contact messages found"}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                {search
                                    ? isArabic
                                        ? "لم يتم العثور على أي رسائل تطابق بحثك. جرب كلمات بحث أخرى."
                                        : "No messages match your search keyword. Try a different query."
                                    : isArabic
                                    ? "جميع رسائل واستفسارات الزوار والتجار الواردة من صفحة تواصل معنا ستظهر هنا فور إرسالها."
                                    : "Messages submitted via the contact page will appear here immediately."}
                            </p>
                        </div>
                    ) : (
                        filtered.map((msg) => {
                            const isUnread = msg.status === "unread";
                            const isArchived = msg.status === "archived";
                            const isBusy = busyId === msg.id;

                            return (
                                <article
                                    key={msg.id}
                                    className={`rounded-2xl border p-5 md:p-6 transition-all shadow-2xs ${
                                        isUnread
                                            ? "bg-amber-50/30 border-amber-300 dark:bg-amber-950/15 dark:border-amber-500/30"
                                            : "bg-white dark:bg-[var(--color-surface-dark)] border-slate-200/80 dark:border-white/10"
                                    }`}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                        {/* Sender info & badge */}
                                        <div className="space-y-2 flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2.5">
                                                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                                    {msg.name}
                                                </h3>
                                                {msg.businessName && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                                                        <Store className="size-3 text-slate-500" />
                                                        <span>{msg.businessName}</span>
                                                    </span>
                                                )}
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                                                        isUnread
                                                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200"
                                                            : isArchived
                                                            ? "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400"
                                                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                                    }`}
                                                >
                                                    {isUnread
                                                        ? isArabic ? "جديدة" : "New"
                                                        : isArchived
                                                        ? isArabic ? "مؤرشفة" : "Archived"
                                                        : isArabic ? "تمت القراءة" : "Read"}
                                                </span>
                                            </div>

                                            {/* Contact phone and date */}
                                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1" dir="ltr">
                                                    <Phone className="size-3.5 text-slate-400" />
                                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{msg.phone}</span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="size-3.5 text-slate-400" />
                                                    <span>{formatDate(msg.createdAt)}</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex flex-wrap items-center gap-2 self-start shrink-0">
                                            {/* WhatsApp Quick Reply */}
                                            <a
                                                href={buildWhatsAppUrl(msg.phone, msg.name)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs"
                                                title={isArabic ? "رد عبر واتساب" : "Reply via WhatsApp"}
                                            >
                                                <span>{isArabic ? "رد عبر واتساب" : "WhatsApp"}</span>
                                                <ExternalLink className="size-3" />
                                            </a>

                                            {/* Call link */}
                                            <a
                                                href={`tel:${msg.phone.replace(/[^0-9+]/g, "")}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
                                                title={isArabic ? "اتصال هاتفي" : "Direct Call"}
                                            >
                                                <Phone className="size-3 text-slate-500" />
                                                <span>{isArabic ? "اتصال" : "Call"}</span>
                                            </a>

                                            {/* Mark Read/Unread */}
                                            {isUnread ? (
                                                <button
                                                    type="button"
                                                    disabled={isBusy}
                                                    onClick={() => handleUpdateStatus(msg.id, "read")}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
                                                >
                                                    <Check className="size-3.5" />
                                                    <span>{isArabic ? "تحديد كمقروءة" : "Mark Read"}</span>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    disabled={isBusy}
                                                    onClick={() => handleUpdateStatus(msg.id, "unread")}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
                                                >
                                                    <Mail className="size-3.5" />
                                                    <span>{isArabic ? "تعيين كغير مقروءة" : "Mark Unread"}</span>
                                                </button>
                                            )}

                                            {/* Archive/Unarchive */}
                                            {!isArchived ? (
                                                <button
                                                    type="button"
                                                    disabled={isBusy}
                                                    onClick={() => handleUpdateStatus(msg.id, "archived")}
                                                    className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50 cursor-pointer"
                                                    title={isArabic ? "أرشفة" : "Archive"}
                                                >
                                                    <Archive className="size-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    disabled={isBusy}
                                                    onClick={() => handleUpdateStatus(msg.id, "read")}
                                                    className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50 cursor-pointer"
                                                    title={isArabic ? "استعادة من الأرشيف" : "Unarchive"}
                                                >
                                                    <Check className="size-4" />
                                                </button>
                                            )}

                                            {/* Delete */}
                                            <button
                                                type="button"
                                                disabled={isBusy}
                                                onClick={() => handleDelete(msg.id)}
                                                className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50 cursor-pointer"
                                                title={isArabic ? "حذف" : "Delete"}
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Message Body */}
                                    <div className="mt-4 p-4 rounded-xl bg-slate-50/80 dark:bg-black/20 border border-slate-100 dark:border-white/5 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap select-text">
                                        {msg.message}
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
}

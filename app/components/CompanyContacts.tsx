import { Phone } from "lucide-react";
import { toContactPhoneHref, type CompanyContact } from "@/lib/business-contact";

export default function CompanyContacts({ contacts, language, compact = false }: {
    contacts: CompanyContact[];
    language: string;
    compact?: boolean;
}) {
    const visible = contacts.filter((contact) => contact.enabled);
    if (!visible.length) return null;
    const ar = language === "ar";

    return <ul className={`w-full ${compact ? "space-y-2" : "space-y-3"}`}>
        {visible.map((contact) => {
            const name = ar ? contact.nameAr || contact.nameEn : contact.nameEn || contact.nameAr;
            const role = ar ? contact.roleAr || contact.roleEn : contact.roleEn || contact.roleAr;
            return <li key={contact.id} className={compact
                ? "border-b border-white/10 pb-2 last:border-0 last:pb-0 text-start"
                : "rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/5"}>
                <p className="font-bold leading-snug">{name}</p>
                <p className={`mt-0.5 text-xs ${compact ? "text-white/65" : "text-slate-500 dark:text-slate-400"}`}>{role}</p>
                {contact.phone && <a href={`tel:${toContactPhoneHref(contact.phone)}`} aria-label={`${ar ? "اتصل بـ" : "Call"} ${name}: ${contact.phone}`} className={`mt-1.5 inline-flex max-w-full items-center gap-2 text-sm font-semibold hover:underline ${compact ? "text-[var(--color-accent-light)]" : "text-[var(--color-brand)] dark:text-white"}`}>
                    <Phone className="size-3.5 shrink-0" aria-hidden="true" />
                    <span dir="ltr" className="whitespace-nowrap">{contact.phone}</span>
                </a>}
            </li>;
        })}
    </ul>;
}

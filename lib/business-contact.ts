export function toWhatsAppUrl(phone: string) {
    const digits = toContactPhoneHref(phone).replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : "#";
}

export function toContactPhoneHref(phone: string) {
    const normalized = phone.replace(/[^\d+]/g, "");
    return /^09\d{8}$/.test(normalized) ? `+963${normalized.slice(1)}` : normalized;
}

export interface CompanyContact {
    id: string;
    nameAr: string;
    nameEn: string;
    roleAr: string;
    roleEn: string;
    phone: string;
    enabled: boolean;
}

export const DEFAULT_COMPANY_CONTACTS: CompanyContact[] = [
    { id: "company-manager", nameAr: "حسام", nameEn: "Hussam", roleAr: "مدير الشركة", roleEn: "Company Manager", phone: "0944664406", enabled: true },
    { id: "sales-manager", nameAr: "محمد", nameEn: "Mohammad", roleAr: "مدير مبيعات", roleEn: "Sales Manager", phone: "0969392878", enabled: true },
];

export function parseCompanyContacts(value: unknown): CompanyContact[] {
    let parsed = value;
    if (typeof value === "string") {
        try { parsed = JSON.parse(value); } catch { parsed = null; }
    }
    if (!Array.isArray(parsed)) return DEFAULT_COMPANY_CONTACTS.map((contact) => ({ ...contact }));
    return parsed.filter((item): item is CompanyContact => Boolean(item && typeof item === "object"
        && ["id", "nameAr", "nameEn", "roleAr", "roleEn", "phone"].every((key) => typeof item[key] === "string")
        && typeof item.enabled === "boolean"));
}

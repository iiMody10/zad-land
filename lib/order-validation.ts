import { toSyrianNationalPhone } from "@/lib/syrian-phone";

export type OrderFormData = {
    shopName: string;
    ownerName: string;
    phone: string;
    city: string;
    streetAddress: string;
    notes: string;
};

export type OrderFormErrors = Partial<Record<keyof OrderFormData, string>>;

export const SYRIAN_GOVERNORATES = [
    { key: "Damascus", ar: "دمشق", en: "Damascus" },
    { key: "Rif Dimashq", ar: "ريف دمشق", en: "Rif Dimashq" },
    { key: "Homs", ar: "حمص", en: "Homs" },
    { key: "Hama", ar: "حماة", en: "Hama" },
    { key: "Aleppo", ar: "حلب", en: "Aleppo" },
    { key: "Latakia", ar: "اللاذقية", en: "Latakia" },
    { key: "Tartus", ar: "طرطوس", en: "Tartus" },
    { key: "Daraa", ar: "درعا", en: "Daraa" },
    { key: "As-Suwayda", ar: "السويداء", en: "As-Suwayda" },
    { key: "Quneitra", ar: "القنيطرة", en: "Quneitra" },
    { key: "Deir ez-Zor", ar: "دير الزور", en: "Deir ez-Zor" },
    { key: "Al-Hasakah", ar: "الحسكة", en: "Al-Hasakah" },
    { key: "Raqqa", ar: "الرقة", en: "Raqqa" },
    { key: "Idlib", ar: "إدلب", en: "Idlib" },
] as const;

export function normalizeSyrianPhone(value: string) {
    const normalized = toSyrianNationalPhone(value);
    if (normalized) return normalized;

    // Keep incomplete input editable while the user is typing. Full valid numbers
    // are converted above, including the custom stored `963xxxxxxxx` format.
    return value
        .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
        .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
        .replace(/\D/g, "");
}

function clean(value: string, maxLength: number) {
    return value.replace(/<[^>]*>/g, "").replace(/[\u0000-\u001f\u007f-\u009f]/g, "").trim().slice(0, maxLength);
}

export function findGovernorate(city: string) {
    const value = city.trim().toLowerCase();
    return SYRIAN_GOVERNORATES.find((item) =>
        item.key.toLowerCase() === value || item.ar.toLowerCase() === value || item.en.toLowerCase() === value
    );
}

export function validateOrderForm(form: OrderFormData, language: "ar" | "en" = "ar") {
    const ar = language === "ar";
    const errors: OrderFormErrors = {};
    const cleanData: OrderFormData = {
        shopName: clean(form.shopName || "", 100),
        ownerName: clean(form.ownerName || "", 100),
        phone: normalizeSyrianPhone(form.phone || ""),
        city: form.city || "",
        streetAddress: clean(form.streetAddress || "", 250),
        notes: clean(form.notes || "", 500),
    };
    const governorate = findGovernorate(cleanData.city);
    if (cleanData.shopName.length < 2) errors.shopName = ar ? "يرجى إدخال اسم المحل التجاري" : "Enter your store name";
    if (cleanData.ownerName.length < 2) errors.ownerName = ar ? "يرجى إدخال اسم صاحب الطلب" : "Enter the contact person's name";
    if (!/^09\d{8}$/.test(cleanData.phone)) errors.phone = ar ? "أدخل رقم موبايل صحيح" : "Enter a valid mobile number";
    if (!governorate) errors.city = ar ? "اختر محافظة" : "Select a governorate";
    if (cleanData.streetAddress.length < 4) errors.streetAddress = ar ? "أدخل عنوان التوصيل بالتفصيل" : "Enter a detailed delivery address";
    if (form.notes?.length > 500) errors.notes = ar ? "الملاحظات طويلة جداً" : "Notes must be 500 characters or fewer";
    if (governorate) cleanData.city = governorate.ar;
    return { isValid: Object.keys(errors).length === 0, errors, cleanData };
}

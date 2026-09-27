import { normalizeSyrianPhone } from "./syrian-phone";

export type MerchantFormValues = {
    shopName: string;
    ownerName: string;
    phone: string;
    city: string;
    address: string;
    notes: string;
    password: string;
};

export type MerchantFormErrors = Partial<Record<keyof MerchantFormValues, string>>;

export function validateMerchantForm(values: MerchantFormValues, mode: "login" | "register", language: "ar" | "en" = "ar") {
    const ar = language === "ar";
    const cleanData: MerchantFormValues = {
        shopName: values.shopName.trim(),
        ownerName: values.ownerName.trim(),
        phone: normalizeSyrianPhone(values.phone),
        city: values.city.trim(),
        address: values.address.trim(),
        notes: values.notes.trim(),
        password: values.password,
    };
    const errors: MerchantFormErrors = {};

    if (mode === "register") {
        if (cleanData.shopName.length < 2 || cleanData.shopName.length > 100 || !/[\p{L}\p{N}]/u.test(cleanData.shopName)) errors.shopName = ar ? "أدخل اسم متجر صحيحاً من حرفين إلى 100 حرف" : "Enter a valid shop name between 2 and 100 characters";
        if (cleanData.ownerName.length < 2 || cleanData.ownerName.length > 100 || !/[\p{L}]/u.test(cleanData.ownerName)) errors.ownerName = ar ? "أدخل اسم صاحب المتجر من حرفين إلى 100 حرف" : "Enter an owner name between 2 and 100 characters";
        if (cleanData.city.length < 2 || cleanData.city.length > 100 || !/[\p{L}]/u.test(cleanData.city)) errors.city = ar ? "أدخل مدينة صحيحة" : "Enter a valid city";
        if (cleanData.address.length < 5 || cleanData.address.length > 250 || !/[\p{L}\p{N}]/u.test(cleanData.address)) errors.address = ar ? "أدخل عنواناً صحيحاً من 5 إلى 250 حرفاً" : "Enter a valid address between 5 and 250 characters";
        if (values.notes.length > 500) errors.notes = ar ? "يجب ألا تتجاوز الملاحظات 500 حرف" : "Notes must be 500 characters or fewer";
    }

    if (!cleanData.phone) errors.phone = ar ? "أدخل رقم موبايل صحيح" : "Enter a valid mobile number";
    if (cleanData.password.trim().length < 6 || cleanData.password.length > 128) errors.password = ar ? "يجب أن تتراوح كلمة المرور بين 6 و128 حرفاً" : "Password must be between 6 and 128 characters";

    return { isValid: Object.keys(errors).length === 0, errors, cleanData };
}

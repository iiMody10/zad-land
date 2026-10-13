export function merchantAuthError(message: unknown, status: number, language: string) {
    const ar = language === "ar";
    if (message === "ACCOUNT_PENDING") {
        return ar ? "حسابك بانتظار موافقة الإدارة." : "Your account is awaiting approval.";
    }
    if (status === 401 || message === "Invalid credentials") {
        return ar ? "رقم الجوال أو كلمة المرور غير صحيحة." : "The mobile number or password is incorrect.";
    }
    if (status === 429) {
        return ar ? "عدد المحاولات كبير. يرجى الانتظار قليلاً ثم المحاولة مرة أخرى." : "Too many attempts. Please wait and try again.";
    }
    const translations: Record<string, string> = {
        "Enter a valid mobile number.": "يرجى إدخال رقم جوال صحيح.",
        "One or more fields are invalid.": "يرجى التحقق من البيانات المدخلة.",
        "This phone number already has a merchant account.": "رقم الجوال هذا مرتبط بحساب تاجر بالفعل.",
    };
    if (ar && typeof message === "string" && translations[message]) return translations[message];
    return ar ? "تعذر إتمام الطلب. يرجى المحاولة مرة أخرى." : "We couldn't complete your request. Please try again.";
}

export function passwordSupportUrl(whatsappUrl: string, language: string) {
    try {
        const url = new URL(whatsappUrl);
        url.searchParams.set("text", language === "ar"
            ? "مرحباً، نسيت كلمة مرور حساب التاجر في زاد لاند، وأحتاج مساعدة في تغييرها."
            : "Hello, I forgot my Zad Land merchant account password and need help changing it.");
        return url.toString();
    } catch {
        return whatsappUrl;
    }
}

const PHONE_FORMAT_CHARACTERS = /^[0-9٠-٩۰-۹+().\s-]+$/u;

function asciiDigits(value: string) {
    return value
        .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
        .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0));
}

/** Return the requested stored form: 963 followed by the eight subscriber digits. */
export function normalizeSyrianPhone(value: string) {
    const trimmed = value.trim();
    if (!trimmed || !PHONE_FORMAT_CHARACTERS.test(trimmed)) return "";

    let digits = asciiDigits(trimmed).replace(/\D/g, "");
    let hasCountryCode = false;
    if (digits.startsWith("00963")) {
        digits = digits.slice(5);
        hasCountryCode = true;
    } else if (digits.startsWith("963")) {
        digits = digits.slice(3);
        hasCountryCode = true;
    }

    let national = "";
    if (/^09\d{8}$/.test(digits)) national = digits;
    else if (/^9\d{8}$/.test(digits)) national = `0${digits}`;
    else if (hasCountryCode && /^\d{8}$/.test(digits)) national = `09${digits}`;
    if (!national) return "";
    return `963${national.slice(2)}`;
}

export function toSyrianNationalPhone(value: string) {
    const international = normalizeSyrianPhone(value);
    return international ? `09${international.slice(3)}` : "";
}

/** Restore the mobile prefix when a stored number needs to be dialed internationally. */
export function toSyrianDialablePhone(value: string) {
    const stored = normalizeSyrianPhone(value);
    return stored ? `9639${stored.slice(3)}` : "";
}

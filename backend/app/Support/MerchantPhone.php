<?php

namespace App\Support;

final class MerchantPhone
{
    public static function normalize(string $value): ?string
    {
        $normalized = strtr(trim($value), array_combine(
            preg_split('//u', '٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹', -1, PREG_SPLIT_NO_EMPTY),
            str_split('01234567890123456789'),
        ));
        if (! preg_match('/^[0-9+().\s-]+$/', $normalized)) {
            return null;
        }
        $digits = preg_replace('/\D/', '', $normalized) ?? '';
        // Existing merchant records use this canonical form. Keep it stable
        // when an admin edits a profile and saves the phone unchanged.
        if (preg_match('/^963\d{8}$/', $digits)) {
            return $digits;
        }
        if (str_starts_with($digits, '00963')) $digits = substr($digits, 5);
        elseif (str_starts_with($digits, '963')) $digits = substr($digits, 3);
        if (preg_match('/^09\d{8}$/', $digits)) return '963'.substr($digits, 2);
        if (preg_match('/^9\d{8}$/', $digits)) return '963'.substr($digits, 1);
        if (preg_match('/^\d{8}$/', $digits)) return '9639'.$digits;

        return null;
    }

    public static function variants(string $canonical): array
    {
        return [$canonical, '09'.substr($canonical, 3)];
    }
}

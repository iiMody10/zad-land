"use client";

import React, { createContext, useContext, useSyncExternalStore } from 'react';
import { useLanguage } from './LanguageContext';

type Currency = 'USD' | 'SYP';
const CURRENCY_PREFERENCE_VERSION = '2';
const CURRENCY_CHANGE_EVENT = 'zadland:currency-change';
let volatileCurrency: Currency = 'SYP';

function getCurrencySnapshot(): Currency {
    try {
        if (localStorage.getItem('currency-preference-version') !== CURRENCY_PREFERENCE_VERSION) {
            return 'SYP';
        }
        const savedCurrency = localStorage.getItem('currency');
        if (savedCurrency === 'USD' || savedCurrency === 'SYP') return savedCurrency;
    } catch {
        return volatileCurrency;
    }
    return 'SYP';
}

function subscribeToCurrency(onStoreChange: () => void) {
    if (typeof window === 'undefined') return () => {};

    window.addEventListener('storage', onStoreChange);
    window.addEventListener(CURRENCY_CHANGE_EVENT, onStoreChange);
    try {
        // Old USD values were the previous default, not a deliberate preference.
        if (localStorage.getItem('currency-preference-version') !== CURRENCY_PREFERENCE_VERSION) {
            localStorage.setItem('currency', 'SYP');
            localStorage.setItem('currency-preference-version', CURRENCY_PREFERENCE_VERSION);
            volatileCurrency = 'SYP';
        }
    } catch {
        // The external store uses its in-memory SYP default when storage is unavailable.
    }

    return () => {
        window.removeEventListener('storage', onStoreChange);
        window.removeEventListener(CURRENCY_CHANGE_EVENT, onStoreChange);
    };
}

function getServerCurrencySnapshot(): Currency {
    return 'SYP';
}

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    exchangeRate: number;
    formatPrice: (usdPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children, initialExchangeRate }: { children: React.ReactNode, initialExchangeRate: number }) {
    const currency = useSyncExternalStore(subscribeToCurrency, getCurrencySnapshot, getServerCurrencySnapshot);
    const { language } = useLanguage();

    const setCurrency = (curr: Currency) => {
        volatileCurrency = curr;
        try {
            localStorage.setItem('currency', curr);
            localStorage.setItem('currency-preference-version', CURRENCY_PREFERENCE_VERSION);
        } catch {
            // The in-memory currency switch still works if storage is unavailable.
        }
        if (typeof window !== 'undefined') window.dispatchEvent(new Event(CURRENCY_CHANGE_EVENT));
    };

    const formatPrice = (usdPrice: number) => {
        const num = Number(usdPrice || 0);
        const symbol = language === 'ar' ? 'ل.س' : 'SYP';
        const locale = language === 'ar' ? 'ar-SY-u-nu-latn' : 'en-US';
        
        if (currency === 'USD') {
            return `$${num.toFixed(2)}`;
        } else {
            const price = Math.round(num * initialExchangeRate);
            return language === 'ar' ? `${symbol} ${price.toLocaleString(locale)}` : `${price.toLocaleString(locale)} ${symbol}`;
        }
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRate: initialExchangeRate, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}

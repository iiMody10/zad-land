"use client";

import React, { createContext, useContext } from 'react';

interface CurrencyContextType {
    currency: 'USD';
    formatPrice: (usdPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const formatPrice = (usdPrice: number) => `$${Number(usdPrice || 0).toFixed(2)}`;

    return (
        <CurrencyContext.Provider value={{ currency: 'USD', formatPrice }}>
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

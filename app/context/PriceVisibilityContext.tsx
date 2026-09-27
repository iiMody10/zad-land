"use client";

import { createContext, useContext } from "react";

const PriceVisibilityContext = createContext(false);

export function PriceVisibilityProvider({ children, allowed }: { children: React.ReactNode; allowed: boolean }) {
    return <PriceVisibilityContext.Provider value={allowed}>{children}</PriceVisibilityContext.Provider>;
}

export function usePriceVisibility() {
    return useContext(PriceVisibilityContext);
}

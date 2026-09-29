"use client";

import { createContext, useContext } from "react";

type BusinessContact = {
    whatsappNumber: string;
    whatsappUrl: string;
};

const BusinessContactContext = createContext<BusinessContact>({
    whatsappNumber: "+963933254796",
    whatsappUrl: "https://wa.me/963933254796",
});

export function BusinessContactProvider({
    children,
    whatsappNumber,
    whatsappUrl,
}: BusinessContact & { children: React.ReactNode }) {
    return <BusinessContactContext.Provider value={{ whatsappNumber, whatsappUrl }}>{children}</BusinessContactContext.Provider>;
}

export function useBusinessContact() {
    return useContext(BusinessContactContext);
}

export function toWhatsAppUrl(phone: string) {
    const digits = phone.replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : "#";
}

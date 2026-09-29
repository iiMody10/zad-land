"use client";

import { ThemeProvider } from "next-themes";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { Toaster } from "react-hot-toast";
import CartDrawer from "./components/CartDrawer";
import { PriceVisibilityProvider } from "./context/PriceVisibilityContext";
import { WishlistProvider } from "./context/WishlistContext";

export function Providers({ 
    children, 
    session, 
    initialLanguage = 'ar',
    priceVisible = false
}: { 
    children: React.ReactNode, 
    session?: any, 
    initialLanguage?: 'en' | 'ar',
    priceVisible?: boolean
}) {
    return (
        <LanguageProvider initialLanguage={initialLanguage}>
            <CurrencyProvider>
                <PriceVisibilityProvider allowed={priceVisible}>
                <WishlistProvider>
                <CartProvider>
                    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
                        {children}
                        <CartDrawer />
                        <Toaster
                            position="bottom-right"
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    background: 'var(--color-surface-light)',
                                    color: 'var(--color-text-main-light)',
                                    border: '1px solid var(--color-line)',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                },
                                success: {
                                    iconTheme: {
                                        primary: 'var(--color-brand-hover)',
                                        secondary: 'white',
                                    },
                                    style: {
                                        border: '1px solid var(--color-line)',
                                    }
                                },
                                error: {
                                    iconTheme: {
                                        primary: '#ef4444',
                                        secondary: 'white',
                                    },
                                    style: {
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                    }
                                },
                                className: 'dark:!bg-zinc-900 dark:!text-white dark:!border-white/10 font-sans',
                            }}
                        />
                    </ThemeProvider>
                </CartProvider>
                </WishlistProvider>
                </PriceVisibilityProvider>
            </CurrencyProvider>
        </LanguageProvider>
    );

}

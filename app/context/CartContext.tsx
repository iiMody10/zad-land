"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    slug: string;
    description?: string;
    selectedOption?: string;
    minOrder?: number;
    /** Maximum total quantity available across all options for this product. */
    stock?: number;
    packaging?: string | null;
    itemsPerPackage?: string | null;
}

interface CartContextType {
    items: CartItem[];
    isHydrated: boolean;
    addItem: (item: CartItem) => void;
    removeItem: (id: string, selectedOption?: string) => void;
    updateQuantity: (id: string, quantity: number, selectedOption?: string) => void;
    clearCart: () => void;
    cartCount: number;
    totalItems: number;
    subtotal: number;
    isDrawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const getItemKey = (item: { id: string; selectedOption?: string }) => 
        `${item.id}:${item.selectedOption || ''}`;

    // Load from local storage on mount
    useEffect(() => {
        let cancelled = false;
        queueMicrotask(() => {
            if (cancelled) return;
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                try {
                    setItems(JSON.parse(savedCart));
                } catch (error) {
                    console.error("Failed to parse cart from local storage", error);
                }
            }
            setIsLoaded(true);
        });
        return () => { cancelled = true; };
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = (newItem: CartItem) => {
        const minOrder = Math.max(1, newItem.minOrder || 1);
        const normalizedItem = { ...newItem, quantity: Math.max(minOrder, newItem.quantity) };
        setItems(prev => {
            const productQuantity = prev.reduce((sum, item) => item.id === normalizedItem.id ? sum + item.quantity : sum, 0);
            const stock = normalizedItem.stock ?? prev.find(item => item.id === normalizedItem.id)?.stock;
            const remaining = stock === undefined ? Number.POSITIVE_INFINITY : Math.max(0, stock - productQuantity);
            if (remaining < minOrder) return prev;
            const quantityToAdd = Math.min(normalizedItem.quantity, remaining);
            if (quantityToAdd < minOrder) return prev;
            const targetKey = getItemKey(normalizedItem);
            const existing = prev.find(item => getItemKey(item) === targetKey);
            if (existing) {
                return prev.map(item =>
                    getItemKey(item) === targetKey
                        ? { ...item, ...normalizedItem, quantity: item.quantity + quantityToAdd }
                        : item
                );
            }
            return [...prev, { ...normalizedItem, quantity: quantityToAdd }];
        });
    };

    const removeItem = (id: string, selectedOption?: string) => {
        const targetKey = `${id}:${selectedOption || ''}`;
        setItems(prev => prev.filter(item => {
            if (selectedOption !== undefined) {
                return getItemKey(item) !== targetKey;
            }
            return item.id !== id;
        }));
    };

    const updateQuantity = (id: string, quantity: number, selectedOption?: string) => {
        if (quantity < 1) return;
        const targetKey = `${id}:${selectedOption || ''}`;
        setItems(prev => {
            const targetItems = prev.filter(item => selectedOption !== undefined
                ? getItemKey(item) === targetKey
                : item.id === id);
            if (!targetItems.length) return prev;
            const item = targetItems[0];
            const stock = item.stock ?? prev.find(candidate => candidate.id === id && candidate.stock !== undefined)?.stock;
            const otherQuantity = prev.reduce((sum, candidate) =>
                candidate.id === id && !targetItems.includes(candidate) ? sum + candidate.quantity : sum, 0);
            const maxForTarget = stock === undefined ? Number.POSITIVE_INFINITY : Math.max(0, stock - otherQuantity);
            const nextQuantity = Math.min(Math.max(item.minOrder || 1, quantity), maxForTarget);
            if (nextQuantity < (item.minOrder || 1)) return prev;
            return prev.map(candidate => targetItems.includes(candidate)
                ? { ...candidate, quantity: nextQuantity }
                : candidate);
        });
    };

    const clearCart = () => {
        setItems([]);
    };

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);
    const toggleDrawer = () => setIsDrawerOpen(prev => !prev);

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, isHydrated: isLoaded, addItem, removeItem, updateQuantity, clearCart, cartCount, totalItems: cartCount, subtotal, isDrawerOpen, openDrawer, closeDrawer, toggleDrawer }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

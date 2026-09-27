"use client";

import React from 'react';
import { ShoppingBag as MdShoppingBag } from 'lucide-react';
import CartBadge from './CartBadge';
import { useCart } from '@/app/context/CartContext';

const CartTrigger = () => {
    const { openDrawer } = useCart();

    return (
        <button 
            onClick={openDrawer}
            className="p-2 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors text-text-main-light dark:text-text-main-dark relative group"
            aria-label="Open Cart"
        >
            <MdShoppingBag className="text-[24px]" />
            <CartBadge />
        </button>
    );
};

export default CartTrigger;

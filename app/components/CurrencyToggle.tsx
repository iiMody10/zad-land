"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '@/app/context/CurrencyContext';
import { useLanguage } from '@/app/context/LanguageContext';

const CurrencyToggle = () => {
    const { currency, setCurrency } = useCurrency();
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-zinc-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <span>{currency === 'USD' ? '$' : (language === 'ar' ? 'ل.س' : 'SYP')}</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute end-0 mt-2 w-32 rounded-xl shadow-xl border border-gray-100 bg-white dark:bg-zinc-900 dark:border-white/10 z-50 p-1.5 origin-top-right transition-all">
                    <div className="flex flex-col gap-0.5" role="menu" aria-orientation="vertical">
                        <button
                            type="button"
                            onClick={() => {
                                setCurrency('USD');
                                setIsOpen(false);
                            }}
                            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${currency === 'USD' ? 'bg-gray-100 dark:bg-white/10 text-zinc-900 dark:text-white font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 dark:hover:text-white font-medium'}`}
                            role="menuitem"
                        >
                            <span>USD ($)</span>
                            {currency === 'USD' && (
                                <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setCurrency('SYP');
                                setIsOpen(false);
                            }}
                            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${currency === 'SYP' ? 'bg-gray-100 dark:bg-white/10 text-zinc-900 dark:text-white font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 dark:hover:text-white font-medium'}`}
                            role="menuitem"
                        >
                            <span>{language === 'ar' ? 'ل.س (SYP)' : 'SYP'}</span>
                            {currency === 'SYP' && (
                                <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrencyToggle;

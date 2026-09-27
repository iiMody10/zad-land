"use client";

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { ChevronDown as MdKeyboardArrowDown } from 'lucide-react';

const LanguageToggle = () => {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-0.5 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-all text-zinc-900 dark:text-white"
            aria-label={language === 'en' ? 'AR - Switch to Arabic' : 'EN - Switch to English'}
            title={language === 'en' ? 'العربية' : 'English'}
        >
            <span className="font-bold text-xs tracking-tight">
                {language === 'ar' ? 'AR' : 'EN'}
            </span>
            <MdKeyboardArrowDown className="text-sm opacity-70" />
        </button>
    );
};

export default LanguageToggle;


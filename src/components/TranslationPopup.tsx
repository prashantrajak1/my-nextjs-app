'use client';

import { useTranslation } from '@/context/TranslationContext';
import { useEffect, useState } from 'react';

export default function TranslationPopup() {
    const { language, setLanguage, isLoaded } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isLoaded) {
            // Check if language has been explicitly set in this session or previously
            // For this requirement, we want to show it on "login" (or first load)
            // We can check if a specific flag exists in sessionStorage to show it once per session
            const hasSeenPopup = sessionStorage.getItem('hasSeenLanguagePopup');
            if (!hasSeenPopup) {
                setIsVisible(true);
            }
        }
    }, [isLoaded]);

    const handleSelect = (lang: 'en' | 'ne') => {
        setLanguage(lang);
        setIsVisible(false);
        sessionStorage.setItem('hasSeenLanguagePopup', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all scale-100">
                <div className="text-center space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Welcome / स्वागत छ
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Please select your preferred language
                        <br />
                        कृपया आफ्नो मनपर्ने भाषा छान्नुहोस्
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button
                            onClick={() => handleSelect('en')}
                            className="p-4 rounded-xl border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 dark:border-slate-700 dark:hover:border-blue-500 dark:hover:bg-slate-700 transition-all group"
                        >
                            <div className="text-3xl mb-2">🇺🇸</div>
                            <div className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600">English</div>
                        </button>

                        <button
                            onClick={() => handleSelect('ne')}
                            className="p-4 rounded-xl border-2 border-red-100 hover:border-red-500 hover:bg-red-50 dark:border-slate-700 dark:hover:border-red-500 dark:hover:bg-slate-700 transition-all group"
                        >
                            <div className="text-3xl mb-2">🇳🇵</div>
                            <div className="font-semibold text-gray-800 dark:text-white group-hover:text-red-600">नेपाली</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, DollarSign, ShoppingCart, LogOut, Factory } from 'lucide-react';
import clsx from 'clsx';

import { useTranslation } from '@/context/TranslationContext';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { t, language, setLanguage } = useTranslation();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'ne' : 'en';
        setLanguage(newLang);
    };

    const navItems = [
        { name: t('dashboard'), href: '/', icon: LayoutDashboard },
        { name: t('labors'), href: '/labors', icon: Users },
        { name: t('expenses'), href: '/expenses', icon: DollarSign },
        { name: t('manufacturing'), href: '/manufacturing', icon: Factory },
        { name: t('sales'), href: '/sales', icon: ShoppingCart },
    ];

    return (
        <nav className="w-full mb-8 p-4 bg-gray-900/90 backdrop-blur-md sticky top-4 z-50 border-b border-white/10 shadow-2xl">
            <div className="flex flex-col xl:flex-row items-center justify-between gap-4 w-full max-w-[1600px] mx-auto">

                {/* 1. CENTER: Navigation Buttons */}
                <div className="flex flex-wrap justify-center items-center gap-2 lg:gap-4 flex-1 w-full order-2 xl:order-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    'group flex flex-col justify-center items-center gap-1 px-4 py-2 min-h-[70px] min-w-[100px] transition-all duration-200 cursor-pointer border-2 hover:scale-105',
                                    'rounded-md shadow-lg',
                                    isActive ? 'border-gray-500 scale-105' : 'border-transparent hover:border-gray-600'
                                )}
                                style={{
                                    backgroundColor: isActive ? '#374151' : '#1f2937',
                                    color: 'white',
                                    textTransform: 'uppercase',
                                    fontWeight: '800',
                                }}
                            >
                                <Icon size={22} strokeWidth={3} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                                <span className="text-sm sm:text-base tracking-wider leading-none" style={{ fontFamily: 'sans-serif' }}>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* 2. RIGHT: Controls (Visible Always) */}
                <div className="flex items-center justify-center xl:justify-end gap-3 w-full xl:w-auto xl:ml-auto order-1 xl:order-2 mb-4 xl:mb-0">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center justify-center w-14 h-14 bg-[#1f2937] hover:bg-[#374151] rounded-md border-2 border-transparent hover:border-gray-600 transition-all font-bold text-white shadow-lg"
                        title="Switch Language"
                    >
                        <span className="text-lg">{language === 'en' ? 'NE' : 'EN'}</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-5 h-14 bg-[#1f2937] hover:bg-red-900/30 rounded-md border-2 border-red-900/30 hover:border-red-500 text-red-400 hover:text-red-300 transition-all font-bold shadow-lg"
                        title={t('logout')}
                    >
                        <LogOut size={22} strokeWidth={3} />
                        <span className="text-lg">{t('logout').toUpperCase()}</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}

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
        <nav className="glass-panel mb-8 p-4 sticky top-4 z-50">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                {/* Logo Section */}
                <div className="flex items-center gap-3 w-full lg:w-auto justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white text-2xl shadow-lg border-2 border-white/10">
                            SIU
                        </div>
                        <span className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            संजय इट्टा उद्योग
                        </span>
                    </div>

                    {/* Mobile Controls (visible only on small screens) */}
                    <div className="flex gap-2 lg:hidden">
                        <button
                            onClick={toggleLanguage}
                            className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all"
                        >
                            {language === 'en' ? '🇳🇵' : '🇺🇸'}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-red-500/30 bg-red-500/10 text-red-400"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="flex flex-wrap justify-center gap-3 w-full lg:w-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    'flex items-center gap-2 px-6 py-3 rounded-xl transition-all border-2 cursor-pointer font-bold text-sm sm:text-base',
                                    isActive
                                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/10 hover:scale-105'
                                )}
                            >
                                <Icon size={20} strokeWidth={2.5} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop Controls */}
                <div className="hidden lg:flex gap-3">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all font-bold"
                        title="Switch Language"
                    >
                        <span className="text-xl">{language === 'en' ? '🇳🇵' : '🇺🇸'}</span>
                        <span>{language === 'en' ? 'NE' : 'EN'}</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all cursor-pointer shadow-sm hover:shadow-lg hover:shadow-red-500/20 font-bold"
                        title={t('logout')}
                    >
                        <LogOut size={20} strokeWidth={2.5} />
                        <span>{t('logout')}</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}

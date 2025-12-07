'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, DollarSign, ShoppingCart, LogOut, Factory } from 'lucide-react';
import clsx from 'clsx';

import { useTranslation } from '@/context/TranslationContext';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { t } = useTranslation();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    const navItems = [
        { name: t('dashboard'), href: '/', icon: LayoutDashboard },
        { name: t('labors'), href: '/labors', icon: Users },
        { name: t('expenses'), href: '/expenses', icon: DollarSign },
        { name: t('manufacturing'), href: '/manufacturing', icon: Factory },
        { name: t('sales'), href: '/sales', icon: ShoppingCart },
    ];

    return (
        <nav className="glass-panel mb-8 p-4 flex justify-between items-center sticky top-4 z-50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white text-xl shadow-lg">
                    SIU
                </div>
                <span className="font-bold text-xl hidden sm:block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    संजय इट्टा उद्योग
                </span>
            </div>

            <div className="flex gap-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                'flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all border-2 cursor-pointer',
                                isActive
                                    ? 'bg-primary/20 text-primary border-primary/50 shadow-lg shadow-primary/20'
                                    : 'border-white/10 hover:border-primary/30 hover:bg-white/5 text-gray-400 hover:text-white hover:shadow-md'
                            )}
                        >
                            <Icon size={18} />
                            <span className="hidden sm:block font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>

            <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all cursor-pointer shadow-sm hover:shadow-lg hover:shadow-red-500/20"
                title={t('logout')}
            >
                <LogOut size={18} />
                <span className="hidden sm:block font-medium">{t('logout')}</span>
            </button>
        </nav>
    );
}

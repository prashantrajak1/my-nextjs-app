'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, DollarSign, ShoppingCart, LogOut } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    const navItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Labors', href: '/labors', icon: Users },
        { name: 'Expenses', href: '/expenses', icon: DollarSign },
        { name: 'Sales', href: '/sales', icon: ShoppingCart },
    ];

    return (
        <nav className="glass-panel mb-8 p-4 flex justify-between items-center sticky top-4 z-50">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white">
                    S
                </div>
                <span className="font-bold text-lg hidden sm:block">Sanjay Itta Udhyog</span>
            </div>

            <div className="flex gap-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                                isActive
                                    ? 'bg-primary/20 text-primary border border-primary/50'
                                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                            )}
                        >
                            <Icon size={18} />
                            <span className="hidden sm:block">{item.name}</span>
                        </Link>
                    );
                })}
            </div>

            <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                title="Logout"
            >
                <LogOut size={20} />
            </button>
        </nav>
    );
}

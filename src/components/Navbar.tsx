
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ReceiptIndianRupee,
  Factory,
  ShoppingCart,
  LogOut,
} from 'lucide-react';
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
    { name: 'Expenses', href: '/expenses', icon: ReceiptIndianRupee },
    { name: 'Manufacturing', href: '/manufacturing', icon: Factory },
    { name: 'Sales', href: '/sales', icon: ShoppingCart },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black shadow-md shadow-amber-500/40">
            S
          </div>
          <span className="text-sm font-semibold text-slate-100">
            Sanjay Itta Udhyog
          </span>
        </div>

        {/* Nav items */}
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                  isActive
                    ? 'border-amber-400/80 bg-amber-400/15 text-amber-200 shadow-[0_0_18px_rgba(250,204,21,0.35)]'
                    : 'border-transparent text-slate-300 hover:border-slate-600 hover:bg-slate-800/80 hover:text-amber-200'
                )}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-red-500/60 px-3 py-1.5 text-xs font-medium text-red-300 transition-all hover:bg-red-500/15 hover:text-red-100"
          title="Logout"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </nav>
    </header>
  );
}


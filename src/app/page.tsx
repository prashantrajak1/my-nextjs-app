// import Navbar from '@/components/Navbar';
// import { prisma } from '@/lib/db';
// import { Users, DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';

// export default async function Dashboard() {
//   const totalLabors = await prisma.labor.count();

//   const expenses = await prisma.expense.findMany();
//   const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

//   const sales = await prisma.sale.findMany();
//   const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
//   const receivedAmount = sales.reduce((sum, sale) => sum + sale.receivedAmount, 0);

//   // Inventory Stats
//   const brickStocks = await prisma.brickStock.findMany();
//   const stockMap = brickStocks.reduce((acc, stock) => {
//     acc[stock.type] = stock.quantity;
//     return acc;
//   }, {} as Record<string, number>);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
//       <Navbar />

//       <main className="container mx-auto px-4 py-8">
//         {/* Hero Section */}
//         <div className="text-center mb-12 animate-fade-in">
//           <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
//             <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
//               SANJAY ITTA UDHYOG
//             </span>
//           </h1>
//           <p className="text-xl text-gray-400 font-light tracking-wide">
//             Premium Brick Manufacturing & Management System
//           </p>
//         </div>

//         {/* Inventory Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-up">
//           {['No.1', 'No.2', 'No.3'].map((type) => (
//             <div key={type} className="glass-card flex items-center justify-between p-6 border-l-4 border-blue-500">
//               <div>
//                 <p className="text-gray-400 text-sm uppercase tracking-wider">Brick {type}</p>
//                 <p className="text-3xl font-bold text-white mt-1">
//                   {(stockMap[type] || 0).toLocaleString()}
//                 </p>
//               </div>
//               <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
//                 <Package size={28} />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Main Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="glass-card hover:bg-white/5 transition-all duration-300 group">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
//                 <Users size={24} />
//               </div>
//               <span className="text-xs font-medium text-gray-500 bg-white/10 px-2 py-1 rounded-full">Active</span>
//             </div>
//             <h3 className="text-3xl font-bold text-white mb-1">{totalLabors}</h3>
//             <p className="text-sm text-gray-400">Total Labors</p>
//           </div>

//           <div className="glass-card hover:bg-white/5 transition-all duration-300 group">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 rounded-full bg-red-500/20 text-red-400 group-hover:scale-110 transition-transform">
//                 <DollarSign size={24} />
//               </div>
//               <span className="text-xs font-medium text-gray-500 bg-white/10 px-2 py-1 rounded-full">Monthly</span>
//             </div>
//             <h3 className="text-3xl font-bold text-white mb-1">₹{totalExpenses.toLocaleString()}</h3>
//             <p className="text-sm text-gray-400">Total Expenses</p>
//           </div>

//           <div className="glass-card hover:bg-white/5 transition-all duration-300 group">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 rounded-full bg-green-500/20 text-green-400 group-hover:scale-110 transition-transform">
//                 <ShoppingCart size={24} />
//               </div>
//               <span className="text-xs font-medium text-gray-500 bg-white/10 px-2 py-1 rounded-full">Revenue</span>
//             </div>
//             <h3 className="text-3xl font-bold text-white mb-1">₹{totalSales.toLocaleString()}</h3>
//             <p className="text-sm text-gray-400">Total Sales</p>
//           </div>

//           <div className="glass-card hover:bg-white/5 transition-all duration-300 group">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 rounded-full bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
//                 <TrendingUp size={24} />
//               </div>
//               <span className="text-xs font-medium text-gray-500 bg-white/10 px-2 py-1 rounded-full">Cash In</span>
//             </div>
//             <h3 className="text-3xl font-bold text-white mb-1">₹{receivedAmount.toLocaleString()}</h3>
//             <p className="text-sm text-gray-400">Received Amount</p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


// app/page.tsx  or  src/app/page.tsx

// app/page.tsx or src/app/page.tsx

import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import {
  Users,
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  Factory,
} from 'lucide-react';

function formatCurrency(value: number | null | undefined) {
  if (value == null) return '₹0';
  return `₹${value.toLocaleString('en-IN')}`;
}

export default async function DashboardPage() {
  const [laborCount, expenseAgg, salesAgg] = await Promise.all([
    prisma.labor.count(),
    prisma.expense.aggregate({ _sum: { amount: true } }),
    prisma.sale.aggregate({ _sum: { totalAmount: true, receivedAmount: true } }),
  ]);

  const totalExpenses = expenseAgg._sum.amount ?? 0;
  const totalSales = salesAgg._sum.totalAmount ?? 0;
  const totalReceived = salesAgg._sum.receivedAmount ?? 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-10 pt-6 space-y-6">
        {/* HEADER CARD */}
        <section className="rounded-2xl border border-slate-700 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900 p-6 shadow-xl">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/40">
                <Factory size={32} />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  SANJAY ITTA UDHYOG
                </h1>
                <p className="mt-1 text-sm text-slate-300">
                  Premium Brick Manufacturing &amp; Management System
                </p>
              </div>
            </div>

            <div className="mt-2 grid w-full max-w-xs grid-cols-2 gap-3 text-sm md:mt-0">
              <div className="rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-center">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  Active Labors
                </p>
                <p className="mt-1 text-xl font-bold text-amber-300">
                  {laborCount}
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-center">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  Total Revenue
                </p>
                <p className="mt-1 text-xl font-bold text-emerald-300">
                  {formatCurrency(totalReceived)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STATS GRID */}
        <section className="grid gap-4 md:grid-cols-4">
          {/* Total Labors */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-700 bg-slate-900/90 p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                <Users size={22} />
              </div>
              <span className="text-[11px] uppercase tracking-wide text-slate-400">
                Workforce
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs text-slate-400">Total Labors</p>
              <p className="mt-1 text-2xl font-bold">{laborCount}</p>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-700 bg-slate-900/90 p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 text-red-300">
                <IndianRupee size={22} />
              </div>
              <span className="text-[11px] uppercase tracking-wide text-slate-400">
                Outflow
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs text-slate-400">Total Expenses</p>
              <p className="mt-1 text-2xl font-bold text-red-300">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>

          {/* Total Sales */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-700 bg-slate-900/90 p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300">
                <ShoppingCart size={22} />
              </div>
              <span className="text-[11px] uppercase tracking-wide text-slate-400">
                Gross Sales
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs text-slate-400">Total Sales Value</p>
              <p className="mt-1 text-2xl font-bold text-sky-300">
                {formatCurrency(totalSales)}
              </p>
            </div>
          </div>

          {/* Total Received */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-700 bg-slate-900/90 p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                <TrendingUp size={22} />
              </div>
              <span className="text-[11px] uppercase tracking-wide text-slate-400">
                Cash In
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs text-slate-400">Total Received</p>
              <p className="mt-1 text-2xl font-bold text-emerald-300">
                {formatCurrency(totalReceived)}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}



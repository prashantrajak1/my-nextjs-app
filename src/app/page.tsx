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

import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import { Users, IndianRupee, ShoppingCart, TrendingUp, Factory } from 'lucide-react';

// Format helper for rupee values
function formatCurrency(value: number | null | undefined) {
  if (value == null) return '₹0';
  return `₹${value.toLocaleString('en-IN')}`;
}

export default async function DashboardPage() {
  // Fetch dashboard stats in parallel
  const [laborCount, expenseAgg, salesAgg] = await Promise.all([
    prisma.labor.count(),
    prisma.expense.aggregate({
      _sum: { amount: true },
    }),
    prisma.sale.aggregate({
      _sum: { totalAmount: true, receivedAmount: true },
    }),
  ]);

  const totalExpenses = expenseAgg._sum.amount ?? 0;
  const totalSales = salesAgg._sum.totalAmount ?? 0;
  const totalReceived = salesAgg._sum.receivedAmount ?? 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#0f172a,_#020617_55%,_#000_100%)] text-white">
      <Navbar />

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-12 pt-8">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900/90 via-indigo-900/90 to-slate-900/90 px-6 py-8 shadow-2xl shadow-indigo-900/40 border border-white/10">
          {/* subtle glow */}
          <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            {/* Left: Logo + title */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-slate-900 shadow-xl shadow-amber-500/40">
                  <Factory size={32} />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.35em] text-amber-300">
                    SANJAY ITTA UDHYOG
                  </p>
                  <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Premium Brick Manufacturing &amp; Management System
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300">
                    Monitor labors, expenses and sales in one unified dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: quick headline numbers */}
            <div className="grid w-full max-w-md grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 shadow-lg shadow-black/40">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  Active Labors
                </p>
                <p className="mt-1 text-2xl font-bold text-amber-300">
                  {laborCount}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 shadow-lg shadow-black/40">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  Total Revenue
                </p>
                <p className="mt-1 text-2xl font-bold text-emerald-300">
                  {formatCurrency(totalReceived)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STATS GRID */}
        <section className="grid gap-6 md:grid-cols-4">
          {/* Total Labors */}
          <div className="group rounded-3xl bg-slate-950/70 border border-white/5 p-5 shadow-lg shadow-black/40 hover:border-amber-400/70 hover:shadow-amber-500/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-amber-400/15 p-3 text-amber-300">
                <Users size={24} />
              </div>
              <span className="text-[10px] uppercase tracking-wide text-slate-400">
                Workforce
              </span>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400">Total Labors</p>
            <p className="mt-1 text-3xl font-extrabold">{laborCount}</p>
          </div>

          {/* Total Expenses */}
          <div className="group rounded-3xl bg-slate-950/70 border border-white/5 p-5 shadow-lg shadow-black/40 hover:border-red-400/70 hover:shadow-red-500/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-red-500/15 p-3 text-red-300">
                <IndianRupee size={24} />
              </div>
              <span className="text-[10px] uppercase tracking-wide text-slate-400">
                Outflow
              </span>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400">Total Expenses</p>
            <p className="mt-1 text-2xl font-extrabold text-red-300">
              {formatCurrency(totalExpenses)}
            </p>
          </div>

          {/* Total Sales */}
          <div className="group rounded-3xl bg-slate-950/70 border border-white/5 p-5 shadow-lg shadow-black/40 hover:border-sky-400/70 hover:shadow-sky-500/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-sky-500/15 p-3 text-sky-300">
                <ShoppingCart size={24} />
              </div>
              <span className="text-[10px] uppercase tracking-wide text-slate-400">
                Gross Sales
              </span>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400">Total Sales Value</p>
            <p className="mt-1 text-2xl font-extrabold text-sky-300">
              {formatCurrency(totalSales)}
            </p>
          </div>

          {/* Received Amount */}
          <div className="group rounded-3xl bg-slate-950/70 border border-white/5 p-5 shadow-lg shadow-black/40 hover:border-emerald-400/70 hover:shadow-emerald-500/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-300">
                <TrendingUp size={24} />
              </div>
              <span className="text-[10px] uppercase tracking-wide text-slate-400">
                Cash In
              </span>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400">Total Received</p>
            <p className="mt-1 text-2xl font-extrabold text-emerald-300">
              {formatCurrency(totalReceived)}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}


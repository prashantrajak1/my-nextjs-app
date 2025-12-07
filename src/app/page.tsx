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

import { prisma } from '@/lib/db';
import DashboardContent from '@/components/DashboardContent';

// Brick types used in the system
const BRICK_TYPES = ['No.1', 'No.2', 'No.3'] as const;

export default async function DashboardPage() {
  // Get current year start date
  const currentYear = new Date().getFullYear();
  const yearStart = new Date(currentYear, 0, 1);

  const [
    laborCount,
    expenseAgg,
    salesAgg,
    salesCount,
    salesByType,
    manufacturingByType,
    totalAdvanceAgg,
    totalLaborPaidAgg,
    rawBricksAgg,
  ] = await Promise.all([
    prisma.labor.count(),
    prisma.expense.aggregate({ _sum: { amount: true } }),
    prisma.sale.aggregate({
      _sum: { totalAmount: true, receivedAmount: true, quantity: true },
    }),
    prisma.sale.count(),
    // Get sales grouped by brick type
    prisma.sale.groupBy({
      by: ['brickType'],
      _sum: { quantity: true },
    }),
    // Get manufacturing data for current year grouped by brick type
    prisma.brickManufacturing.groupBy({
      by: ['brickType'],
      _sum: { quantity: true },
      where: {
        date: { gte: yearStart },
      },
    }),
    // Labor Financials: Total Advance (Sum of positive due)
    prisma.labor.aggregate({
      _sum: { due: true },
      where: { due: { gt: 0 } },
    }),
    // Labor Financials: Total Labor Expenses
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: { category: 'Labor' },
    }),
    // Total Raw Bricks (Sum of bricks made by all labors)
    prisma.labor.aggregate({
      _sum: { bricksMade: true },
    }),
  ]);

  const totalAdvance = totalAdvanceAgg._sum.due ?? 0;
  const totalLaborPaid = totalLaborPaidAgg._sum.amount ?? 0;
  const totalRawBricks = rawBricksAgg._sum.bricksMade ?? 0;

  const totalExpenses = expenseAgg._sum.amount ?? 0;
  const totalSales = salesAgg._sum.totalAmount ?? 0;
  const totalReceived = salesAgg._sum.receivedAmount ?? 0;
  const totalBricksSold = salesAgg._sum.quantity ?? 0;

  // Calculate manufacturing totals by type
  const manufacturedByType: Record<string, number> = {};
  let totalManufactured = 0;

  manufacturingByType.forEach((item) => {
    const qty = item._sum.quantity ?? 0;
    manufacturedByType[item.brickType] = qty;
    totalManufactured += qty;
  });

  // Calculate sales by type
  const soldByType: Record<string, number> = {};
  salesByType.forEach((item) => {
    const qty = item._sum.quantity ?? 0;
    soldByType[item.brickType] = qty;
  });

  // Calculate remaining by type
  const remainingByType: Record<string, number> = {};
  BRICK_TYPES.forEach((type) => {
    const manufactured = manufacturedByType[type] ?? 0;
    const sold = soldByType[type] ?? 0;
    remainingByType[type] = manufactured - sold;
  });

  const avgBricksPerSale =
    salesCount > 0 ? Math.round(totalBricksSold / salesCount) : 0;

  return (
    <DashboardContent
      laborCount={laborCount}
      totalExpenses={totalExpenses}
      totalSales={totalSales}
      totalReceived={totalReceived}
      totalAdvance={totalAdvance}
      totalLaborPaid={totalLaborPaid}
      totalRawBricks={totalRawBricks}
      totalManufactured={totalManufactured}
      totalBricksSold={totalBricksSold}
      manufacturedByType={manufacturedByType}
      soldByType={soldByType}
      remainingByType={remainingByType}
      avgBricksPerSale={avgBricksPerSale}
      currentYear={currentYear}
    />
  );
}





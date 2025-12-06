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
  Package2,
  Factory,
  TrendingDown,
} from 'lucide-react';

function formatCurrency(value: number | null | undefined) {
  if (value == null) return '₹0';
  return `₹${value.toLocaleString('en-IN')}`;
}

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
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-inner">
        {/* HEADER SECTION */}
        <section className="dashboard-header-card">
          <div className="dashboard-header-left">
            <div className="dashboard-logo">S</div>
            <div className="dashboard-title-block">
              <h1>SANJAY ITTA UDHYOG</h1>
              <p>Premium Brick Manufacturing &amp; Management System</p>
            </div>
          </div>

          <div className="dashboard-header-right">
            <div className="dashboard-mini-card">
              <div className="dashboard-mini-card-label">Active Labors</div>
              <div className="dashboard-mini-card-value">
                {laborCount}
              </div>
            </div>
            <div className="dashboard-mini-card">
              <div className="dashboard-mini-card-label">Total Revenue</div>
              <div className="dashboard-mini-card-value">
                {formatCurrency(totalReceived)}
              </div>
            </div>
          </div>
        </section>

        {/* GRID OF MAIN CARDS */}
        <section className="dashboard-grid">
          {/* Total Labors */}
          <div className="dashboard-card dashboard-card--labors">
            <div className="dashboard-card-header">
              <div className="dashboard-card-icon">
                <Users size={22} />
              </div>
              <div className="dashboard-card-label">WORKFORCE</div>
            </div>
            <div>
              <div className="dashboard-card-title">Total Labors</div>
              <div className="dashboard-card-value">{laborCount}</div>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="dashboard-card dashboard-card--expenses">
            <div className="dashboard-card-header">
              <div className="dashboard-card-icon">
                <IndianRupee size={22} />
              </div>
              <div className="dashboard-card-label">OUTFLOW</div>
            </div>
            <div>
              <div className="dashboard-card-title">Total Expenses</div>
              <div className="dashboard-card-value">
                {formatCurrency(totalExpenses)}
              </div>
            </div>
          </div>

          {/* Total Sales */}
          <div className="dashboard-card dashboard-card--sales">
            <div className="dashboard-card-header">
              <div className="dashboard-card-icon">
                <ShoppingCart size={22} />
              </div>
              <div className="dashboard-card-label">GROSS SALES</div>
            </div>
            <div>
              <div className="dashboard-card-title">Total Sales Value</div>
              <div className="dashboard-card-value">
                {formatCurrency(totalSales)}
              </div>
            </div>
          </div>

          {/* Total Received */}
          <div className="dashboard-card dashboard-card--received">
            <div className="dashboard-card-header">
              <div className="dashboard-card-icon">
                <TrendingUp size={22} />
              </div>
              <div className="dashboard-card-label">CASH IN</div>
            </div>
            <div>
              <div className="dashboard-card-title">Total Received</div>
              <div className="dashboard-card-value">
                {formatCurrency(totalReceived)}
              </div>
            </div>
          </div>
        </section>

        {/* LABOR FINANCIALS SECTION */}
        <section className="dashboard-grid mt-6 mb-6">
          {/* Outstanding Advance */}
          <div className="dashboard-card" style={{ borderColor: 'rgba(239, 68, 68, 0.5)' }}>
            <div className="dashboard-card-header">
              <div className="dashboard-card-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                <IndianRupee size={22} />
              </div>
              <div className="dashboard-card-label" style={{ color: '#fca5a5' }}>OUTSTANDING ADVANCE</div>
            </div>
            <div>
              <div className="dashboard-card-title">Total Advance Given</div>
              <div className="dashboard-card-value" style={{ color: '#ef4444' }}>
                {formatCurrency(totalAdvance)}
              </div>
            </div>
          </div>

          {/* Total Labor Payments */}
          <div className="dashboard-card" style={{ borderColor: 'rgba(59, 130, 246, 0.5)' }}>
            <div className="dashboard-card-header">
              <div className="dashboard-card-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                <Users size={22} />
              </div>
              <div className="dashboard-card-label" style={{ color: '#93c5fd' }}>LABOR PAYMENTS</div>
            </div>
            <div>
              <div className="dashboard-card-title">Total Paid to Labor</div>
              <div className="dashboard-card-value" style={{ color: '#3b82f6' }}>
                {formatCurrency(totalLaborPaid)}
              </div>
            </div>
          </div>
        </section>

        {/* BRICKS SUMMARY SECTION */}
        <section className="dashboard-bricks-card">
          <div className="dashboard-bricks-header">
            <div className="dashboard-bricks-title-block">
              <h2>Bricks Summary</h2>
              <p>
                Manufacturing, sales, and inventory overview for {currentYear}.
              </p>
            </div>
            <div className="dashboard-bricks-badge">
              <Package2
                size={14}
                style={{ marginRight: 6, verticalAlign: 'text-bottom' }}
              />
              BRICKS SUMMARY
            </div>
          </div>

          {/* Raw Bricks Produced Section */}
          <div className="dashboard-bricks-section">
            <div className="dashboard-bricks-section-header">
              <Package2 size={20} />
              <h3>Total Raw Bricks Produced</h3>
            </div>
            <div className="dashboard-bricks-main-stat">
              <div className="dashboard-bricks-stat-value-large">
                {totalRawBricks.toLocaleString('en-IN')}
              </div>
              <div className="dashboard-bricks-stat-note">
                Total raw bricks made by labors
              </div>
            </div>
          </div>

          {/* Total Manufactured Section */}
          <div className="dashboard-bricks-section">
            <div className="dashboard-bricks-section-header">
              <Factory size={20} />
              <h3>Total Bricks Manufactured ({currentYear})</h3>
            </div>
            <div className="dashboard-bricks-main-stat">
              <div className="dashboard-bricks-stat-value-large">
                {totalManufactured.toLocaleString('en-IN')}
              </div>
              <div className="dashboard-bricks-stat-note">
                Total bricks produced in current year
              </div>
            </div>

            {/* Breakdown by type */}
            <div className="dashboard-bricks-breakdown">
              {BRICK_TYPES.map((type) => (
                <div key={type} className="dashboard-bricks-breakdown-item">
                  <div className="dashboard-bricks-breakdown-label">
                    Type {type}
                  </div>
                  <div className="dashboard-bricks-breakdown-value">
                    {(manufacturedByType[type] ?? 0).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Sold Section */}
          <div className="dashboard-bricks-section">
            <div className="dashboard-bricks-section-header">
              <TrendingDown size={20} />
              <h3>Total Bricks Sold</h3>
            </div>
            <div className="dashboard-bricks-main-stat">
              <div className="dashboard-bricks-stat-value-large">
                {totalBricksSold.toLocaleString('en-IN')}
              </div>
              <div className="dashboard-bricks-stat-note">
                Total bricks sold across all sales
              </div>
            </div>

            {/* Breakdown by type */}
            <div className="dashboard-bricks-breakdown">
              {BRICK_TYPES.map((type) => (
                <div key={type} className="dashboard-bricks-breakdown-item">
                  <div className="dashboard-bricks-breakdown-label">
                    Type {type}
                  </div>
                  <div className="dashboard-bricks-breakdown-value">
                    {(soldByType[type] ?? 0).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Remaining Inventory Section */}
          <div className="dashboard-bricks-section">
            <div className="dashboard-bricks-section-header">
              <Package2 size={20} />
              <h3>Remaining Inventory</h3>
            </div>
            <div className="dashboard-bricks-main-stat">
              <div className="dashboard-bricks-stat-value-large">
                {(totalManufactured - totalBricksSold).toLocaleString('en-IN')}
              </div>
              <div className="dashboard-bricks-stat-note">
                Bricks available in stock
              </div>
            </div>

            {/* Breakdown by type */}
            <div className="dashboard-bricks-breakdown">
              {BRICK_TYPES.map((type) => (
                <div key={type} className="dashboard-bricks-breakdown-item">
                  <div className="dashboard-bricks-breakdown-label">
                    Type {type}
                  </div>
                  <div className="dashboard-bricks-breakdown-value">
                    {(remainingByType[type] ?? 0).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="dashboard-bricks-stats">
            <div className="dashboard-bricks-stat">
              <div className="dashboard-bricks-stat-label">
                AVG BRICKS PER SALE
              </div>
              <div className="dashboard-bricks-stat-value">
                {avgBricksPerSale.toLocaleString('en-IN')}
              </div>
              <div className="dashboard-bricks-stat-note">
                Average quantity per sale record
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}





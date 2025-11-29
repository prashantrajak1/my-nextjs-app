import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import { Users, DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';

export default async function Dashboard() {
  const totalLabors = await prisma.labor.count();

  const expenses = await prisma.expense.findMany();
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const sales = await prisma.sale.findMany();
  const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const receivedAmount = sales.reduce((sum, sale) => sum + sale.receivedAmount, 0);

  // Inventory Stats
  const brickStocks = await prisma.brickStock.findMany();
  const stockMap = brickStocks.reduce((acc, stock) => {
    acc[stock.type] = stock.quantity;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              SANJAY ITTA UDHYOG
            </span>
          </h1>
          <p className="text-xl text-gray-400 font-light tracking-wide">
            Premium Brick Manufacturing & Management System
          </p>
        </div>

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-up">
          {['No.1', 'No.2', 'No.3'].map((type) => (
            <div key={type} className="glass-card flex items-center justify-between p-6 border-l-4 border-blue-500">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wider">Brick {type}</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {(stockMap[type] || 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                <Package size={28} />
              </div>
            </div>
          ))}
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card hover:bg-white/5 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <span className="text-xs font-medium text-gray-500 bg-white/10 px-2 py-1 rounded-full">Active</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{totalLabors}</h3>
            <p className="text-sm text-gray-400">Total Labors</p>
          </div>

          <div className="glass-card hover:bg-white/5 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-red-500/20 text-red-400 group-hover:scale-110 transition-transform">
                <DollarSign size={24} />
              </div>
              <span className="text-xs font-medium text-gray-500 bg-white/10 px-2 py-1 rounded-full">Monthly</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">₹{totalExpenses.toLocaleString()}</h3>
            <p className="text-sm text-gray-400">Total Expenses</p>
          </div>

          <div className="glass-card hover:bg-white/5 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-green-500/20 text-green-400 group-hover:scale-110 transition-transform">
                <ShoppingCart size={24} />
              </div>
              <span className="text-xs font-medium text-gray-500 bg-white/10 px-2 py-1 rounded-full">Revenue</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">₹{totalSales.toLocaleString()}</h3>
            <p className="text-sm text-gray-400">Total Sales</p>
          </div>

          <div className="glass-card hover:bg-white/5 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <span className="text-xs font-medium text-gray-500 bg-white/10 px-2 py-1 rounded-full">Cash In</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">₹{receivedAmount.toLocaleString()}</h3>
            <p className="text-sm text-gray-400">Received Amount</p>
          </div>
        </div>
      </main>
    </div>
  );
}

import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import { Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

async function getStats() {
  const totalLabors = await prisma.labor.count();

  const expenses = await prisma.expense.aggregate({
    _sum: { amount: true }
  });
  const totalExpenses = expenses._sum.amount || 0;

  const sales = await prisma.sale.aggregate({
    _sum: { totalAmount: true, receivedAmount: true }
  });
  const totalSales = sales._sum.totalAmount || 0;
  const totalReceived = sales._sum.receivedAmount || 0;

  return { totalLabors, totalExpenses, totalSales, totalReceived };
}

export default async function Dashboard() {
  const stats = await getStats();

  return (
    <div className="container min-h-screen pb-10">
      <Navbar />

      <header className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Dashboard
        </h1>
        <p className="text-gray-400 mt-2">Welcome back, Admin</p>
      </header>

      <div className="grid-dashboard animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="glass-card">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
              <Users size={24} />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-300">
              Total
            </span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.totalLabors}</h3>
          <p className="text-gray-400 text-sm">Active Laborers</p>
        </div>

        <div className="glass-card">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-red-500/20 text-red-400">
              <DollarSign size={24} />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-500/10 text-red-300">
              Expenses
            </span>
          </div>
          <h3 className="text-3xl font-bold mb-1">₹{stats.totalExpenses.toLocaleString()}</h3>
          <p className="text-gray-400 text-sm">Total Expenses</p>
        </div>

        <div className="glass-card">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
              <ShoppingCart size={24} />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-300">
              Sales
            </span>
          </div>
          <h3 className="text-3xl font-bold mb-1">₹{stats.totalSales.toLocaleString()}</h3>
          <p className="text-gray-400 text-sm">Total Sales Value</p>
        </div>

        <div className="glass-card">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/10 text-purple-300">
              Revenue
            </span>
          </div>
          <h3 className="text-3xl font-bold mb-1">₹{stats.totalReceived.toLocaleString()}</h3>
          <p className="text-gray-400 text-sm">Total Received</p>
        </div>
      </div>
    </div>
  );
}

import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import { Users, DollarSign, ShoppingCart, TrendingUp, Building2 } from 'lucide-react';

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

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="min-h-screen pb-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Bold Branding */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block p-4 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 mb-6 shadow-2xl">
            <Building2 size={64} className="text-primary animate-pulse" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 drop-shadow-lg">
              SANJAY ITTA UDHYOG
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Premium Brick Manufacturing & Management System
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Labors"
            value={stats.totalLabors.toString()}
            icon={<Users size={24} className="text-blue-400" />}
            color="bg-blue-500/10 border-blue-500/20"
          />
          <StatCard
            title="Total Expenses"
            value={`₹${stats.totalExpenses.toLocaleString()}`}
            icon={<DollarSign size={24} className="text-red-400" />}
            color="bg-red-500/10 border-red-500/20"
          />
          <StatCard
            title="Total Sales"
            value={`₹${stats.totalSales.toLocaleString()}`}
            icon={<ShoppingCart size={24} className="text-green-400" />}
            color="bg-green-500/10 border-green-500/20"
          />
          <StatCard
            title="Received Amount"
            value={`₹${stats.totalReceived.toLocaleString()}`}
            icon={<TrendingUp size={24} className="text-yellow-400" />}
            color="bg-yellow-500/10 border-yellow-500/20"
          />
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
  return (
    <div className={`p-6 rounded-2xl backdrop-blur-md border ${color} hover:scale-105 transition-transform duration-300 shadow-xl`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 font-medium">{title}</h3>
        <div className="p-2 rounded-lg bg-white/5">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

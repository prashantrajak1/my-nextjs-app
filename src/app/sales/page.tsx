import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import { addSale } from '@/app/actions';
import { ShoppingCart, Calendar, Truck } from 'lucide-react';
import { format } from 'date-fns';

export default async function SalesPage() {
    const sortedSales = await prisma.sale.findMany({
        orderBy: { date: 'desc' }
    });

    return (
        <div className="container min-h-screen pb-10">
            <Navbar />

            <header className="mb-8 animate-fade-in">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Sales Management
                </h1>
                <p className="text-gray-400 mt-2">Record brick sales and payments.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Sale Form */}
                <div className="lg:col-span-1">
                    <div className="glass-card sticky top-24 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <ShoppingCart size={20} className="text-primary" />
                            Record New Sale
                        </h2>
                        <form action={addSale} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Vehicle Number</label>
                                <input name="vehicleNo" type="text" className="glass-input" placeholder="e.g., BA 1 PA 1234" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                                    <input name="quantity" type="number" className="glass-input" placeholder="0" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Rate (per brick)</label>
                                    <input name="rate" type="number" step="0.01" className="glass-input" placeholder="0.00" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Received Amount</label>
                                <input name="receivedAmount" type="number" step="0.01" className="glass-input" placeholder="0.00" required />
                            </div>
                            <button type="submit" className="glass-button w-full">
                                Record Sale
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sales List */}
                <div className="lg:col-span-2 space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-xl font-bold mb-4">Sales Records</h2>
                    {sortedSales.length === 0 ? (
                        <div className="glass-panel p-8 text-center text-gray-400">
                            No sales recorded yet.
                        </div>
                    ) : (
                        <div className="glass-table-container">
                            <table className="glass-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Vehicle No</th>
                                        <th>Details</th>
                                        <th>Total</th>
                                        <th>Received</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedSales.map((sale) => {
                                        const due = sale.totalAmount - sale.receivedAmount;
                                        return (
                                            <tr key={sale.id}>
                                                <td className="text-gray-400 text-sm">
                                                    {format(new Date(sale.date), 'PPP')}
                                                </td>
                                                <td className="font-medium text-white">
                                                    <div className="flex items-center gap-2">
                                                        <Truck size={14} className="text-primary" />
                                                        {sale.vehicleNo}
                                                    </div>
                                                </td>
                                                <td className="text-sm text-gray-300">
                                                    {sale.quantity} @ ₹{sale.rate}
                                                </td>
                                                <td className="font-bold text-white">₹{sale.totalAmount.toLocaleString()}</td>
                                                <td className="text-green-400">₹{sale.receivedAmount.toLocaleString()}</td>
                                                <td>
                                                    {due > 0 ? (
                                                        <span className="text-red-400 text-xs font-bold bg-red-500/10 px-2 py-1 rounded">
                                                            Due: ₹{due.toLocaleString()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded">
                                                            Paid
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

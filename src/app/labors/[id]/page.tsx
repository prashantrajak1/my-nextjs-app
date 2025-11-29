import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import { updateLaborStats, addLaborPayment } from '@/app/actions';
import { User, MapPin, DollarSign, Hammer, Calendar, History, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function LaborDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const labor = await prisma.labor.findUnique({
        where: { id },
        include: {
            payments: {
                orderBy: { date: 'desc' }
            }
        }
    });

    if (!labor) {
        return <div>Labor not found</div>;
    }

    return (
        <div className="min-h-screen pb-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <Link href="/labors" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to List
                </Link>

                {/* Header */}
                <div className="glass-card mb-8 animate-fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
                                {labor.name}
                            </h1>
                            <div className="flex items-center text-gray-400">
                                <MapPin size={16} className="mr-2" />
                                {labor.address}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-400">Current Due</p>
                            <p className="text-4xl font-bold text-red-400">₹{labor.due.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Stats & Update Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="glass-card flex items-center gap-4">
                                <div className="p-3 rounded-full bg-orange-500/20 text-orange-400">
                                    <Hammer size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Bricks Made</p>
                                    <p className="text-2xl font-bold">{labor.bricksMade.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="glass-card flex items-center gap-4">
                                <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Days Worked</p>
                                    <p className="text-2xl font-bold">{labor.daysWorked}</p>
                                </div>
                            </div>
                        </div>

                        {/* Update Stats Form */}
                        <div className="glass-card">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Hammer size={20} className="text-primary" />
                                Update Work Stats
                            </h2>
                            <form action={updateLaborStats} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="hidden" name="id" value={labor.id} />
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Add Bricks Made</label>
                                    <input name="bricksMade" type="number" className="glass-input" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Add Days Worked</label>
                                    <input name="daysWorked" type="number" className="glass-input" placeholder="0" />
                                </div>
                                <div className="md:col-span-2">
                                    <button type="submit" className="glass-button w-full">
                                        Update Stats
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Payment History */}
                        <div className="glass-card">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <History size={20} className="text-primary" />
                                Payment History
                            </h2>
                            {labor.payments.length === 0 ? (
                                <p className="text-gray-400 text-center py-4">No payments recorded yet.</p>
                            ) : (
                                <div className="glass-table-container">
                                    <table className="glass-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {labor.payments.map((payment) => (
                                                <tr key={payment.id}>
                                                    <td className="text-gray-400">{format(new Date(payment.date), 'PPP')}</td>
                                                    <td className="font-bold text-green-400">₹{payment.amount.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Add Payment Form */}
                    <div className="lg:col-span-1">
                        <div className="glass-card sticky top-24">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <DollarSign size={20} className="text-green-400" />
                                Record Payment
                            </h2>
                            <form action={addLaborPayment} className="space-y-4">
                                <input type="hidden" name="laborId" value={labor.id} />
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Amount Paid</label>
                                    <input name="amount" type="number" step="0.01" className="glass-input" placeholder="0.00" required />
                                </div>
                                <button type="submit" className="glass-button w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/50">
                                    Record Payment
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

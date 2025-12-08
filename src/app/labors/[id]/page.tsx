import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import { addLaborDailyRecord, addLaborPayment } from '@/app/actions';
import { ArrowLeft, Plus, Calendar, Wallet, MapPin, DollarSign, IndianRupee, Package2 } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import DailyWorkList from '@/components/DailyWorkList';
import AdvanceList from '@/components/AdvanceList';

export const dynamic = 'force-dynamic';

export default async function LaborDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const labor = await prisma.labor.findUnique({
        where: { id },
        include: {
            dailyRecords: {
                orderBy: { date: 'desc' }
            },
            payments: {
                orderBy: { date: 'desc' }
            }
        }
    });

    if (!labor) {
        redirect('/labors');
    }

    // Calculate running balances
    // 1. Flatten all records
    const flatRecords = [
        ...labor.dailyRecords.map(r => ({ ...r, uniqueId: r.id, type: 'daily', amount: r.payment, workValue: r.bricksMade * r.brickRate, dateObj: new Date(r.date) })),
        ...labor.payments.map(p => ({ ...p, uniqueId: p.id, type: 'payment', amount: p.amount, workValue: 0, dateObj: new Date(p.date) }))
    ].sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime()); // Sort Ascending

    // 2. Calculate Totals from records to find Opening Balance
    const totalRecordPayments = flatRecords.reduce((sum, r) => sum + r.amount, 0);
    const totalRecordWork = flatRecords.reduce((sum, r) => sum + r.workValue, 0);
    const calculatedDue = totalRecordPayments - totalRecordWork;
    const openingBalance = labor.due - calculatedDue; // Discrepancy is the initial balance

    // 3. Apply Running Balance
    let currentBalance = openingBalance;
    const recordsWithBalance = flatRecords.map(record => {
        // Balance increases with payment (Advance), decreases with work (Recovery)
        // Net Change = Payment - Work
        const netChange = record.amount - record.workValue;
        currentBalance += netChange;
        return { ...record, currentBalance };
    });

    // 4. Split and Sort Descending for Display
    const dailyRecordsWithBalance = recordsWithBalance
        .filter(r => r.type === 'daily')
        .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

    const paymentsWithBalance = recordsWithBalance
        .filter(r => r.type === 'payment')
        .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

    // Calculate simple stats for display
    const totalAdvancePaid = totalRecordPayments;

    return (
        <div className="dashboard">
            <Navbar />
            <main className="dashboard-inner">
                <div className="mb-8 animate-fade-in">
                    <Link href="/labors" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
                        <ArrowLeft size={20} />
                        Back to Labor List
                    </Link>

                    <div className="flex flex-col gap-8">
                        {/* Name and Address Header */}
                        <div>
                            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-accent drop-shadow-sm">
                                {labor.name}
                            </h1>
                            <div className="flex items-center gap-2 mt-3">
                                <div className="p-1.5 bg-green-500/10 rounded-full">
                                    <MapPin size={20} className="text-green-500" />
                                </div>
                                <p className="text-green-500 font-bold text-xl tracking-wide">
                                    {labor.address}
                                </p>
                            </div>
                        </div>

                        {/* Horizontal Stats Bar */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Rate Card */}
                            <div className="glass-card p-4 border-l-4 border-l-blue-500 relative overflow-hidden group hover:bg-white/5 transition-all">
                                <div className="absolute right-2 top-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <DollarSign size={40} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Rate Per Brick</span>
                                    <span className="text-3xl font-bold text-white">₹{labor.brickRate}</span>
                                </div>
                            </div>

                            {/* Total Bricks Card */}
                            <div className="glass-card p-4 border-l-4 border-l-purple-500 relative overflow-hidden group hover:bg-white/5 transition-all">
                                <div className="absolute right-2 top-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Package2 size={40} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Total Bricks</span>
                                    <span className="text-3xl font-bold text-white">{labor.bricksMade.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Total Paid Card */}
                            <div className="glass-card p-4 border-l-4 border-l-yellow-500 relative overflow-hidden group hover:bg-white/5 transition-all">
                                <div className="absolute right-2 top-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <IndianRupee size={40} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Total Paid</span>
                                    <span className="text-3xl font-bold text-yellow-400">₹{totalAdvancePaid.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Balance Card */}
                            <div className={`glass-card p-4 border-l-4 ${labor.due >= 0 ? 'border-l-green-500' : 'border-l-red-500'} relative overflow-hidden group hover:bg-white/5 transition-all`}>
                                <div className="absolute right-2 top-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Wallet size={40} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-bold uppercase tracking-widest ${labor.due >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {labor.due >= 0 ? 'Current Advance' : 'Net Payable'}
                                    </span>
                                    <span className={`text-3xl font-bold ${labor.due > 0 ? 'text-green-500' : 'text-red-500'}`} style={{ color: labor.due > 0 ? '#22c55e' : '#ef4444' }}>
                                        ₹{Math.abs(labor.due).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Add Daily Work Form */}
                        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Calendar size={20} className="text-primary" />
                                Add Daily Work
                            </h2>
                            <form action={addLaborDailyRecord} className="space-y-4">
                                <input type="hidden" name="laborId" value={labor.id} />
                                <input type="hidden" name="brickRate" value={labor.brickRate} />

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Bricks Made</label>
                                    <input name="bricksMade" type="number" className="glass-input" placeholder="0" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Payment Given (₹)</label>
                                    <input name="payment" type="number" step="0.01" className="glass-input" placeholder="0.00" defaultValue="0" />
                                </div>

                                <button type="submit" className="glass-button w-full flex justify-center items-center gap-2">
                                    <Plus size={18} />
                                    Add Work
                                </button>
                            </form>
                        </div>

                        {/* Add Advance Form */}
                        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Wallet size={20} className="text-yellow-400" />
                                Given Advance
                            </h2>
                            <form action={addLaborPayment} className="space-y-4">
                                <input type="hidden" name="laborId" value={labor.id} />

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Amount (₹)</label>
                                    <input name="amount" type="number" step="0.01" className="glass-input" placeholder="0.00" required />
                                </div>

                                <button type="submit" className="glass-button bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 w-full flex justify-center items-center gap-2">
                                    <Plus size={18} />
                                    Add Advance
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Lists */}
                    <div className="lg:col-span-2 space-y-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>

                        {/* Advances List */}
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-yellow-400">Advance History</h2>
                            <AdvanceList records={paymentsWithBalance} laborId={labor.id} />
                        </div>

                        {/* Daily Work List */}
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-primary">Daily Work Records</h2>
                            <DailyWorkList records={dailyRecordsWithBalance} laborId={labor.id} />
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

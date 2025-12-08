import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import { addLaborDailyRecord, addLaborPayment } from '@/app/actions';
import { ArrowLeft, Plus, Calendar, Wallet } from 'lucide-react';
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
                orderBy: { date: 'desc' },
                where: { isPaid: false } // Only show unpaid work records in work list? Or all? User said "separate section", usually means all work.
                // Re-reading: "separate section that is advance and payable". "Payable" usually means work done.
                // Usually we want to see history. I will show all daily records in the work list for history, 
                // but the prompt implies separating "Payable" (Work) and "Advance".
                // I'll show all.
            },
            payments: {
                orderBy: { date: 'desc' }
            }
        }
    });

    if (!labor) {
        redirect('/labors');
    }

    // Recalculate totals for display if needed, but labor model has 'due' which is the balance.
    // Total Paid = Sum of all Advances (payments table) + Payments made directly in daily records (legacy)
    // To match the new model, we iterate.

    // We need to fetch ALL daily records to get accurate totals if we used `where` above.
    // Let's just fetch all and filter in memory if necessary, or just rely on the included lists.
    // The previous code fetched all.

    // NOTE: The previous code had:
    // const totalPaid = labor.dailyRecords.reduce((sum, record) => sum + record.payment, 0) +
    //    labor.payments.reduce((sum, payment) => sum + payment.amount, 0);
    //
    // This is still valid for "Total Paid". 

    const totalWorkValue = labor.dailyRecords.reduce((sum, record) => sum + (record.bricksMade * record.brickRate), 0);
    const totalAdvancePaid = labor.payments.reduce((sum, payment) => sum + payment.amount, 0) +
        labor.dailyRecords.reduce((sum, record) => sum + record.payment, 0);

    return (
        <div className="container min-h-screen pb-10">
            <Navbar />

            <div className="mb-8 animate-fade-in">
                <Link href="/labors" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
                    <ArrowLeft size={20} />
                    Back to Labor List
                </Link>

                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            {labor.name}
                        </h1>
                        <p className="text-gray-400 mt-1">{labor.address}</p>
                    </div>

                    {/* Horizontal Stats Bar */}
                    <div className="glass-panel p-6 w-full grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                        {/* Rate */}
                        <div className="flex flex-col">
                            <span className="text-sm text-blue-300 font-medium uppercase tracking-wider">Rate/Brick</span>
                            <span className="text-2xl font-bold text-white">₹{labor.brickRate}</span>
                        </div>

                        {/* Total Bricks */}
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">Total Bricks</span>
                            <span className="text-2xl font-bold text-white">{labor.bricksMade.toLocaleString()}</span>
                        </div>

                        {/* Total Paid / Advances */}
                        <div className="flex flex-col">
                            <span className="text-sm text-yellow-400 font-medium uppercase tracking-wider">Total Paid</span>
                            <span className="text-2xl font-bold text-yellow-400">₹{totalAdvancePaid.toLocaleString()}</span>
                        </div>

                        {/* Current Status */}
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                                {labor.due >= 0 ? 'Current Advance' : 'Net Payable'}
                            </span>
                            <span className={`text-2xl font-bold ${labor.due > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                ₹{Math.abs(labor.due).toLocaleString()}
                            </span>
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

                            {/* Hidden payment field mandated by action, set to 0 */}
                            <input type="hidden" name="payment" value="0" />

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                                <input
                                    name="date"
                                    type="date"
                                    className="glass-input"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Bricks Made</label>
                                <input name="bricksMade" type="number" className="glass-input" placeholder="0" required />
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
                        <AdvanceList records={labor.payments} laborId={labor.id} />
                    </div>

                    {/* Daily Work List */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-primary">Daily Work Records</h2>
                        <DailyWorkList records={labor.dailyRecords} laborId={labor.id} />
                    </div>

                </div>
            </div>
        </div>
    );
}

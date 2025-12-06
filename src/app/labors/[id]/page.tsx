import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import { addLaborDailyRecord, deleteLaborDailyRecord, toggleLaborRecordPaid } from '@/app/actions';
import { ArrowLeft, Plus, Trash2, Calendar, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import DailyRecordList from './DailyRecordList'; // Client component for interactivity

export const dynamic = 'force-dynamic';

export default async function LaborDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const labor = await prisma.labor.findUnique({
        where: { id },
        include: {
            dailyRecords: {
                orderBy: { date: 'desc' }
            }
        }
    });

    if (!labor) {
        redirect('/labors');
    }

    const totalPaid = labor.dailyRecords.reduce((sum, record) => sum + record.payment, 0);

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

                        {/* Total Paid */}
                        <div className="flex flex-col">
                            <span className="text-sm text-yellow-400 font-medium uppercase tracking-wider">Total Paid</span>
                            <span className="text-2xl font-bold text-yellow-400">₹{totalPaid.toLocaleString()}</span>
                        </div>

                        {/* Current Status */}
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                                {labor.due >= 0 ? 'Current Advance' : 'Payable'}
                            </span>
                            <span className={`text-2xl font-bold ${labor.due > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                ₹{Math.abs(labor.due).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Daily Record Form */}
                <div className="lg:col-span-1">
                    <div className="glass-card sticky top-24 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-primary" />
                            Add Daily Entry
                        </h2>
                        <form action={addLaborDailyRecord} className="space-y-4">
                            <input type="hidden" name="laborId" value={labor.id} />
                            <input type="hidden" name="brickRate" value={labor.brickRate} />

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
                                <input name="bricksMade" type="number" className="glass-input" placeholder="0" defaultValue="0" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Payment Given (₹)</label>
                                <input name="payment" type="number" step="0.01" className="glass-input" placeholder="0.00" defaultValue="0" />
                            </div>

                            <button type="submit" className="glass-button w-full flex justify-center items-center gap-2">
                                <Plus size={18} />
                                Add Record
                            </button>
                        </form>
                    </div>
                </div>

                {/* Daily Records List */}
                <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-xl font-bold mb-4">Daily Records</h2>
                    <DailyRecordList records={labor.dailyRecords} laborId={labor.id} />
                </div>
            </div>
        </div>
    );
}

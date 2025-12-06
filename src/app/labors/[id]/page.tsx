import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import { addLaborDailyRecord, deleteLaborDailyRecord, toggleLaborRecordPaid } from '@/app/actions';
import { ArrowLeft, Plus, Trash2, Calendar, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import DailyRecordList from './DailyRecordList'; // Client component for interactivity

export const dynamic = 'force-dynamic';

export default async function LaborDetailsPage({ params }: { params: { id: string } }) {
    const labor = await prisma.labor.findUnique({
        where: { id: params.id },
        include: {
            dailyRecords: {
                orderBy: { date: 'desc' }
            }
        }
    });

    if (!labor) {
        redirect('/labors');
    }

    return (
        <div className="container min-h-screen pb-10">
            <Navbar />

            <div className="mb-8 animate-fade-in">
                <Link href="/labors" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
                    <ArrowLeft size={20} />
                    Back to Labor List
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            {labor.name}
                        </h1>
                        <p className="text-gray-400 mt-2 flex items-center gap-2">
                            <span className="bg-white/10 px-2 py-1 rounded text-sm">{labor.address}</span>
                            <span className="bg-white/10 px-2 py-1 rounded text-sm">Rate: ₹{labor.brickRate}</span>
                        </p>
                    </div>

                    <div className="glass-panel p-4 flex gap-8">
                        <div>
                            <div className="text-sm text-gray-400">Total Bricks</div>
                            <div className="text-2xl font-bold text-white">{labor.bricksMade.toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Current Due</div>
                            <div className={`text-2xl font-bold ${labor.due > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                ₹{labor.due.toLocaleString()}
                            </div>
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

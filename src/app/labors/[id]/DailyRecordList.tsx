'use client';

import { toggleLaborRecordPaid, deleteLaborDailyRecord, deleteLaborPayment } from '@/app/actions';
import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';

export default function DailyRecordList({ records, laborId }: { records: any[], laborId: string }) {
    const [isPending, startTransition] = useTransition();

    return (
        <>
            {records.length === 0 ? (
                <div className="glass-panel p-8 text-center text-gray-400">
                    No daily records found. Add one to get started.
                </div>
            ) : (
                <div className="glass-table-container">
                    <table className="glass-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Bricks</th>
                                <th>Work Value</th>
                                <th>Payment</th>
                                <th>Balance</th>
                                <th>Paid?</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record) => {
                                const isPayment = record.type === 'payment';
                                const workValue = record.bricksMade * record.brickRate;
                                const balance = isPayment ? -record.payment : workValue - record.payment;

                                return (
                                    <tr key={record.id}>
                                        <td className="text-gray-300">
                                            {new Date(record.date).toLocaleDateString()}
                                        </td>
                                        <td className="text-white font-medium">
                                            {isPayment ? (
                                                <span className="text-yellow-400 font-bold">Advance Payment</span>
                                            ) : (
                                                record.bricksMade.toLocaleString()
                                            )}
                                        </td>
                                        <td className="text-green-400">
                                            {isPayment ? '-' : `₹${workValue.toLocaleString()}`}
                                        </td>
                                        <td className="text-yellow-400">₹{record.payment.toLocaleString()}</td>
                                        <td className={`font-bold ${balance > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                                            {balance > 0 ? `Due: ₹${balance}` : `Adv: ₹${Math.abs(balance)}`}
                                        </td>
                                        <td>
                                            {isPayment ? (
                                                <span className="text-green-400 text-xs">Paid</span>
                                            ) : (
                                                <input
                                                    type="checkbox"
                                                    checked={record.isPaid}
                                                    onChange={(e) => startTransition(() => toggleLaborRecordPaid(record.id, e.target.checked))}
                                                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
                                                />
                                            )}
                                        </td>
                                        <td>
                                            <form action={isPayment ? deleteLaborPayment : deleteLaborDailyRecord}>
                                                <input type="hidden" name="id" value={record.id} />
                                                <input type="hidden" name="laborId" value={laborId} />
                                                <button type="submit" className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

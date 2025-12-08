'use client';

import { deleteLaborDailyRecord } from '@/app/actions';
import { Trash2 } from 'lucide-react';

export default function DailyWorkList({ records, laborId }: { records: any[], laborId: string }) {
    if (records.length === 0) {
        return (
            <div className="glass-panel p-8 text-center text-gray-400">
                No work records found.
            </div>
        );
    }

    return (
        <div className="glass-table-container">
            <table className="glass-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Bricks</th>
                        <th>Work Value</th>
                        <th>Payment</th>
                        <th>Payable</th>
                        <th>Balance</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record) => {
                        const workValue = record.bricksMade * record.brickRate;
                        const payable = workValue - record.payment;

                        return (
                            <tr key={record.id}>
                                <td className="text-gray-300">
                                    {new Date(record.date).toLocaleDateString()}
                                </td>
                                <td className="text-white font-medium">
                                    {record.bricksMade.toLocaleString()}
                                </td>
                                <td className="text-green-400">
                                    ₹{workValue.toLocaleString()}
                                </td>
                                <td className="text-yellow-400">
                                    ₹{record.payment.toLocaleString()}
                                </td>
                                <td className="text-blue-400 font-bold">
                                    ₹{payable.toLocaleString()}
                                </td>
                                <td className={`font-bold ${record.currentBalance > 0 ? 'text-green-400' : 'text-red-400'}`} style={{ color: record.currentBalance > 0 ? '#4ade80' : '#f87171' }}>
                                    {record.currentBalance >= 0 ? `Adv: ₹${record.currentBalance.toLocaleString()}` : `Due: ₹${Math.abs(record.currentBalance).toLocaleString()}`}
                                </td>
                                <td>
                                    <form action={deleteLaborDailyRecord}>
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
    );
}

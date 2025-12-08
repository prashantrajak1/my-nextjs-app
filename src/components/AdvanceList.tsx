'use client';

import { deleteLaborPayment } from '@/app/actions';
import { Trash2 } from 'lucide-react';

export default function AdvanceList({ records, laborId }: { records: any[], laborId: string }) {
    if (records.length === 0) {
        return (
            <div className="glass-panel p-8 text-center text-gray-400">
                No advance records found.
            </div>
        );
    }

    return (
        <div className="glass-table-container">
            <table className="glass-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record) => (
                        <tr key={record.id}>
                            <td className="text-gray-300">
                                {new Date(record.date).toLocaleDateString()}
                            </td>
                            <td className="text-yellow-400 font-bold">
                                ₹{record.amount.toLocaleString()}
                            </td>
                            <td>
                                <form action={deleteLaborPayment}>
                                    <input type="hidden" name="id" value={record.id} />
                                    <input type="hidden" name="laborId" value={laborId} />
                                    <button type="submit" className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </form>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

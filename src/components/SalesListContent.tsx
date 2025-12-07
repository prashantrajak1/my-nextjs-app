'use client';

import Navbar from '@/components/Navbar';
import { addSale, deleteSale } from '@/app/actions';
import { ShoppingCart, Truck, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import { useTranslation } from '@/context/TranslationContext';
import { Sale } from '@prisma/client';

interface SalesListContentProps {
    sales: Sale[];
}

export default function SalesListContent({ sales }: SalesListContentProps) {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen pb-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <Navbar />

            <header className="mb-8 animate-fade-in container mx-auto px-4 pt-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            {t('sales_list')}
                        </h1>
                        <p className="text-gray-400 mt-2">Record brick sales and payments.</p>
                    </div>
                    <a href="/api/sales/export" className="glass-button flex items-center gap-2 bg-green-500/20 text-green-400 hover:bg-green-500/30">
                        <Download size={16} />
                        {t('download_csv')}
                    </a>
                </div>
            </header>

            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Sale Form */}
                <div className="lg:col-span-1">
                    <div className="glass-card sticky top-24 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <ShoppingCart size={20} className="text-primary" />
                            {t('add_sale')}
                        </h2>
                        <form action={addSale} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('vehicle_no')}</label>
                                <input name="vehicleNo" type="text" className="glass-input" placeholder="e.g., BA 1 PA 1234" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('brick_type')}</label>
                                <select name="brickType" className="glass-input bg-gray-800">
                                    <option value="No.1">Brick No.1</option>
                                    <option value="No.2">Brick No.2</option>
                                    <option value="No.3">Brick No.3</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('quantity')}</label>
                                    <input name="quantity" type="number" className="glass-input" placeholder="0" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('rate')} (per brick)</label>
                                    <input name="rate" type="number" step="0.01" className="glass-input" placeholder="0.00" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('received_amount')}</label>
                                <input name="receivedAmount" type="number" step="0.01" className="glass-input" placeholder="0.00" required />
                            </div>
                            <button type="submit" className="glass-button w-full">
                                {t('add_new')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sales List */}
                <div className="lg:col-span-2 space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-xl font-bold mb-4">{t('sales_list')}</h2>
                    {sales.length === 0 ? (
                        <div className="glass-panel p-8 text-center text-gray-400">
                            No sales recorded yet.
                        </div>
                    ) : (
                        <div className="glass-table-container">
                            <table className="glass-table">
                                <thead>
                                    <tr>
                                        <th>{t('date')}</th>
                                        <th>{t('vehicle_no')}</th>
                                        <th>{t('brick_type')}</th>
                                        <th>Details</th>
                                        <th>{t('total_amount')}</th>
                                        <th>{t('received_amount')}</th>
                                        <th>{t('bill')}</th>
                                        <th>{t('status')}</th>
                                        <th>{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.map((sale) => {
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
                                                <td className="text-sm text-gray-300">{sale.brickType}</td>
                                                <td className="text-sm text-gray-300">
                                                    {sale.quantity} @ ₹{sale.rate}
                                                </td>
                                                <td className="font-bold text-white">₹{sale.totalAmount.toLocaleString()}</td>
                                                <td className="text-green-400">₹{sale.receivedAmount.toLocaleString()}</td>
                                                <td>
                                                    {sale.billPath ? (
                                                        <a href={sale.billPath} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                                            <FileText size={16} />
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-600">-</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {due > 0 ? (
                                                        <span className="text-red-400 text-xs font-bold bg-red-500/10 px-2 py-1 rounded">
                                                            {t('due')}: ₹{due.toLocaleString()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded">
                                                            {t('paid')}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <Link href={`/sales/${sale.id}/edit`}>
                                                            <button className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded hover:bg-blue-500/30 transition-colors font-medium">
                                                                {t('edit')}
                                                            </button>
                                                        </Link>
                                                        <DeleteButton id={sale.id} action={deleteSale} label={t('delete')} className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500/30 transition-colors font-medium" />
                                                    </div>
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

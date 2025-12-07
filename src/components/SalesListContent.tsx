'use client';

import Navbar from '@/components/Navbar';
import { addSale, deleteSale } from '@/app/actions';
import { ShoppingCart, Truck, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import { useTranslation } from '@/context/TranslationContext';
import { Sale } from '@prisma/client';
import { useState, useMemo, useEffect } from 'react';

interface SalesListContentProps {
    sales: Sale[];
}

export default function SalesListContent({ sales }: SalesListContentProps) {
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [expandedDates, setExpandedDates] = useState<string[]>([]);

    // Filter sales based on date range
    const filteredSales = useMemo(() => {
        return sales.filter(sale => {
            const saleDate = new Date(sale.date);
            saleDate.setHours(0, 0, 0, 0);

            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                if (saleDate < start) return false;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(0, 0, 0, 0);
                if (saleDate > end) return false;
            }
            return true;
        });
    }, [sales, startDate, endDate]);

    // Group sales by date
    const groupedSales = useMemo(() => {
        const groups: { [key: string]: Sale[] } = {};
        filteredSales.forEach(sale => {
            const dateKey = format(new Date(sale.date), 'yyyy-MM-dd');
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(sale);
        });
        return groups;
    }, [filteredSales]);

    // Sort dates descending
    const sortedDates = Object.keys(groupedSales).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Toggle accordion
    const toggleDate = (date: string) => {
        setExpandedDates(prev =>
            prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
        );
    };

    // Initialize with first date expanded
    useEffect(() => {
        if (sortedDates.length > 0 && expandedDates.length === 0) {
            setExpandedDates([sortedDates[0]]);
        }
    }, [sortedDates.length]);

    const downloadUrl = `/api/sales/export?startDate=${startDate}&endDate=${endDate}`;

    return (
        <div className="min-h-screen pb-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <Navbar />

            <header className="mb-8 animate-fade-in container mx-auto px-4 pt-8">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            {t('sales_list')}
                        </h1>
                        <p className="text-gray-400 mt-2">Record brick sales and payments.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full xl:w-auto">
                        <div className="flex flex-wrap gap-2 items-center bg-white/5 p-2 rounded-lg border border-white/10">
                            <div className="flex items-center gap-2">
                                <label className="text-xs text-gray-400 ml-1">From</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="bg-transparent border-none text-white text-sm focus:ring-0 p-1 w-32"
                                />
                            </div>
                            <span className="text-gray-500">-</span>
                            <div className="flex items-center gap-2">
                                <label className="text-xs text-gray-400 ml-1">To</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-transparent border-none text-white text-sm focus:ring-0 p-1 w-32"
                                />
                            </div>
                        </div>

                        <a href={downloadUrl} className="glass-button flex items-center gap-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 text-xs px-4 py-2 h-auto whitespace-nowrap ml-auto sm:ml-0">
                            <Download size={14} />
                            {t('download_csv')}
                        </a>
                    </div>
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
                    {sortedDates.length === 0 ? (
                        <div className="glass-panel p-8 text-center text-gray-400">
                            No sales found for the selected period.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sortedDates.map((date) => {
                                const isExpanded = expandedDates.includes(date);
                                const daySales = groupedSales[date];
                                const totalAmount = daySales.reduce((sum, s) => sum + s.totalAmount, 0);

                                return (
                                    <div key={date} className="glass-panel overflow-hidden border border-white/5">
                                        <button
                                            onClick={() => toggleDate(date)}
                                            className="w-full flex justify-between items-center p-4 bg-white/5 hover:bg-white/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                                                    ▶
                                                </div>
                                                <span className="font-bold text-lg">
                                                    {format(new Date(date), 'PPP')}
                                                </span>
                                                <span className="text-sm text-gray-400">
                                                    ({daySales.length} records)
                                                </span>
                                            </div>
                                            <div className="font-bold text-green-400">
                                                Total: ₹{totalAmount.toLocaleString()}
                                            </div>
                                        </button>

                                        {isExpanded && (
                                            <div className="p-4 animate-fade-in">
                                                <div className="glass-table-container">
                                                    <table className="glass-table">
                                                        <thead>
                                                            <tr>
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
                                                            {daySales.map((sale) => {
                                                                const due = sale.totalAmount - sale.receivedAmount;
                                                                return (
                                                                    <tr key={sale.id}>
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
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

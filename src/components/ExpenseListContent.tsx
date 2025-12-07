'use client';

import Navbar from '@/components/Navbar';
import { addExpense, deleteExpense } from '@/app/actions';
import { PlusCircle, Download } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import { useTranslation } from '@/context/TranslationContext';
import { Expense } from '@prisma/client';
import { useState, useMemo, useEffect } from 'react';

interface ExpenseListContentProps {
    expenses: Expense[];
}

export default function ExpenseListContent({ expenses }: ExpenseListContentProps) {
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [expandedDates, setExpandedDates] = useState<string[]>([]);

    // Filter expenses based on date range
    const filteredExpenses = useMemo(() => {
        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            expenseDate.setHours(0, 0, 0, 0);

            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                if (expenseDate < start) return false;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(0, 0, 0, 0);
                if (expenseDate > end) return false;
            }
            return true;
        });
    }, [expenses, startDate, endDate]);

    // Group expenses by date
    const groupedExpenses = useMemo(() => {
        const groups: { [key: string]: Expense[] } = {};
        filteredExpenses.forEach(expense => {
            const dateKey = format(new Date(expense.date), 'yyyy-MM-dd');
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(expense);
        });
        return groups;
    }, [filteredExpenses]);

    // Sort dates descending
    const sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

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
    }, [sortedDates.length]); // Only run when dates change (e.g. initial load)

    const downloadUrl = `/api/expenses/export?startDate=${startDate}&endDate=${endDate}`;

    return (
        <div className="min-h-screen pb-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <Navbar />

            <header className="mb-8 animate-fade-in container mx-auto px-4 pt-8">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            {t('expense_list')}
                        </h1>
                        <p className="text-gray-400 mt-2">Track daily manufacturing expenses.</p>
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
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Expense Form */}
                <div className="lg:col-span-1">
                    <div className="glass-card sticky top-24 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <PlusCircle size={20} className="text-primary" />
                            {t('add_expense')}
                        </h2>
                        <form action={addExpense} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('description')}</label>
                                <input name="description" type="text" className="glass-input" placeholder="e.g., Coal purchase" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('amount')}</label>
                                <input name="amount" type="number" step="0.01" className="glass-input" placeholder="0.00" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('category')}</label>
                                <select name="category" className="glass-input bg-gray-800" required>
                                    <option value="Raw Material">Raw Material</option>
                                    <option value="Fuel">Fuel</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Labor Payment">Labor Payment</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <button type="submit" className="glass-button w-full">
                                {t('save')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Expense List */}
                <div className="lg:col-span-2 space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{t('expense_list')}</h2>
                        <a href={downloadUrl} className="glass-button flex items-center gap-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 text-xs px-4 py-2 h-auto whitespace-nowrap">
                            <Download size={14} />
                            {t('download_csv')}
                        </a>
                    </div>
                    {sortedDates.length === 0 ? (
                        <div className="glass-panel p-8 text-center text-gray-400">
                            No expenses found for the selected period.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sortedDates.map((date) => {
                                const isExpanded = expandedDates.includes(date);
                                const dayExpenses = groupedExpenses[date];
                                const totalAmount = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

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
                                                    ({dayExpenses.length} records)
                                                </span>
                                            </div>
                                            <div className="font-bold text-red-400">
                                                Total: ₹{totalAmount.toLocaleString()}
                                            </div>
                                        </button>

                                        {isExpanded && (
                                            <div className="p-4 animate-fade-in">
                                                <div className="glass-table-container">
                                                    <table className="glass-table">
                                                        <thead>
                                                            <tr>
                                                                <th>{t('description')}</th>
                                                                <th>{t('category')}</th>
                                                                <th>{t('amount')}</th>
                                                                <th>{t('actions')}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {dayExpenses.map((expense) => (
                                                                <tr key={expense.id}>
                                                                    <td className="font-medium text-white">{expense.description}</td>
                                                                    <td>
                                                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/10 text-gray-300">
                                                                            {expense.category}
                                                                        </span>
                                                                    </td>
                                                                    <td className="font-bold text-red-400">₹{expense.amount.toLocaleString()}</td>
                                                                    <td>
                                                                        <div className="flex items-center gap-2">
                                                                            <Link href={`/expenses/${expense.id}/edit`}>
                                                                                <button className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded hover:bg-blue-500/30 transition-colors font-medium">
                                                                                    {t('edit')}
                                                                                </button>
                                                                            </Link>
                                                                            <DeleteButton id={expense.id} action={deleteExpense} label={t('delete')} className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500/30 transition-colors font-medium" />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
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

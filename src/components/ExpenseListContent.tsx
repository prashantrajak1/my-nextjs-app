'use client';

import Navbar from '@/components/Navbar';
import { addExpense, deleteExpense } from '@/app/actions';
import { PlusCircle, Download } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import { useTranslation } from '@/context/TranslationContext';
import { Expense } from '@prisma/client';

interface ExpenseListContentProps {
    expenses: Expense[];
}

export default function ExpenseListContent({ expenses }: ExpenseListContentProps) {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen pb-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <Navbar />

            <header className="mb-8 animate-fade-in container mx-auto px-4 pt-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            {t('expense_list')}
                        </h1>
                        <p className="text-gray-400 mt-2">Track daily manufacturing expenses.</p>
                    </div>
                    <a href="/api/expenses/export" className="glass-button flex items-center gap-2 bg-green-500/20 text-green-400 hover:bg-green-500/30">
                        <Download size={16} />
                        {t('download_csv')}
                    </a>
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
                    <h2 className="text-xl font-bold mb-4">{t('expense_list')}</h2>
                    {expenses.length === 0 ? (
                        <div className="glass-panel p-8 text-center text-gray-400">
                            No expenses recorded yet.
                        </div>
                    ) : (
                        <div className="glass-table-container">
                            <table className="glass-table">
                                <thead>
                                    <tr>
                                        <th>{t('date')}</th>
                                        <th>{t('description')}</th>
                                        <th>{t('category')}</th>
                                        <th>{t('amount')}</th>
                                        <th>{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map((expense) => (
                                        <tr key={expense.id}>
                                            <td className="text-gray-400 text-sm">
                                                {format(new Date(expense.date), 'PPP')}
                                            </td>
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
                    )}
                </div>
            </div>
        </div>
    );
}

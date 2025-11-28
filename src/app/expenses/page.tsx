import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import { addExpense } from '@/app/actions';
import { PlusCircle, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

export default async function ExpensesPage() {
    const sortedExpenses = await prisma.expense.findMany({
        orderBy: { date: 'desc' }
    });

    return (
        <div className="container min-h-screen pb-10">
            <Navbar />

            <header className="mb-8 animate-fade-in">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Expense Management
                </h1>
                <p className="text-gray-400 mt-2">Track daily manufacturing expenses.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Expense Form */}
                <div className="lg:col-span-1">
                    <div className="glass-card sticky top-24 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <PlusCircle size={20} className="text-primary" />
                            Add New Expense
                        </h2>
                        <form action={addExpense} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <input name="description" type="text" className="glass-input" placeholder="e.g., Coal purchase" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                                <input name="amount" type="number" step="0.01" className="glass-input" placeholder="0.00" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                <select name="category" className="glass-input bg-gray-800" required>
                                    <option value="Raw Material">Raw Material</option>
                                    <option value="Fuel">Fuel</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Labor Payment">Labor Payment</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <button type="submit" className="glass-button w-full">
                                Record Expense
                            </button>
                        </form>
                    </div>
                </div>

                {/* Expense List */}
                <div className="lg:col-span-2 space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-xl font-bold mb-4">Expense Records</h2>
                    {sortedExpenses.length === 0 ? (
                        <div className="glass-panel p-8 text-center text-gray-400">
                            No expenses recorded yet.
                        </div>
                    ) : (
                        <div className="glass-table-container">
                            <table className="glass-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Category</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedExpenses.map((expense) => (
                                        <tr key={expense.id}>
                                            <td className="text-gray-400 text-sm">
                                                {format(new Date(expense.date), 'PPP')}
                                            </td>
                                            <td className="font-medium text-white">{expense.description}</td>
                                            <td>
                                                <span className="px-2 py-1 rounded-full bg-white/5 text-xs text-gray-300 border border-white/10">
                                                    {expense.category}
                                                </span>
                                            </td>
                                            <td className="font-bold text-red-400">- ₹{expense.amount.toLocaleString()}</td>
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

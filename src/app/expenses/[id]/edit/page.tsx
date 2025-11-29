import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import { updateExpense } from '@/app/actions';
import { DollarSign, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const expense = await prisma.expense.findUnique({
        where: { id }
    });

    if (!expense) {
        redirect('/expenses');
    }

    return (
        <div className="min-h-screen pb-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <Link href="/expenses" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to List
                </Link>

                <div className="max-w-md mx-auto">
                    <div className="glass-card animate-fade-in">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <DollarSign size={20} className="text-primary" />
                            Edit Expense
                        </h2>
                        <form action={updateExpense} className="space-y-4">
                            <input type="hidden" name="id" value={expense.id} />
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <input name="description" type="text" defaultValue={expense.description} className="glass-input" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                                <input name="amount" type="number" step="0.01" defaultValue={expense.amount} className="glass-input" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                <select name="category" defaultValue={expense.category} className="glass-input">
                                    <option value="Raw Material">Raw Material</option>
                                    <option value="Labor Payment">Labor Payment</option>
                                    <option value="Fuel">Fuel</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <button type="submit" className="glass-button w-full">
                                Update Expense
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

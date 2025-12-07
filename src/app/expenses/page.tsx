export const dynamic = 'force-dynamic';


import { prisma } from '@/lib/db';
import ExpenseListContent from '@/components/ExpenseListContent';

export default async function ExpensesPage() {
    const sortedExpenses = await prisma.expense.findMany({
        orderBy: { date: 'desc' }
    });

    return <ExpenseListContent expenses={sortedExpenses} />;
}

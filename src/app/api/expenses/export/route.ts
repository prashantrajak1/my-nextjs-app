import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { format } from 'date-fns';

export async function GET() {
    const expenses = await prisma.expense.findMany({
        orderBy: { date: 'desc' }
    });

    const csvHeader = 'Date,Description,Category,Amount\n';

    const csvRows = expenses.map(expense => {
        const date = format(new Date(expense.date), 'yyyy-MM-dd');
        // Escape commas in description
        const description = expense.description.replace(/,/g, ';');

        return `${date},${description},${expense.category},${expense.amount}`;
    });

    const csvContent = csvHeader + csvRows.join('\n');

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="expenses_report_${format(new Date(), 'yyyy-MM-dd')}.csv"`,
        },
    });
}

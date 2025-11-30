import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { format } from 'date-fns';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter
    const dateFilter: any = {};
    if (startDate) {
        dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.lte = end;
    }

    const expenses = await prisma.expense.findMany({
        where: Object.keys(dateFilter).length > 0 ? {
            date: dateFilter
        } : undefined,
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

    const dateRange = startDate && endDate ? `_${startDate}_to_${endDate}` : '';
    const filename = `expenses_report${dateRange}_${format(new Date(), 'yyyy-MM-dd')}.csv`;

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
}

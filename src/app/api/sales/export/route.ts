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

    const sales = await prisma.sale.findMany({
        where: Object.keys(dateFilter).length > 0 ? {
            date: dateFilter
        } : undefined,
        orderBy: { date: 'desc' }
    });

    const csvHeader = 'Date,Vehicle No,Brick Type,Quantity,Rate,Total Amount,Received Amount,Due Amount,Status,Bill Path\n';

    const csvRows = sales.map(sale => {
        const date = format(new Date(sale.date), 'yyyy-MM-dd');
        const due = sale.totalAmount - sale.receivedAmount;
        const status = due > 0 ? 'Due' : 'Paid';
        const bill = sale.billPath ? `Yes` : 'No';

        return `${date},${sale.vehicleNo},${sale.brickType},${sale.quantity},${sale.rate},${sale.totalAmount},${sale.receivedAmount},${due},${status},${bill}`;
    });

    const csvContent = csvHeader + csvRows.join('\n');

    const dateRange = startDate && endDate ? `_${startDate}_to_${endDate}` : '';
    const filename = `sales_report${dateRange}_${format(new Date(), 'yyyy-MM-dd')}.csv`;

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
}

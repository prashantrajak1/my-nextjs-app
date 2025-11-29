import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { format } from 'date-fns';

export async function GET() {
    const sales = await prisma.sale.findMany({
        orderBy: { date: 'desc' }
    });

    const csvHeader = 'Date,Vehicle No,Quantity,Rate,Total Amount,Received Amount,Due Amount,Status,Bill Path\n';

    const csvRows = sales.map(sale => {
        const date = format(new Date(sale.date), 'yyyy-MM-dd');
        const due = sale.totalAmount - sale.receivedAmount;
        const status = due > 0 ? 'Due' : 'Paid';
        const bill = sale.billPath ? `Yes` : 'No';

        return `${date},${sale.vehicleNo},${sale.quantity},${sale.rate},${sale.totalAmount},${sale.receivedAmount},${due},${status},${bill}`;
    });

    const csvContent = csvHeader + csvRows.join('\n');

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="sales_report_${format(new Date(), 'yyyy-MM-dd')}.csv"`,
        },
    });
}

import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { format } from 'date-fns';

export async function GET() {
    const labors = await prisma.labor.findMany({
        include: {
            payments: true
        },
        orderBy: { createdAt: 'desc' }
    });

    const csvHeader = 'Name,Address,Bricks Made,Days Worked,Current Due,Total Payments,Payment Count\n';

    const csvRows = labors.map(labor => {
        const totalPayments = labor.payments.reduce((sum, p) => sum + p.amount, 0);
        const paymentCount = labor.payments.length;
        // Escape commas in name and address
        const name = labor.name.replace(/,/g, ';');
        const address = labor.address.replace(/,/g, ';');

        return `${name},${address},${labor.bricksMade},${labor.daysWorked},${labor.due},${totalPayments},${paymentCount}`;
    });

    const csvContent = csvHeader + csvRows.join('\n');

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="labors_report_${format(new Date(), 'yyyy-MM-dd')}.csv"`,
        },
    });
}

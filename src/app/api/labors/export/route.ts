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

    const labors = await prisma.labor.findMany({
        include: {
            payments: true
        },
        where: Object.keys(dateFilter).length > 0 ? {
            createdAt: dateFilter
        } : undefined,
        orderBy: { createdAt: 'desc' }
    });

    const csvHeader = 'Name,Address,Bricks Made,Rate per Brick,Money to Pay,Current Due,Total Payments,Payment Count\n';

    const csvRows = labors.map(labor => {
        const totalPayments = labor.payments.reduce((sum: number, p: any) => sum + p.amount, 0);
        const paymentCount = labor.payments.length;
        const moneyToPay = labor.bricksMade * labor.brickRate;
        // Escape commas in name and address
        const name = labor.name.replace(/,/g, ';');
        const address = labor.address.replace(/,/g, ';');

        return `${name},${address},${labor.bricksMade},${labor.brickRate},${moneyToPay},${labor.due},${totalPayments},${paymentCount}`;
    });

    const csvContent = csvHeader + csvRows.join('\n');

    const dateRange = startDate && endDate ? `_${startDate}_to_${endDate}` : '';
    const filename = `labors_report${dateRange}_${format(new Date(), 'yyyy-MM-dd')}.csv`;

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
}

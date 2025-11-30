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

    const manufacturing = await prisma.brickManufacturing.findMany({
        include: { labor: true },
        where: Object.keys(dateFilter).length > 0 ? {
            date: dateFilter
        } : undefined,
        orderBy: { date: 'desc' }
    });

    const csvHeader = 'Date,Brick Type,Quantity,Labor Name,Labor ID\n';

    const csvRows = manufacturing.map(record => {
        const date = format(new Date(record.date), 'yyyy-MM-dd');
        const laborName = record.labor ? record.labor.name : 'N/A';
        const laborId = record.laborId || 'N/A';

        return `${date},${record.brickType},${record.quantity},${laborName},${laborId}`;
    });

    const csvContent = csvHeader + csvRows.join('\n');

    const dateRange = startDate && endDate ? `_${startDate}_to_${endDate}` : '';
    const filename = `manufacturing_report${dateRange}_${format(new Date(), 'yyyy-MM-dd')}.csv`;

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
}

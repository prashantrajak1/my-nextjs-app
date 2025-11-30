import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { format } from 'date-fns';

export async function GET() {
    const manufacturing = await prisma.brickManufacturing.findMany({
        include: { labor: true },
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

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="manufacturing_report_${format(new Date(), 'yyyy-MM-dd')}.csv"`,
        },
    });
}

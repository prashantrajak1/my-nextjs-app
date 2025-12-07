export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import SalesListContent from '@/components/SalesListContent';

export default async function SalesPage() {
    const sortedSales = await prisma.sale.findMany({
        orderBy: { date: 'desc' }
    });

    return <SalesListContent sales={sortedSales} />;
}

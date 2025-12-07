export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import ManufacturingListContent from '@/components/ManufacturingListContent';

export default async function ManufacturingPage() {
    const sortedManufacturing = await prisma.brickManufacturing.findMany({
        include: { labor: true },
        orderBy: { date: 'desc' }
    });

    const labors = await prisma.labor.findMany({
        orderBy: { name: 'asc' }
    });

    return <ManufacturingListContent manufacturing={sortedManufacturing} labors={labors} />;
}

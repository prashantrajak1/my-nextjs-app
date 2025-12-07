export const dynamic = 'force-dynamic';


import { prisma } from '@/lib/db';
import LaborListContent from '@/components/LaborListContent';

export default async function LaborsPage() {
    const labors = await prisma.labor.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return <LaborListContent labors={labors} />;
}

import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { format } from 'date-fns';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const labor = await prisma.labor.findUnique({
        where: { id },
        include: {
            dailyRecords: {
                orderBy: { date: 'asc' }
            },
            payments: {
                orderBy: { date: 'asc' }
            }
        }
    });

    if (!labor) {
        return new NextResponse('Labor not found', { status: 404 });
    }

    // 1. Flatten all records to build a ledger
    const flatRecords = [
        ...labor.dailyRecords.map(r => ({
            date: new Date(r.date),
            type: 'Daily Work',
            bricks: r.bricksMade,
            rate: r.brickRate,
            payment: r.payment, // This is the "Payment" field in daily record? Wait, let's check schema/logic.
            // In daily record, is there a payment? A daily record usually tracks work.
            // Let's re-read schema or assumption.
            // Looking at `addLaborDailyRecord` (implied), usually it tracks bricks made.
            // Wait, looking at previous conversation, "Payment" input in Daily Work form was restored.
            // So a daily record *can* have a payment.
            // And `payments` table tracks "Advance" payments.

            // Re-evaluating logic from `src/app/labors/[id]/page.tsx` (viewed earlier):
            // "Balance increases with payment (Advance), decreases with work (Recovery)"
            // "Net Change = Payment - Work"
            // where `Work = bricks * rate`

            amountIn: r.payment, // Payment received (Advance)
            amountOut: r.bricksMade * r.brickRate, // Work value (Recovery)
            description: `Daily Work: ${r.bricksMade} bricks @ ${r.brickRate}`
        })),
        ...labor.payments.map(p => ({
            date: new Date(p.date),
            type: 'Advance Payment',
            bricks: 0,
            rate: 0,
            amountIn: p.amount,
            amountOut: 0,
            description: 'Advance Payment'
        }))
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    // 2. Calculate Opening Balance and Running Balance
    // Logic from `src/app/labors/[id]/page.tsx`:
    // totalRecordPayments = sum(all amounts in)
    // totalRecordWork = sum(all amounts out)
    // calculatedDue = totalRecordPayments - totalRecordWork
    // openingBalance = labor.due - calculatedDue

    // HOWEVER, labor.due is the current snapshot.
    // If we want a clean ledger, we can start from 0 if it's a new system, 
    // OR we can try to deduce an opening balance if there is a discrepancy.
    // Given this is an "Individual Record", a strict ledger from 0 is usually safer, 
    // OR just showing the running balance of *recorded* items.
    // Users often prefer to see "Balance" column.

    const totalRecordPayments = flatRecords.reduce((sum, r) => sum + r.amountIn, 0);
    const totalRecordWork = flatRecords.reduce((sum, r) => sum + r.amountOut, 0);
    const calculatedDue = totalRecordPayments - totalRecordWork;
    const openingBalance = labor.due - calculatedDue;

    // CSV Header
    const csvHeader = 'Date,Description,Bricks Made,Rate,Credit (Work Value),Debit (Advance/Payment),Balance\n';

    // We will accumulate rows
    let csvRows: string[] = [];
    let currentBalance = openingBalance;

    // Optional: Add Opening Balance row if it's non-zero
    if (Math.abs(openingBalance) > 0.01) {
        csvRows.push(`${format(flatRecords[0]?.date || new Date(), 'yyyy-MM-dd')},Opening Balance,0,0,0,0,${openingBalance.toFixed(2)}`);
    }

    const records = flatRecords.map(record => {
        const netChange = record.amountIn - record.amountOut;
        currentBalance += netChange;

        // Escape commas for CSV
        const desc = record.description.replace(/,/g, ';');

        return `${format(record.date, 'yyyy-MM-dd')},${desc},${record.bricks || 0},${record.rate || 0},${record.amountOut.toFixed(2)},${record.amountIn.toFixed(2)},${currentBalance.toFixed(2)}`;
    });

    csvRows = [...csvRows, ...records];

    const csvContent = csvHeader + csvRows.join('\n');
    const filename = `${labor.name.replace(/[^a-z0-9]/gi, '_')}_ledger_${format(new Date(), 'yyyy-MM-dd')}.csv`;

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
}

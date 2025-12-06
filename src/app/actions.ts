'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


// --- LABOR ACTIONS ---

export async function addLabor(formData: FormData) {
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const due = parseFloat(formData.get('due') as string) || 0;
    const bricksMade = parseInt(formData.get('bricksMade') as string) || 0;
    const brickRate = parseFloat(formData.get('brickRate') as string) || 0;

    await prisma.labor.create({
        data: { name, address, due, bricksMade, brickRate },
    });

    revalidatePath('/labors');
    revalidatePath('/');
}

export async function updateLabor(formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const due = parseFloat(formData.get('due') as string) || 0;
    const bricksMade = parseInt(formData.get('bricksMade') as string) || 0;
    const brickRate = parseFloat(formData.get('brickRate') as string) || 0;

    await prisma.labor.update({
        where: { id },
        data: { name, address, due, bricksMade, brickRate },
    });

    revalidatePath('/labors');
    revalidatePath('/');
    redirect('/labors');
}


export async function updateLaborStats(formData: FormData) {
    const id = formData.get('id') as string;
    const bricksMade = parseInt(formData.get('bricksMade') as string) || 0;
    const daysWorked = parseInt(formData.get('daysWorked') as string) || 0;

    await prisma.labor.update({
        where: { id },
        data: {
            bricksMade: { increment: bricksMade },
            daysWorked: { increment: daysWorked },
        },
    });

    revalidatePath('/labors');
}

export async function addLaborPayment(formData: FormData) {
    const laborId = formData.get('laborId') as string;
    const amount = parseFloat(formData.get('amount') as string) || 0;

    await prisma.$transaction([
        prisma.laborPayment.create({
            data: { laborId, amount },
        }),
        prisma.labor.update({
            where: { id: laborId },
            data: { due: { decrement: amount } },
        }),
    ]);

    revalidatePath('/labors');
    revalidatePath('/');
}

export async function deleteLabor(formData: FormData) {
    const id = formData.get('id') as string;

    // Delete related payments first (cascade usually handles this but explicit is safe)
    await prisma.laborPayment.deleteMany({ where: { laborId: id } });
    await prisma.labor.delete({ where: { id } });

    revalidatePath('/labors');
    revalidatePath('/');
}

// --- EXPENSE ACTIONS ---

export async function addExpense(formData: FormData) {
    const description = formData.get('description') as string;
    const amount = parseFloat(formData.get('amount') as string) || 0;
    const category = formData.get('category') as string;

    await prisma.expense.create({
        data: { description, amount, category },
    });

    revalidatePath('/expenses');
    revalidatePath('/');
}

export async function updateExpense(formData: FormData) {
    const id = formData.get('id') as string;
    const description = formData.get('description') as string;
    const amount = parseFloat(formData.get('amount') as string) || 0;
    const category = formData.get('category') as string;

    await prisma.expense.update({
        where: { id },
        data: { description, amount, category },
    });

    revalidatePath('/expenses');
    revalidatePath('/');
}

export async function deleteExpense(formData: FormData) {
    const id = formData.get('id') as string;
    await prisma.expense.delete({ where: { id } });
    revalidatePath('/expenses');
    revalidatePath('/');
}

// --- SALES & INVENTORY ACTIONS ---

export async function addSale(formData: FormData) {
    const vehicleNo = formData.get('vehicleNo') as string;
    const quantity = parseInt(formData.get('quantity') as string) || 0;
    const rate = parseFloat(formData.get('rate') as string) || 0;
    const receivedAmount = parseFloat(formData.get('receivedAmount') as string) || 0;
    const brickType = (formData.get('brickType') as string) || "No.1";

    const totalAmount = quantity * rate;

    await prisma.$transaction([
        prisma.sale.create({
            data: {
                vehicleNo,
                quantity,
                rate,
                totalAmount,
                receivedAmount,
                brickType,
            },
        }),
        // Deduct from inventory
        prisma.brickStock.upsert({
            where: { type: brickType },
            update: { quantity: { decrement: quantity } },
            create: { type: brickType, quantity: -quantity },
        })
    ]);

    revalidatePath('/sales');
    revalidatePath('/');
}

export async function updateSale(formData: FormData) {
    const id = formData.get('id') as string;
    const vehicleNo = formData.get('vehicleNo') as string;
    const quantity = parseInt(formData.get('quantity') as string) || 0;
    const rate = parseFloat(formData.get('rate') as string) || 0;
    const receivedAmount = parseFloat(formData.get('receivedAmount') as string) || 0;
    const brickType = (formData.get('brickType') as string) || "No.1";

    const totalAmount = quantity * rate;

    // Get old sale to adjust inventory
    const oldSale = await prisma.sale.findUnique({ where: { id } });
    if (!oldSale) return;

    await prisma.$transaction([
        prisma.sale.update({
            where: { id },
            data: { vehicleNo, quantity, rate, totalAmount, receivedAmount, brickType },
        }),
        // Restore old stock
        prisma.brickStock.upsert({
            where: { type: oldSale.brickType },
            update: { quantity: { increment: oldSale.quantity } },
            create: { type: oldSale.brickType, quantity: oldSale.quantity },
        }),
        // Deduct new stock
        prisma.brickStock.upsert({
            where: { type: brickType },
            update: { quantity: { decrement: quantity } },
            create: { type: brickType, quantity: -quantity },
        })
    ]);

    revalidatePath('/sales');
    revalidatePath('/');
}

export async function deleteSale(formData: FormData) {
    const id = formData.get('id') as string;

    const sale = await prisma.sale.findUnique({ where: { id } });
    if (!sale) return;

    await prisma.$transaction([
        prisma.sale.delete({ where: { id } }),
        // Restore stock
        prisma.brickStock.upsert({
            where: { type: sale.brickType },
            update: { quantity: { increment: sale.quantity } },
            create: { type: sale.brickType, quantity: sale.quantity },
        })
    ]);

    revalidatePath('/sales');
    revalidatePath('/');
}

// Manual Stock Adjustment (if needed)
export async function updateBrickStock(formData: FormData) {
    const type = formData.get('type') as string;
    const quantity = parseInt(formData.get('quantity') as string) || 0; // Amount to ADD

    await prisma.brickStock.upsert({
        where: { type },
        update: { quantity: { increment: quantity } },
        create: { type, quantity },
    });

    revalidatePath('/');
}

// --- MANUFACTURING ACTIONS ---

export async function addManufacturing(formData: FormData) {
    const brickType = formData.get('brickType') as string;
    const quantity = parseInt(formData.get('quantity') as string) || 0;
    const laborId = (formData.get('laborId') as string) || null;
    const dateStr = formData.get('date') as string;
    const date = dateStr ? new Date(dateStr) : new Date();

    await prisma.brickManufacturing.create({
        data: {
            brickType,
            quantity,
            laborId: laborId || undefined,
            date,
        },
    });

    revalidatePath('/manufacturing');
    revalidatePath('/');
}

export async function updateManufacturing(formData: FormData) {
    const id = formData.get('id') as string;
    const brickType = formData.get('brickType') as string;
    const quantity = parseInt(formData.get('quantity') as string) || 0;
    const laborId = (formData.get('laborId') as string) || null;
    const dateStr = formData.get('date') as string;
    const date = dateStr ? new Date(dateStr) : new Date();

    await prisma.brickManufacturing.update({
        where: { id },
        data: {
            brickType,
            quantity,
            laborId: laborId || undefined,
            date,
        },
    });

    revalidatePath('/manufacturing');
    revalidatePath('/');
}

export async function deleteManufacturing(formData: FormData) {
    const id = formData.get('id') as string;

    await prisma.brickManufacturing.delete({
        where: { id },
    });
    revalidatePath('/manufacturing');
    revalidatePath('/');
}

export async function addLaborDailyRecord(formData: FormData) {
    const laborId = formData.get('laborId') as string;
    const dateStr = formData.get('date') as string;
    const date = dateStr ? new Date(dateStr) : new Date();
    const bricksMade = parseInt(formData.get('bricksMade') as string) || 0;
    const payment = parseFloat(formData.get('payment') as string) || 0;
    const brickRate = parseFloat(formData.get('brickRate') as string) || 0;

    await prisma.$transaction(async (tx) => {
        // 1. Create Daily Record
        // If payment > 0, create expense and link it
        let expenseId = undefined;
        if (payment > 0) {
            // Fetch labor name for description
            const labor = await tx.labor.findUnique({ where: { id: laborId } });
            const expense = await tx.expense.create({
                data: {
                    description: `Labor Payment: ${labor?.name || 'Unknown'}`,
                    amount: payment,
                    category: 'Labor',
                    date: date
                }
            });
            expenseId = expense.id;
        }

        await tx.laborDailyRecord.create({
            data: {
                laborId,
                date,
                bricksMade,
                payment,
                brickRate,
                isPaid: false,
                expenseId // Link the expense if created
            }
        });

        // 2. Update Labor Totals
        // Advance Model: Due = Labor owes Company
        // Payment increases Due (Advance given)
        // Work decreases Due (Advance recovered)
        const workValue = bricksMade * brickRate;
        const netDueChange = payment - workValue;

        await tx.labor.update({
            where: { id: laborId },
            data: {
                bricksMade: { increment: bricksMade },
                due: { increment: netDueChange }
            }
        });

        // 3. Update Global Brick Stock
        if (bricksMade > 0) {
            await tx.brickStock.upsert({
                where: { type: "No.1" },
                update: { quantity: { increment: bricksMade } },
                create: { type: "No.1", quantity: bricksMade },
            });
        }
    });

    revalidatePath(`/labors/${laborId}`);
    revalidatePath('/labors');
    revalidatePath('/');
}

export async function toggleLaborRecordPaid(id: string, isPaid: boolean) {
    await prisma.laborDailyRecord.update({
        where: { id },
        data: { isPaid }
    });
    revalidatePath('/labors');
}

export async function deleteLaborDailyRecord(formData: FormData) {
    const id = formData.get('id') as string;
    const laborId = formData.get('laborId') as string;

    const record = await prisma.laborDailyRecord.findUnique({ where: { id } });
    if (!record) return;

    await prisma.$transaction(async (tx) => {
        // 1. Delete Record and Linked Expense
        // If there is an expenseId, delete the expense (optional, but good for cleanup if not cascaded)
        if (record.expenseId) {
            await tx.expense.delete({ where: { id: record.expenseId } });
        }
        await tx.laborDailyRecord.delete({ where: { id } });

        // 2. Revert Labor Totals
        const workValue = record.bricksMade * record.brickRate;
        const netDueChange = record.payment - workValue;

        await tx.labor.update({
            where: { id: laborId },
            data: {
                bricksMade: { decrement: record.bricksMade },
                due: { decrement: netDueChange }
            }
        });

        // 3. Revert Stock
        if (record.bricksMade > 0) {
            await tx.brickStock.update({
                where: { type: "No.1" },
                data: { quantity: { decrement: record.bricksMade } }
            });
        }
    });

    revalidatePath(`/labors/${laborId}`);
    revalidatePath('/labors');
    revalidatePath('/');
}

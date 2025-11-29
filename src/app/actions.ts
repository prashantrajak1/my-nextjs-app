'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// --- LABOR ACTIONS ---

export async function addLabor(formData: FormData) {
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const due = parseFloat(formData.get('due') as string) || 0;

    await prisma.labor.create({
        data: { name, address, due },
    });

    revalidatePath('/labors');
    revalidatePath('/');
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

    // Handle file upload
    const billFile = formData.get('bill') as File | null;
    let billPath = null;

    if (billFile && billFile.size > 0) {
        try {
            const buffer = Buffer.from(await billFile.arrayBuffer());
            const filename = `${Date.now()}-${billFile.name.replace(/\s/g, '_')}`;
            const fs = require('fs');
            const path = require('path');
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
            fs.writeFileSync(path.join(uploadDir, filename), buffer);
            billPath = `/uploads/${filename}`;
        } catch (error) {
            console.error("File upload failed:", error);
        }
    }

    const totalAmount = quantity * rate;

    await prisma.$transaction([
        prisma.sale.create({
            data: {
                vehicleNo,
                quantity,
                rate,
                totalAmount,
                receivedAmount,
                billPath,
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

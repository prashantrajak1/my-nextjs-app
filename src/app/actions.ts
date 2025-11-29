'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addLabor(formData: FormData) {
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const due = parseFloat(formData.get('due') as string) || 0;

    await prisma.labor.create({
        data: {
            name,
            address,
            due,
        },
    });

    revalidatePath('/labors');
    revalidatePath('/');
}

export async function updateLaborStats(formData: FormData) {
    const id = formData.get('id') as string;
    const bricksMade = parseInt(formData.get('bricksMade') as string) || 0;
    const daysWorked = parseInt(formData.get('daysWorked') as string) || 0;

    // Increment existing values
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

    // Create payment record and decrease due amount
    await prisma.$transaction([
        prisma.laborPayment.create({
            data: {
                laborId,
                amount,
            },
        }),
        prisma.labor.update({
            where: { id: laborId },
            data: {
                due: { decrement: amount },
            },
        }),
    ]);

    revalidatePath('/labors');
    revalidatePath('/');
}

export async function addExpense(formData: FormData) {
    const description = formData.get('description') as string;
    const amount = parseFloat(formData.get('amount') as string) || 0;
    const category = formData.get('category') as string;

    await prisma.expense.create({
        data: {
            description,
            amount,
            category,
        },
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
        data: {
            description,
            amount,
            category,
        },
    });

    revalidatePath('/expenses');
    revalidatePath('/');
}

export async function addSale(formData: FormData) {
    const vehicleNo = formData.get('vehicleNo') as string;
    const quantity = parseInt(formData.get('quantity') as string) || 0;
    const rate = parseFloat(formData.get('rate') as string) || 0;
    const receivedAmount = parseFloat(formData.get('receivedAmount') as string) || 0;

    // Handle file upload
    const billFile = formData.get('bill') as File | null;
    let billPath = null;

    if (billFile && billFile.size > 0) {
        try {
            const buffer = Buffer.from(await billFile.arrayBuffer());
            const filename = `${Date.now()}-${billFile.name.replace(/\s/g, '_')}`;

            // Ensure uploads directory exists
            const fs = require('fs');
            const path = require('path');
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            fs.writeFileSync(path.join(uploadDir, filename), buffer);
            billPath = `/uploads/${filename}`;
        } catch (error) {
            console.error("File upload failed (likely read-only fs):", error);
            // Continue without saving file
        }
    }

    const totalAmount = quantity * rate;

    await prisma.sale.create({
        data: {
            vehicleNo,
            quantity,
            rate,
            totalAmount,
            receivedAmount,
            billPath,
        },
    });

    revalidatePath('/sales');
    revalidatePath('/');
}

export async function updateSale(formData: FormData) {
    const id = formData.get('id') as string;
    const vehicleNo = formData.get('vehicleNo') as string;
    const quantity = parseInt(formData.get('quantity') as string) || 0;
    const rate = parseFloat(formData.get('rate') as string) || 0;
    const receivedAmount = parseFloat(formData.get('receivedAmount') as string) || 0;

    const totalAmount = quantity * rate;

    await prisma.sale.update({
        where: { id },
        data: {
            vehicleNo,
            quantity,
            rate,
            totalAmount,
            receivedAmount,
        },
    });

    revalidatePath('/sales');
    revalidatePath('/');
}

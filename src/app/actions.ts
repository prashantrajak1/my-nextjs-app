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

export async function addSale(formData: FormData) {
    const vehicleNo = formData.get('vehicleNo') as string;
    const quantity = parseInt(formData.get('quantity') as string) || 0;
    const rate = parseFloat(formData.get('rate') as string) || 0;
    const receivedAmount = parseFloat(formData.get('receivedAmount') as string) || 0;

    const totalAmount = quantity * rate;

    await prisma.sale.create({
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

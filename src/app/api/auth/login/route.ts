import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body; // Changed username to email

    if (!email || !password) {
        return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set('auth_token', 'valid_token', { // Ideally use a JWT here
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
    }
}

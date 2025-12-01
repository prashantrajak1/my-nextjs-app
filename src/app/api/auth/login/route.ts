import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Hardcoded credentials
        const validEmail = "muskanrajak1111@gmail.com";
        const validPassword = "9855040827";

        if (email === validEmail && password === validPassword) {
            const cookieStore = await cookies();
            cookieStore.set('auth_token', 'valid_token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
    }
}

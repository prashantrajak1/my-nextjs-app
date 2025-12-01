```typescript
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const cookieStore = cookies();
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
}
```

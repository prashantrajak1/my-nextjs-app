import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 text-gray-300">
                    Loading login…
                </div>
            }
        >
            <LoginForm />
        </Suspense>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/ui/auth/AuthLayout';
import InputField from '@/components/ui/auth/InputField';
import SubmitButton from '@/components/ui/auth/SubmitButton';
import AuthSwitchLink from '@/components/ui/auth/AuthSwitchLink';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authenticate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const token = await response.text();
                localStorage.setItem('token', token);
                router.push('/user/home');
            } else {
                setError('Login fehlgeschlagen');
            }
        } catch (err) {
            setError('Netzwerkfehler – bitte später erneut versuchen.');
        }
    };

    return (
        <AuthLayout>
            <div className="flex flex-col items-center mb-6">
                <div className="h-20 w-20 mb-4 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">
                    🥗
                </div>
                <h1 className="text-3xl font-bold text-gray-800">FoodBuddy</h1>
                <p className="text-gray-500">Willkommen zurück! Bitte melde dich an.</p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
                className="space-y-4"
            >
                <InputField
                    type="text"
                    name="username"
                    placeholder="Benutzername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <InputField
                    type="password"
                    name="password"
                    placeholder="Passwort"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <SubmitButton label="Anmelden" />
                <AuthSwitchLink
                    text="Noch kein Konto?"
                    linkText="Jetzt registrieren"
                    href="/register"
                />
            </form>

            {error && (
                <div className="mt-4 w-full">
                    <div className="w-full p-3 rounded-lg bg-red-100 border border-red-400 text-red-700 text-sm text-center">
                        <strong className="font-semibold">Fehler:</strong> {error}
                    </div>
                </div>
            )}
        </AuthLayout>
    );
}

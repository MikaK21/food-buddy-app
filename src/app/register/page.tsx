'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/ui/auth/AuthLayout';
import InputField from '@/components/ui/auth/InputField';
import SubmitButton from '@/components/ui/auth/SubmitButton';
import AuthSwitchLink from '@/components/ui/auth/AuthSwitchLink';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirm_password) {
            setErrorMessage('Passwörter stimmen nicht überein.');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register/user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const msg = errorData.username || errorData.email || errorData.message || 'Unbekannter Fehler';
                setErrorMessage(msg);
                return;
            }

            router.push('/user/home');
        } catch (error) {
            setErrorMessage('Ein Fehler ist aufgetreten. Bitte versuche es erneut.' + error);
        }
    };

    return (
        <AuthLayout>
            <div className="flex flex-col items-center mb-6">
                <div className="h-20 w-20 mb-4 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">
                    🥗
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Registrieren</h1>
                <p className="text-gray-500">Erstelle dein FoodBuddy-Konto</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField type="text" name="username" placeholder="Benutzername" value={formData.username} onChange={handleChange} />
                <InputField type="email" name="email" placeholder="E-Mail" value={formData.email} onChange={handleChange} />
                <InputField type="password" name="password" placeholder="Passwort" value={formData.password} onChange={handleChange} />
                <InputField type="password" name="confirm_password" placeholder="Passwort bestätigen" value={formData.confirm_password} onChange={handleChange} />
                <SubmitButton label="Registrieren" />
                <AuthSwitchLink text="Schon registriert?" linkText="Zum Login" href="/login" />
            </form>

            {errorMessage && (
                <div className="mt-4 w-full">
                    <div className="w-full p-3 rounded-lg bg-red-100 border border-red-400 text-red-700 text-sm text-center">
                        <strong className="font-semibold">Fehler:</strong> {errorMessage}
                    </div>
                </div>
            )}
        </AuthLayout>
    );
}

'use client';

import { useEffect, useState } from 'react';

type User = {
    id: number;
    username: string;
    email: string;
};

export default function TestUserPage() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/user/me', {
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Fehler: ${res.status}`);
                }
                return res.json();
            })
            .then(setUser)
            .catch(err => setError(err.message));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">🔍 Benutzer-Testseite</h1>

            {error && <p className="text-red-600">❌ Fehler: {error}</p>}

            {user ? (
                <div className="space-y-2">
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Benutzername:</strong> {user.username}</p>
                    <p><strong>E-Mail:</strong> {user.email}</p>
                </div>
            ) : (
                !error && <p className="text-gray-500">⏳ Benutzer wird geladen...</p>
            )}
        </div>
    );
}

'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton({ className = '' }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch(`/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (err) {
            console.error('Logout fehlgeschlagen:', err);
        } finally {
            localStorage.removeItem('token');
            router.push('/login');
        }
    };

    return (
        <button
            onClick={handleLogout}
            className={`text-red-600 hover:bg-red-100 hover:text-red-800 rounded border border-transparent hover:border-red-300 transition ${className}`}
        >
            🚪 Logout
        </button>
    );
}

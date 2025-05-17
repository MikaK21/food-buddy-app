'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
        } else {
            setIsAuthChecked(true);
        }
    }, [router]);

    if (!isAuthChecked) {
        return <p>Lade...</p>;
    }

    return <>{children}</>;
}

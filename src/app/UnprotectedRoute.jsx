'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UnprotectedRoute({ children }) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/user/inventory'); // oder direkt zur Einkaufsliste
        }
    }, [router]);

    return <>{children}</>;
}

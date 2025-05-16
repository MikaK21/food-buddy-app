const API_BASE_URL = 'http://localhost:8080'; // oder dein echtes Backend

export async function authFetch(path: string, options?: RequestInit) {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(options?.headers || {})
        }
    });

    if (!res.ok) {
        const text = await res.text(); // Debug-Ausgabe
        throw new Error(`HTTP ${res.status}: ${text}`);
    }

    return res;
}

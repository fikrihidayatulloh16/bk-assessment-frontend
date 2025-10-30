// lib/api.ts
'use client';

//Fungsi helper untuk fetch
export const fetchWithCredentials = async (
    url: string,
    options: RequestInit = {},
) => {
    const response = await fetch(`http://localhost:3000${url}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Terjadi kesalahan');
    }
    return response.json();
};

// Fungsi helper untuk login
export const fetchLogin = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        
        // INI BAGIAN PALING PENTING!
        // Ini memberitahu browser untuk "tolong kirim dan terima cookie 
        // dari/ke backend", bahkan jika beda port (3000 vs 3001)
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Terjadi kesalahan');
    }

    return response.json();
}
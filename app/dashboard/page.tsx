// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  school_id: string;
}

export default function dashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:3000/auth/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // WAJIB: Kirim cookie yang sudah disimpan browser
                credentials: 'include', 
                });

                if (!response.ok) {
                // Jika backend mengembalikan 401 (tidak login), lempar error
                throw new Error('Not authenticated'); 
                }

                const userData: User = await response.json();
                setUser(userData); // Simpan data user
            } catch (error) {
                console.error(error);
                // Jika gagal (tidak login), tendang kembali ke halaman login
                router.push('/login');

            } finally {
                setLoading(false); // Selesai loading
            }
        }
        fetchProfile();
    }, [router]);

    // Tampilkan pesan loading
    if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Selamat Datang di Dashboard!</h1>
        <p className="mt-2">Ini adalah halaman terproteksi.</p>
        <div className="mt-4 rounded bg-gray-100 p-4">
          <p>Email Anda: {user.email}</p>
          <p>ID Sekolah Anda: {user.school_id}</p>
        </div>
      </div>
    );
  }

  // Jika tidak loading dan tidak ada user, return null (karena akan diredirect)
  return null;
}
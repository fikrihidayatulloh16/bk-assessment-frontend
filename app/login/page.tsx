// app/login/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation'; // <-- 1. IMPORT useRouter

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // <-- 2. INISIALISASI ROUTER

  // 3. KITA GANTI FUNGSI INI
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
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

      const data = await response.json();

      // 1. Logika untuk melempar error jika login gagal
      if (!response.ok) {
        // Jika backend mengembalikan error (401, 404, dll)
        throw new Error(data.message || 'Terjadi kesalahan');
      }

      // 2. Logika untuk menangkap error dan menyetel state
    try {
      // Kode yang mungkin gagal
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Email atau password salah');
      console.error(err); // <-- INI PENTING
    }

    // 3. Logika untuk menampilkan error di UI
    {error && (
        <p className="text-sm font-medium text-red-500">{error}</p>
    )}

      // Jika sukses...
      console.log('Login berhasil:', data.message);
      
      // Arahkan pengguna ke halaman dashboard
      // Kita akan buat halaman /dashboard ini nanti
      router.push('/dashboard'); 

    } catch (err) {
      // Tangani error
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Email atau password salah');
      console.error(err);
    }
    // setLoading(false) tidak perlu di sini jika sukses,
    // karena kita akan pindah halaman
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login Guru</CardTitle>
          <CardDescription>
            Masukkan email dan password Anda untuk mengakses dashboard.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {/* ... (Form input tidak berubah) ... */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="guru@sekolah.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-red-500">{error}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
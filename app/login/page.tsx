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
import { useRouter } from 'next/navigation';
import { fetchLogin } from '@/lib/api'; // <-- Import Anda sudah benar

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ==========================================================
  // INI ADALAH VERSI handleSubmit YANG SUDAH BERSIH
  // ==========================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Panggil helper API Anda.
      // Semua logika (method, headers, body, credentials)
      // sudah ada di dalam 'fetchLogin'.
      const data = await fetchLogin(email, password);

      // 2. Jika kode di atas tidak melempar error, berarti sukses.
      console.log('Login berhasil:', data.message);
      router.push('/dashboard');

    } catch (err) {
      // 3. Jika fetchLogin melempar error, kita tangkap di sini.
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Email atau password salah');
      console.error(err);
    }
    // (Kita tidak perlu setLoading(false) di 'try'
    // karena halaman akan pindah)
  };
  // ==========================================================
  // Selesai
  // ==========================================================

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
            {/* Tampilan error ini sudah benar */}
            {error && (
              <p className="text-sm font-medium text-red-500">{error}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="mt-5 w-full" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
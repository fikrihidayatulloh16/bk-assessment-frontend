// components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { fetchLogout } from '@/lib/api';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetchLogout();
      // Setelah logout berhasil, paksa redirect ke login
      router.push('/login');
    } catch (error) {
      console.error('Gagal logout:', error);
      alert('Gagal logout, silakan coba lagi.');
    }
  };

  return (
    <header className="container mx-auto sticky top-0 z-50 w-full border-b bg-slate-100/95 backdrop-blur supports-[backdrop-filter]:bg-slate-100/60 supports-[backdrop-filter]:backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        {/* Judul / Logo */}
        <Link href="/dashboard" className="text-lg font-bold">
          Asesmen BK
        </Link>

        {/* Tombol Logout */}
        <Button className="mr-2" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
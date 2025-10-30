// app/dashboard/layout.tsx
import Breadcrumbs from '@/components/layouts/Breadcrumbs';
import Navbar from '@/components/layouts/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Kita gunakan flex-col agar footer (jika ada) bisa menempel di bawah
    <div className="flex min-h-screen flex-col">
      {/* 1. Navbar permanen di atas */}
      <Navbar />
      
      {/* 2. Breadcrumbs di bawah navbar */}
      <Breadcrumbs />

      {/* 3. Konten halaman Anda (page.tsx) akan dirender di sini */}
      <main className="container flex-1 container mx-auto p-8">
        {children}
      </main>
    </div>
  );
}
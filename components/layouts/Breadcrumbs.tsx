// components/layout/Breadcrumbs.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'; // Kita bisa gunakan komponen shadcn jika ada, atau buat manual
import { Fragment } from 'react';

// Fungsi helper untuk mengubah 'assessmentId' menjadi 'Detail'
const prettyName = (name: string) => {
  if (name.match(/^[0-9a-f-]{36}$/i)) { // Cek jika ini UUID
    return 'Detail Asesmen';
  }
  return name.charAt(0).toUpperCase() + name.slice(1); // Kapitalisasi
};

export default function Breadcrumbs() {
  const pathname = usePathname(); // Cth: /dashboard/uuid-123

  // 1. Pisahkan URL menjadi segmen
  // Hasil: ['dashboard', 'uuid-123']
  const segments = pathname.split('/').filter(Boolean);

  return (
    <div className="container mx-auto mt-4">
      <Breadcrumb>
        <BreadcrumbList>
          {/* Tautan Home/Dashboard default */}
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {/* Loop untuk sisa segmen */}
          {segments.slice(1).map((segment, index) => {
            // Buat path parsial, cth: /dashboard/uuid-123
            const href = '/' + segments.slice(0, index + 2).join('/');
            const isLast = index === segments.length - 2;

            return (
              <Fragment key={href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    // Segmen terakhir tidak bisa diklik
                    <BreadcrumbPage className="font-semibold">
                      {prettyName(segment)}
                    </BreadcrumbPage>
                  ) : (
                    // Segmen di tengah bisa diklik
                    <BreadcrumbLink asChild>
                      <Link href={href}>{prettyName(segment)}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

// CATATAN: Kita perlu mengambil komponen Breadcrumb
// Jalankan: npx shadcn-ui@latest add breadcrumb
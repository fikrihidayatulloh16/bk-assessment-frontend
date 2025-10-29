// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers'; // <-- 1. IMPORT

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aplikasi Asesmen BK',
  description: 'Dibuat dengan Next.js dan NestJS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <Providers> {/* <-- 2. BUNGKUS DI SINI */}
          {children}
        </Providers> {/* <-- 3. TUTUP DI SINI */}
      </body>
    </html>
  );
}
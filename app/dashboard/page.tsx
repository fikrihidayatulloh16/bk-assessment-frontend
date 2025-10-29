// app/dashboard/page.tsx
'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

// Komponen UI yang kita ambil
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

// Tipe data untuk Asesmen
interface Assessment {
  id: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  createdAt: string;
}

// Fungsi helper untuk mengambil data (Fetch API)
// Ini adalah 'credentials: include' yang sama dari login
const fetchWithCredentials = async (
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

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient(); // Untuk me-refresh data

  // State untuk form di modal
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // =============================================================
  // (Best Practice) 1. Mengambil Data dengan useQuery
  // =============================================================
  const {
    data: assessments, // Data akan ada di sini
    isLoading, // true jika sedang loading
    error, // error jika gagal
  } = useQuery<Assessment[]>({
    queryKey: ['assessments'], // Kunci unik untuk query ini
    queryFn: () => fetchWithCredentials('/assessments'), // Fungsi fetcher
    retry: (failureCount, err) => {
      // Jika error 401 (Unauthorized), redirect ke login
      if (err.message.includes('Unauthorized')) {
        router.push('/login');
        return false; // Hentikan retry
      }
      return failureCount < 3; // Coba lagi 3x
    },
  });

  // =============================================================
  // (Best Practice) 2. Membuat Data dengan useMutation
  // =============================================================
  const { mutate: createAssessment, isPending: isCreating } = useMutation({
    mutationFn: (newAssessment: { title: string; description: string }) =>
      fetchWithCredentials('/assessments', {
        method: 'POST',
        body: JSON.stringify(newAssessment),
      }),
    onSuccess: () => {
      // Jika sukses...
      console.log('Asesmen baru berhasil dibuat!');
      // Otomatis refresh data di tabel (queryKey 'assessments')
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      // Tutup modal
      setIsModalOpen(false);
      // Reset form
      setTitle('');
      setDescription('');
    },
    onError: (err) => {
      alert(`Gagal membuat asesmen: ${err.message}`);
    },
  });

  // Handler untuk submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAssessment({ title, description });
  };

  // Tampilkan status loading...
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading data asesmen...</p>
      </div>
    );
  }

  // Tampilkan status error
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  // Tampilkan UI utama
  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Asesmen</h1>

        {/* Tombol untuk membuka Modal/Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>Buat Asesmen Baru</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Asesmen Baru</DialogTitle>
              <DialogDescription>
                Buat "wadah" baru untuk asesmen Anda.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Judul</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabel untuk menampilkan data asesmen */}
      <div className="mt-8 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {assessments && assessments.length > 0 ? (
                assessments.map((assessment) => (
                  <TableRow
                    key={assessment.id} // <-- Kembalikan key ke TableRow
                    className="cursor-pointer hover:bg-gray-50"
                    // TAMBAHKAN onClick DI SINI
                    onClick={() => {
                      router.push(`/dashboard/${assessment.id}`);
                    }}
                  >
                    <TableCell className="font-medium">
                      {assessment.title}
                    </TableCell>
                    <TableCell>{assessment.status}</TableCell>
                    <TableCell>
                      {new Date(assessment.createdAt).toLocaleDateString('id-ID')}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Belum ada asesmen.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}
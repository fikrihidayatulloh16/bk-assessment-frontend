// app/dashboard/page.tsx
'use client';

import { useState } from 'react';
// Import hook baru kita
import { useAssessments } from './useAssessments';

// Komponen UI (semua import UI tetap sama)
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  // State untuk form (UI state) tetap di sini, ini sudah benar
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // =============================================================
  // INI ADALAH KODE BARU KITA
  // Jauh lebih bersih!
  const {
    assessments,
    isLoading,
    error,
    createAssessment,
    isCreating,
  } = useAssessments();
  // =============================================================

  // HAPUS: Blok useQuery (sudah pindah)
  // HAPUS: Blok useMutation (sudah pindah)

  // Handler untuk submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAssessment(
      { title, description },
      {
        // Kita pindahkan onSuccess ke sini agar spesifik
        onSuccess: () => {
          setIsModalOpen(false);
          setTitle('');
          setDescription('');
        },
      },
    );
  };

  // Tampilkan status loading... (tidak berubah)
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading data asesmen...</p>
      </div>
    );
  }

  // Tampilkan status error (tidak berubah)
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    // Tambahkan padding container kita di sini
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Dashboard Asesmen</h1>
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

      <div className="mt-8 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-foreground">Judul</TableHead>
              <TableHead className="font-semibold text-foreground">Status</TableHead>
              <TableHead className="font-semibold text-foreground">Tanggal Dibuat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:nth-child(even)]:bg-muted/50">
            {assessments && assessments.length > 0 ? (
              assessments.map((assessment) => (
                <TableRow
                  key={assessment.id}
                  className="cursor-pointer hover:bg-gray-50"
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
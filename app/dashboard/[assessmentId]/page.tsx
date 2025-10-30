// app/dashboard/[assessmentId]/page.tsx
'use client';

import { useState } from 'react';
import { useDetails } from './useDetails'; // <-- 1. Impor hook kita
import type { NewQuestionData } from './useDetails'; // <-- Impor tipe data

// 2. Impor semua komponen UI Anda (Button, Dialog, dll.)
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AssessmentDetailPage() {
  // 3. Definisikan STATE LOKAL (UI) di sini
  const [questionText, setQuestionText] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 4. Panggil hook-nya untuk mendapatkan data dan fungsi
  const {
    assessmentId,
    questions,
    isLoadingQuestions,
    domains,
    isLoadingDomains,
    createQuestion,
    isCreating,
  } = useDetails();

  // 5. Definisikan handler submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDomain) {
      alert('Silakan pilih domain');
      return;
    }

    const newQuestionData: NewQuestionData = {
      question_text: questionText,
      question_type: 'yes_no',
      domainId: selectedDomain,
      assessmentId: assessmentId,
    };

    // Panggil mutasi dari hook
    createQuestion(newQuestionData, {
      // Tangani logika UI 'onSuccess' DI SINI, di dalam komponen
      onSuccess: () => {
        setIsModalOpen(false);
        setQuestionText('');
        setSelectedDomain('');
      },
    });
  };

  // 6. Tampilkan loading state
  if (isLoadingQuestions || isLoadingDomains) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading data pertanyaan...</p>
      </div>
    );
  }

  // 7. Tampilkan UI (JSX)
  // (Kode JSX Anda dari sebelumnya sudah benar,
  // pastikan Anda menempelkannya di sini)
  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manajemen Pertanyaan</h1>

        {/* Tombol untuk membuka Modal 'Tambah Pertanyaan' */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>Tambah Pertanyaan Baru</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pertanyaan Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="questionText">Teks Pertanyaan</Label>
                  <Input
                    id="questionText"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Select
                    value={selectedDomain}
                    onValueChange={setSelectedDomain}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih domain..." />
                    </SelectTrigger>
                    <SelectContent>
                      {domains?.map((domain) => (
                        <SelectItem key={domain.id} value={domain.id}>
                          {domain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

      {/* Tabel untuk menampilkan daftar pertanyaan */}
      <div className="mt-8 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pertanyaan</TableHead>
              <TableHead>Domain</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions && questions.length > 0 ? (
              questions.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">
                    {q.question_text}
                  </TableCell>
                  <TableCell>{q.domain?.name || 'N/A'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  Belum ada pertanyaan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
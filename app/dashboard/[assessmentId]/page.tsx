// app/dashboard/[assessmentId]/page.tsx
'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation'; // <-- Impor useParams
import { useState } from 'react';

// Komponen UI (kita akan pakai ulang dari dashboard)
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
// Kita butuh 'Select' untuk dropdown Domain
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Tipe data baru kita
interface Question {
  id: string;
  question_text: string;
  question_type: string;
  domain: {
    name: string;
  };
}

interface Domain {
  id: string;
  name: string;
}

// Helper fetch yang sama
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

export default function AssessmentDetailPage() {
  const router = useRouter();
  const params = useParams(); // <-- Hook untuk mengambil ID dari URL
  const assessmentId = params.assessmentId as string; // Ambil ID asesmen
  const queryClient = useQueryClient();

  // State untuk form 'Tambah Pertanyaan'
  const [questionText, setQuestionText] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // =============================================================
  // KITA BUTUH 2 QUERIES SEKARANG
  // =============================================================

  // 1. Query untuk mengambil daftar PERTANYAAN
  const { data: questions, isLoading: isLoadingQuestions } = useQuery<
    Question[]
  >({
    queryKey: ['questions', assessmentId], // Kunci query harus unik
    queryFn: () =>
      fetchWithCredentials(`/questions/by-assessment/${assessmentId}`),
    retry: (failureCount, err) => {
      if (err.message.includes('Unauthorized')) {
        router.push('/login');
        return false;
      }
      return failureCount < 3;
    },
  });

  // 2. Query untuk mengambil daftar DOMAIN (untuk dropdown)
  const { data: domains, isLoading: isLoadingDomains } = useQuery<Domain[]>({
    queryKey: ['domains'],
    queryFn: () => fetchWithCredentials('/domains'),
    retry: false, // Kita sudah tangani di query pertama
  });

  // =============================================================
  // Mutation untuk MEMBUAT PERTANYAAN baru
  // =============================================================
  const { mutate: createQuestion, isPending: isCreating } = useMutation({
    mutationFn: (newQuestion: {
      question_text: string;
      question_type: string;
      domainId: string;
      assessmentId: string;
    }) =>
      fetchWithCredentials('/questions', {
        method: 'POST',
        body: JSON.stringify(newQuestion),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', assessmentId] });
      setIsModalOpen(false);
      setQuestionText('');
      setSelectedDomain('');
    },
    onError: (err) => {
      alert(`Gagal menambah pertanyaan: ${err.message}`);
    },
  });

  // Handler untuk submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDomain) {
      alert('Silakan pilih domain');
      return;
    }
    createQuestion({
      question_text: questionText,
      question_type: 'yes_no', // Kita hardcode dulu sesuai rencana
      domainId: selectedDomain,
      assessmentId: assessmentId,
    });
  };

  if (isLoadingQuestions || isLoadingDomains) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading data pertanyaan...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between">
        {/* Nanti kita bisa fetch judul asesmennya juga */}
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
                  {/* Dropdown untuk memilih Domain */}
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
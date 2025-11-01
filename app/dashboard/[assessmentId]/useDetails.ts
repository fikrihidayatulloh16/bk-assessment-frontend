// app/dashboard/[assessmentId]/useDetails.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Assessment } from '../useAssessments';
import { useRouter, useParams } from 'next/navigation';
import { fetchWithCredentials } from '@/lib/api';

// Tipe data yang dibutuhkan
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

// Tipe data untuk form 'create question'
export interface NewQuestionData {
  question_text: string;
  question_type: string;
  domainId: string;
  assessmentId: string;
}

export function useDetails() {
    const router = useRouter();
    const params = useParams(); // <-- Hook untuk mengambil ID dari URL
    const assessmentId = params.assessmentId as string; // Ambil ID asesmen
    const queryClient = useQueryClient();

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
        retry: false,
      });
    
      // Mutation untuk MEMBUAT PERTANYAAN baru
  
      const { mutate: createQuestion, isPending: isCreating } = useMutation({
    mutationFn: (newQuestion: NewQuestionData) =>
      fetchWithCredentials('/questions', {
        method: 'POST',
        body: JSON.stringify(newQuestion),
      }),
    onSuccess: () => {
      // Tugas hook HANYA me-refresh data.
      queryClient.invalidateQueries({ queryKey: ['questions', assessmentId] });
      // HAPUS: Logika UI (setIsModalOpen, dll.) dari sini.
    },
    onError: (err) => {
      // Biarkan hook menangani alert error
      alert(`Gagal menambah pertanyaan: ${err.message}`);
    },
  });

  const { data: assessment, isLoading: isLoadingAssessment } = useQuery<Assessment>({
    queryKey: ['assessment', assessmentId], // Kunci unik
    queryFn: () => fetchWithCredentials(`/assessments/${assessmentId}`),
    retry: false, // Sudah ditangani query lain
  });

  // 4. Kembalikan semua yang dibutuhkan oleh UI
  return {
    assessmentId,
    assessment,
    questions,
    isLoadingQuestions,
    isLoadingAssessment,
    domains,
    isLoadingDomains,
    createQuestion,
    isCreating,
  };
    
}
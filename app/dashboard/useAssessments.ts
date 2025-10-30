// app/dashboard/useAssessments.ts
'use client';

import { useQuery, useMutation, useQueryClient, } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchWithCredentials } from '@/lib/api'; // <-- Impor helper baru kita

// Kita pindahkan Tipe data ke sini juga
export interface Assessment {
  id: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  createdAt: string;
}

// Ini adalah Custom Hook kita
export function useAssessments() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. Logika Mengambil Data (dipindahkan dari page.tsx)
  const {
    data: assessments,
    isLoading,
    error,
  } = useQuery<Assessment[]>({
    queryKey: ['assessments'],
    queryFn: () => fetchWithCredentials('/assessments'), // <-- Gunakan helper baru
    retry: (failureCount, err) => {
      if (err.message.includes('Unauthorized')) {
        router.push('/login');
        return false;
      }
      return failureCount < 3;
    },
  });

  // 2. Logika Membuat Data (dipindahkan dari page.tsx)
  const { mutate: createAssessment, isPending: isCreating } = useMutation({
    mutationFn: (newAssessment: { title: string; description: string }) =>
      fetchWithCredentials('/assessments', { // <-- Gunakan helper baru
        method: 'POST',
        body: JSON.stringify(newAssessment),
      }),
    onSuccess: () => {
      console.log('Asesmen baru berhasil dibuat!');
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
    onError: (err) => {
      alert(`Gagal membuat asesmen: ${err.message}`);
    },
  });

  // 3. Kembalikan semua yang dibutuhkan oleh UI
  return {
    assessments,
    isLoading,
    error,
    createAssessment,
    isCreating,
  };
}
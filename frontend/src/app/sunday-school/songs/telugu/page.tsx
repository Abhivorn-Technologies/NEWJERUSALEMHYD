'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SundaySchoolTeluguPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/songs?language=sunday_telugu');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
        <div className="w-10 h-10 border-4 border-[#8b1e15] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Redirecting to Lyrics Page...</p>
      </div>
    </div>
  );
}

'use client';
import SongAlphabetIndex from '@/components/SongAlphabetIndex';

export default function SundaySchoolHindiPage() {
  return (
    <div className="min-h-screen bg-[#e8f4f8] py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1f4251] mb-3">
            🎵 Sunday School Hindi Songs
          </h1>
          <div className="h-1 w-24 bg-[#8b1e15] mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 font-medium">
            सण्डे स्कूल हिंदी गीत
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <SongAlphabetIndex language="sunday_hindi" alphabet="hindi" />
        </div>
      </div>
    </div>
  );
}

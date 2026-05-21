'use client';
import SongAlphabetIndex from '@/components/SongAlphabetIndex';

export default function SundaySchoolEnglishPage() {
  return (
    <div className="min-h-screen bg-[#e8f4f8] py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1f4251] mb-3">
            🎵 Sunday School English Songs
          </h1>
          <div className="h-1 w-24 bg-[#8b1e15] mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Sunday School English Worship Songs
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <SongAlphabetIndex language="telugu" alphabet="english" />
        </div>
      </div>
    </div>
  );
}

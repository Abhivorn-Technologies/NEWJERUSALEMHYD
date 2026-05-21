'use client';
import { useState } from 'react';
import SongAlphabetIndex from '@/components/SongAlphabetIndex';

export default function SongsPage() {
  const [activeTab, setActiveTab] = useState<'telugu' | 'sunday_telugu' | 'sunday_english' | 'sunday_hindi'>('telugu');

  const tabs = [
    { id: 'telugu', label: 'Telugu Songs' },
    { id: 'sunday_telugu', label: 'Sunday School (Telugu)' },
    { id: 'sunday_english', label: 'Sunday School (English)' },
    { id: 'sunday_hindi', label: 'Sunday School (Hindi)' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#e8f4f8] py-12 px-4 md:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1f4251] mb-3">
            Song Lyrics Index
          </h1>
          <div className="h-1.5 w-24 bg-[#8b1e15] mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 font-medium max-w-xl mx-auto text-sm md:text-base">
            Search, filter, and browse through our complete collection of Sunday School and Congregational Worship songs.
          </p>
        </div>

        {/* Tab selection for original indexes */}
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-gray-200/60 backdrop-blur rounded-2xl max-w-3xl mx-auto border border-gray-300/40">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#1f4251] text-white shadow-md scale-105'
                  : 'text-[#1f4251]/75 hover:bg-white/50 hover:text-[#1f4251]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 md:p-8 transition-all hover:shadow-2xl duration-500">
          <SongAlphabetIndex language={activeTab} />
        </div>

      </div>
    </div>
  );
}

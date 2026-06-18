import Link from 'next/link';
import StoriesTabs from '../StoriesTabs';

export default function BiographicalStoriesPage() {
  return (
    <div className="min-h-screen bg-[#FADADD] py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="mb-6 flex flex-col items-center gap-4">
          <div className="self-start">
            <Link 
              href="/sunday-school" 
              className="inline-flex items-center text-[#4D1C2C]/85 hover:text-[#D81B60] font-semibold transition-colors duration-200"
            >
              <span className="mr-2">&larr;</span> Back to Sunday School
            </Link>
          </div>
        </div>

        {/* Contents Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="pt-6 px-4 sm:px-8">
            <StoriesTabs />
          </div>
          <div className="px-4 sm:px-8 pb-12 pt-6">
            <h1 className="text-4xl font-extrabold text-[#4D1C2C] mb-4 text-center">Biographical Stories</h1>
            <div className="h-1 w-24 bg-[#FF99BE] mx-auto rounded-full mb-12"></div>
            
            {/* Coming Soon Section */}
            <div className="bg-[#FFF0F5]/50 rounded-3xl p-12 shadow-sm border border-pink-100/50 max-w-2xl mx-auto space-y-6 transition-all duration-300">
          <div className="w-20 h-20 bg-[#FFF0F5] rounded-full flex items-center justify-center mx-auto shadow-md text-[#C2185B] animate-pulse">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-[#4D1C2C]">Coming Soon</h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm leading-relaxed">
              We are currently preparing biographical details, timelines, and life stories of key biblical figures for this category. Please check back soon!
            </p>
          </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function PreSchoolStoriesPage() {
  return (
    <div className="min-h-screen bg-[#FADADD] py-16 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        <div>
          <Link 
            href="/stories" 
            className="inline-flex items-center text-[#4D1C2C]/85 hover:text-[#D81B60] font-semibold transition-colors duration-200 mb-6"
          >
            <span className="mr-2">&larr;</span> Back to Stories
          </Link>
          <h1 className="text-4xl font-extrabold text-[#4D1C2C] mb-4">Pre School Stories</h1>
          <div className="h-1 w-24 bg-[#FF99BE] mx-auto rounded-full"></div>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 max-w-2xl mx-auto space-y-6 transition-all duration-300 hover:shadow-2xl">
          <div className="w-20 h-20 bg-[#FFF0F5] rounded-full flex items-center justify-center mx-auto shadow-md text-[#C2185B] animate-pulse">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-[#4D1C2C]">Coming Soon</h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm leading-relaxed">
              We are currently designing simple interactive stories, coloring sheets, and activities for preschool children. Please check back soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

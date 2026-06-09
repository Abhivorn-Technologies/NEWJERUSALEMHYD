import Link from 'next/link';

export default function TopicalStoriesPage() {
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
          <h1 className="text-4xl font-extrabold text-[#4D1C2C] mb-4">Topical Stories</h1>
          <div className="h-1 w-24 bg-[#FF99BE] mx-auto rounded-full"></div>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 max-w-2xl mx-auto space-y-6 transition-all duration-300 hover:shadow-2xl">
          <div className="w-20 h-20 bg-[#FFF0F5] rounded-full flex items-center justify-center mx-auto shadow-md text-[#C2185B] animate-pulse">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-[#4D1C2C]">Coming Soon</h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm leading-relaxed">
              We are currently compiling study materials, thematic illustrations, and topical stories for this category. Please check back soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="bg-white rounded-[30px] shadow-sm p-10 md:p-16 max-w-2xl w-full text-center border border-gray-100">
        <div className="w-24 h-24 bg-[#EAF5F8] rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-12 h-12 text-[#0B7A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-[100px] leading-none font-extrabold text-[#053245] tracking-tight mb-4 select-none">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A4B5C] mb-4">
          Oops! Page Not Found
        </h2>
        
        <p className="text-gray-500 max-w-md mx-auto mb-10 text-sm md:text-base leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0B7A8A] text-white font-bold rounded-full hover:bg-[#09626e] hover:shadow-md transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

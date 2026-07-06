import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="relative">
        <h1 className="text-[120px] md:text-[180px] font-extrabold text-[#003138]/5 select-none leading-none tracking-tighter" style={{ fontFamily: 'var(--font-poppins)' }}>
          404
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-2xl md:text-4xl font-bold text-[#053245] mb-4">Page Not Found</h2>
          <p className="text-[#1F3E50] max-w-md text-sm md:text-base mb-8" style={{ fontFamily: 'var(--font-mallanna)' }}>
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-[#00A6CB] to-[#008CA8] text-white font-bold rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

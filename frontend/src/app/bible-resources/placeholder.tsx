import Link from 'next/link';

export default function PlaceholderPage({ params }: { params: { slug?: string } }) {
  return (
    <div className="min-h-screen bg-[#e8f4f8] py-32 px-6 flex items-center justify-center">
      <div className="bg-white p-12 rounded-3xl shadow-lg border-t-4 border-[#8b1e15] max-w-2xl text-center">
        <div className="text-6xl mb-6">🚧</div>
        <h1 className="text-3xl font-extrabold text-[#1f4251] mb-4">Under Construction</h1>
        <p className="text-gray-600 mb-8 text-lg">
          We are currently updating this section with new and exciting resources. Please check back later!
        </p>
        <Link 
          href="/bible-resources" 
          className="inline-block bg-[#1f4251] text-white px-8 py-3 rounded-full font-bold hover:bg-[#16303b] transition-colors"
        >
          Return to Bible Resources
        </Link>
      </div>
    </div>
  );
}

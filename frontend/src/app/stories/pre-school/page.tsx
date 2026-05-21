import Link from 'next/link';

export default function PreSchoolStoriesPage() {
  return (
    <div className="min-h-screen bg-[#e8f4f8] py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <Link href="/stories" className="text-sm text-[#8b1e15] font-semibold hover:underline mb-4 inline-block">
          &larr; Back to Stories
        </Link>
        <h1 className="text-4xl font-extrabold text-[#1f4251] mb-4">Pre School</h1>
        <div className="h-1 w-24 bg-[#8b1e15] mx-auto rounded-full"></div>
      </div>
    </div>
  );
}

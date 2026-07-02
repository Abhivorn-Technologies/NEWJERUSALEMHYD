import Link from 'next/link';
import ActivitiesTabs from '../ActivitiesTabs';

export const dynamic = 'force-dynamic';

export default async function QuizzesPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  let otStories = [];
  let ntStories = [];

  try {
    const otRes = await fetch(`${API_URL}/content-items/?page_category=Activities&section=Quizzes+OT`, { cache: 'no-store' });
    if (otRes.ok) otStories = await otRes.json();

    const ntRes = await fetch(`${API_URL}/content-items/?page_category=Activities&section=Quizzes+NT`, { cache: 'no-store' });
    if (ntRes.ok) ntStories = await ntRes.json();
  } catch (err) {
    console.error(err);
  }

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

        {/* Single combined card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="pt-6 px-4 sm:px-8">
            <ActivitiesTabs />
          </div>
          <div className="px-4 sm:px-8 pb-8 pt-4">
            <h1 className="text-4xl font-extrabold text-[#4D1C2C] mb-4">Bible Quizzes</h1>
            <div className="h-1 w-24 bg-[#FF99BE] rounded-full"></div>
          </div>
          <div className="bg-[#FF99BE] text-white grid grid-cols-2 divide-x divide-white/20">
            <div className="px-6 py-5">
              <h2 className="text-xl font-bold">OT List</h2>
              <p className="text-white/70 text-xs mt-0.5">Old Testament stories</p>
            </div>
            <div className="px-6 py-5">
              <h2 className="text-xl font-bold">NT List</h2>
              <p className="text-white/70 text-xs mt-0.5">New Testament stories</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">

            {/* OT List */}
            <div>
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="text-xs font-bold text-[#4D1C2C] uppercase tracking-wider">OT List</h3>
              </div>
              <ul className="divide-y divide-gray-100">
                {otStories.map((story: any, i: number) => (
                  <li key={story.id || i}>
                    <a
                      href={story.links?.[0]?.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 px-5 py-3 hover:bg-[#FFF0F5] transition-colors group"
                    >
                      <span className="text-xs font-bold text-[#8b1e15] w-6 shrink-0 pt-0.5">{i + 1}</span>
                      <div>
                        <span className="block text-sm text-gray-800 font-semibold group-hover:text-[#8b1e15] transition-colors line-clamp-1">
                          {story.title}
                        </span>
                        <span className="block text-[11px] text-gray-400 font-normal mt-0.5 line-clamp-2">
                          {story.subtitle}
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* NT List */}
            <div>
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="text-xs font-bold text-[#D81B60] uppercase tracking-wider">NT List</h3>
              </div>
              <ul className="divide-y divide-gray-100">
                {ntStories.map((story: any, i: number) => (
                  <li key={story.id || i}>
                    <a
                      href={story.links?.[0]?.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 px-5 py-3 hover:bg-[#fdf2f2] transition-colors group"
                    >
                      <span className="text-xs font-bold text-[#8b1e15] w-6 shrink-0 pt-0.5">{i + 1}</span>
                      <div>
                        <span className="block text-sm text-gray-800 font-semibold group-hover:text-[#8b1e15] transition-colors line-clamp-1">
                          {story.title}
                        </span>
                        <span className="block text-[11px] text-gray-400 font-normal mt-0.5 line-clamp-2">
                          {story.subtitle}
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

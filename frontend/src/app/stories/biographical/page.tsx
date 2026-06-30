import Link from 'next/link';
import StoriesTabs from '../StoriesTabs';

export const dynamic = 'force-dynamic';

export default async function BiographicalStoriesPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  let storiesList = [];
  try {
    const res = await fetch(`${API_URL}/api/content-items/?page_category=Bible+Stories+%26+Activities&section=Biographical`, { cache: 'no-store' });
    if (res.ok) {
      storiesList = await res.json();
    }
  } catch (err) {
    console.error(err);
  }
  return (
    <div className="min-h-screen bg-[#FADADD] py-16 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
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
          <div className="max-w-5xl mx-auto px-4 sm:px-0 mb-10">
            <div className="bg-[#FF99BE] px-4 sm:px-8 py-6 text-white flex flex-row items-center justify-between gap-4 rounded-t-2xl sm:rounded-2xl shadow-md mb-6">
              <div>
                <h1 className="text-2xl font-bold">Biographical Stories</h1>
                <p className="text-white/80 text-sm mt-1 max-w-md">Learn about the lives of key biblical figures.</p>
              </div>
              <img 
                src="/images/stories/old-testament/image1.jpeg" 
                alt="Biographical Stories" 
                className="w-28 h-18 object-cover rounded-lg border border-white/20 shadow-sm"
              />
            </div>
            
            <div className="overflow-x-auto bg-white rounded-b-2xl sm:rounded-2xl border border-gray-100 shadow-sm">
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr className="bg-pink-50 border-b border-pink-100">
                    <th className="px-2 py-3 sm:px-8 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-[#4D1C2C] uppercase tracking-wider w-16 sm:w-28">
                      Illustration
                    </th>

                    <th className="px-2 py-3 sm:pl-16 sm:pr-6 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-[#4D1C2C] uppercase tracking-wider w-full">
                      Story Title
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {storiesList.map((story: any, index: number) => {
                    return (
                      <tr key={story.id || index} className="hover:bg-pink-50/50 transition-colors">
                        <td className="px-2 py-3 sm:px-8 sm:py-4">
                          <img 
                            src={story.image_url || '/images/default.jpeg'} 
                            alt={story.title} 
                            className="w-14 h-10 sm:w-20 sm:h-14 object-cover rounded-lg shadow-sm border border-gray-100" 
                          />
                        </td>
                        <td className="px-2 py-3 sm:pl-16 sm:pr-6 sm:py-4 break-words">
                          <a
                            href={story.links?.[0]?.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm sm:text-lg text-gray-800 font-semibold hover:text-[#D81B60] hover:underline transition-colors duration-200 cursor-pointer"
                          >
                            {story.title}
                          </a>
                          <span className="block text-[10px] sm:text-xs text-gray-400 font-normal mt-0.5 line-clamp-2">{story.subtitle}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

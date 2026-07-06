import Link from 'next/link';
import StoriesTabs from '../StoriesTabs';

export const dynamic = 'force-dynamic';

export default async function StoriesPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  let storiesList = [];
  try {
    const res = await fetch(`${API_URL}/content-items/?page_category=Bible+Stories+%26+Activities&section=Old+Testament`, { cache: 'no-store' });
    if (res.ok) {
      storiesList = await res.json();
    }
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="min-h-screen bg-[#FADADD] py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="mb-4 flex flex-col items-center gap-4">
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
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden pb-8">
          <div className="pt-4 px-4 sm:px-8">
            <StoriesTabs />
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-0 mt-4">

            
            {storiesList.length > 0 ? (
              <div className="overflow-x-auto bg-white rounded-b-2xl sm:rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full border-collapse table-auto">
                  <thead>
                    <tr className="bg-pink-50 border-b border-pink-100">
                      <th className="px-1 py-3 sm:px-3 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-[#4D1C2C] uppercase tracking-wider w-12 sm:w-24">
                        Illustration
                      </th>
                      <th className="px-1 py-3 sm:px-3 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-[#4D1C2C] uppercase tracking-wider w-full">
                        Story Details
                      </th>
                      <th className="px-1 py-3 sm:px-3 sm:py-3 text-right text-[10px] sm:text-xs font-bold text-[#4D1C2C] uppercase tracking-wider w-20 sm:w-28">
                        Download
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {storiesList.map((story: any, index: number) => {
                      return (
                        <tr key={story.id || index} className="hover:bg-pink-50/50 transition-colors">
                          <td className="px-1 py-2 sm:px-3 sm:py-3">
                            <img 
                              src={story.image_url || '/images/default.jpeg'} 
                              alt={story.title} 
                              className="w-12 h-8 sm:w-16 sm:h-12 object-cover rounded-md shadow-sm border border-gray-100" 
                            />
                          </td>
                          <td className="px-1 py-2 sm:px-3 sm:py-3 break-words">
                            <a 
                              href={story.links?.[0]?.url || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="block text-sm sm:text-[15px] text-gray-800 font-bold hover:text-[#D81B60] hover:underline transition-colors"
                            >
                              {story.title}
                            </a>
                            <span className="block text-[10px] sm:text-xs text-gray-500 font-normal mt-0.5 line-clamp-2">{story.subtitle}</span>
                          </td>
                          <td className="px-1 py-2 sm:px-3 sm:py-3 text-right">
                            <a
                              href={story.links?.[0]?.url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center px-2 py-1 sm:px-3 sm:py-1.5 bg-[#D81B60] text-white text-[10px] sm:text-xs font-bold rounded-md shadow-sm hover:bg-[#C2185B] transition-colors"
                            >
                              PDF
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-[#FFF0F5]/50 rounded-3xl p-8 sm:p-12 shadow-sm border border-pink-100/50 max-w-2xl mx-auto space-y-6 transition-all duration-300">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FFF0F5] rounded-full flex items-center justify-center mx-auto shadow-md text-[#C2185B] animate-pulse">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="space-y-3 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#4D1C2C]">Coming Soon</h3>
                  <p className="text-gray-600 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
                    We are currently preparing details and stories for this category. Please check back soon!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

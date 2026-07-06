import Link from 'next/link';

async function fetchMissionaryStories() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content-items/?page_category=Missionary+Stories', {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching Missionary Stories:', error);
    return [];
  }
}

export default async function MissionaryStoryPage() {
  const allItems = await fetchMissionaryStories();
  const activeItems = allItems.filter((item: any) => item.is_active);

  return (
    <div className="min-h-screen bg-[#e8f4f8] py-16 px-6">
      <div className="max-w-[90%] md:max-w-7xl lg:px-[85px] mx-auto space-y-12">
        
        <div className="text-center mb-16">
          <Link href="/bible-resources" className="text-sm text-[#8b1e15] font-semibold hover:underline mb-4 inline-block">
            &larr; Back to Bible Resources
          </Link>
          <h1 className="text-4xl font-extrabold text-[#1f4251] mb-4">Missionary Stories</h1>
          <div className="h-1 w-24 bg-[#8b1e15] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-700 font-medium max-w-2xl mx-auto">
            Read inspiring stories of missionaries and their faithful journey in spreading the Gospel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeItems.map((item: any, idx: number) => {
             // Missionary stories have an array of links, we just take the first one if it exists
             const firstLink = Array.isArray(item.links) && item.links.length > 0 ? item.links[0] : null;
             const pdfLink = firstLink ? (typeof firstLink === 'string' ? firstLink : firstLink.url) : null;
             
             return (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                <div className="relative h-64 bg-gray-100 p-4 flex items-center justify-center">
                  <img 
                    src={item.cover_image ? item.cover_image : (item.image_url ? item.image_url : item.image)} 
                    alt={item.title || "Missionary Story"} 
                    className="max-h-full max-w-full object-contain drop-shadow-md rounded"
                  />
                </div>
                <div className="p-6 text-center border-t border-gray-50 mt-auto">
                  {pdfLink ? (
                    <a 
                      href={pdfLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-[#1f4251] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#16303b] transition-colors"
                    >
                      Download Document
                    </a>
                  ) : (
                    <span 
                      className="inline-block bg-[#1f4251] text-white px-6 py-2 rounded-full text-sm font-bold opacity-90 cursor-not-allowed shadow-sm"
                    >
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {activeItems.length === 0 && (
          <p className="text-center text-gray-500">No missionary stories found.</p>
        )}
      </div>
    </div>
  );
}

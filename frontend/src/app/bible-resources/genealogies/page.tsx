import Link from 'next/link';

async function fetchBibleGenealogies() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content-items/?page_category=Bible+Genealogies', {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching Bible Genealogies:', error);
    return [];
  }
}

export default async function BibleGenealogiesPage() {
  const allItems = await fetchBibleGenealogies();
  const activeItems = allItems.filter((item: any) => item.is_active);

  // Group items by section
  const groupedSections: Record<string, any[]> = {};
  activeItems.forEach((item: any) => {
    if (!groupedSections[item.section]) {
      groupedSections[item.section] = [];
    }
    groupedSections[item.section].push(item);
  });

  return (
    <div className="min-h-screen bg-[#e8f4f8] py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <Link href="/bible-resources" className="text-sm text-[#8b1e15] font-semibold hover:underline mb-4 inline-block">
            &larr; Back to Bible Resources
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1f4251] mb-4">BIBLE GENEALOGIES</h1>
          <div className="h-1 w-24 bg-[#8b1e15] mx-auto rounded-full"></div>
        </div>

        <div className="space-y-14">
          {Object.entries(groupedSections).map(([sectionTitle, items], si) => (
            <div key={si}>
              <h2 className="text-2xl font-bold text-[#1f4251] mb-6 pb-3 border-b border-gray-300">
                {sectionTitle}
              </h2>
              <div className="space-y-0">
                {items.map((item: any, ii: number) => (
                  <div key={ii} className="py-5 border-b border-gray-200 last:border-b-0 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="font-semibold text-[#1f4251] sm:w-1/2 md:w-2/5 text-base">
                      {item.title}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.links && Array.isArray(item.links) && item.links.map((link: any, li: number) => {
                        const isDownloadAll = link.text.includes('Download All');
                        return (
                          <a
                            key={li}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs font-bold py-1.5 px-3.5 rounded transition-colors ${
                              isDownloadAll
                                ? 'bg-[#8b1e15] text-white hover:bg-red-800'
                                : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {link.text.replace(/\u200b/g, '')}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {activeItems.length === 0 && (
            <p className="text-center text-gray-500">No genealogies found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface StoryCategory {
  id: number;
  title: string;
  link: string;
}

async function getStoryCategories(): Promise<StoryCategory[]> {
  try {
    const res = await fetch(`${BASE_URL}/story-categories/`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function StoriesPage() {
  const categories = await getStoryCategories();

  return (
    <div className="min-h-screen bg-[#e8f4f8] py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center mb-16 reveal">
          <Link href="/sunday-school" className="inline-flex items-center text-[#1f4251]/80 hover:text-[#8b1e15] font-semibold transition-colors duration-200 mb-6">
            <span className="mr-2">&larr;</span> Back to Sunday School
          </Link>
          <h1 className="text-4xl font-extrabold text-[#1f4251] mb-4">Bible Stories</h1>
          <div className="h-1 w-24 bg-[#8b1e15] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-700 font-medium max-w-2xl mx-auto">
            Explore wonderful stories from the Bible categorized for easy reading.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-3xl mx-auto">
          {categories.map((category) => {
            let finalLink = category.link;
            let icon = '📖';
            let desc = 'Wonderful stories from the Bible.';
            
            if (category.title.toLowerCase().includes('old')) {
              finalLink = '/stories/old-testament';
              icon = '📜';
              desc = 'Explore stories from Creation through the Prophets.';
            } else if (category.title.toLowerCase().includes('new')) {
              finalLink = '/stories/new-testament';
              icon = '📖';
              desc = 'Read stories about the life of Jesus and the early Church.';
            }

            return (
              <Link key={category.id} href={finalLink} className="group block w-full md:w-80">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col justify-between cursor-pointer">
                  <div>
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                      {icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#1f4251] mb-2 group-hover:text-[#8b1e15] transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{desc}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

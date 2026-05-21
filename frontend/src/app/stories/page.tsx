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
        <div className="text-center mb-16">
          <Link href="/sunday-school" className="text-sm text-[#8b1e15] font-semibold hover:underline mb-4 inline-block">
            &larr; Back to Sunday School
          </Link>
          <h1 className="text-4xl font-extrabold text-[#1f4251] mb-4">Bible Stories</h1>
          <div className="h-1 w-24 bg-[#8b1e15] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-700 font-medium max-w-2xl mx-auto">
            Explore wonderful stories from the Bible categorized for easy reading.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <Link key={category.id} href={category.link} className="group block">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center transition-all hover:shadow-md hover:-translate-y-1">
                <h3 className="text-lg font-bold text-[#1f4251] group-hover:text-[#8b1e15] transition-colors">
                  {category.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

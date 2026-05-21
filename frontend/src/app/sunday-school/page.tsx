import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface StoryCategory {
  id: number;
  title: string;
  link: string;
}

interface Activity {
  id: number;
  title: string;
  icon: string;
  link: string;
}

async function getData() {
  try {
    const [storiesRes, activitiesRes] = await Promise.all([
      fetch(`${BASE_URL}/story-categories/`, { cache: 'no-store' }),
      fetch(`${BASE_URL}/activities/`, { cache: 'no-store' }),
    ]);
    const stories: StoryCategory[] = storiesRes.ok ? await storiesRes.json() : [];
    const activities: Activity[] = activitiesRes.ok ? await activitiesRes.json() : [];
    return { stories, activities };
  } catch { return { stories: [], activities: [] }; }
}

export default async function SundaySchoolPage() {
  const { stories, activities } = await getData();

  const sections = [
    { title: 'Telugu Songs', icon: '🎵', link: '/songs', description: 'Sunday School songs in Telugu' },
    { title: 'English Songs', icon: '🎵', link: '/songs', description: 'Sunday School songs in English' },
    { title: 'Hindi Songs', icon: '🎵', link: '/songs', description: 'Sunday School songs in Hindi' },
    ...stories.map(s => ({ title: s.title, icon: '📖', link: s.link, description: 'Bible story for children' })),
    ...activities.map(a => ({ title: a.title, icon: a.icon, link: a.link, description: 'Fun activity for children' })),
  ];

  return (
    <div className="min-h-screen bg-[#e8f4f8] py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-[#1f4251] mb-4">Sunday School</h1>
          <div className="h-1 w-24 bg-[#8b1e15] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-700 font-medium max-w-2xl mx-auto">
            Resources, songs, and activities designed to nurture the faith of our children.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section, idx) => (
            <Link key={idx} href={section.link} className="group block">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                  {section.icon}
                </div>
                <h3 className="text-xl font-bold text-[#1f4251] mb-2 group-hover:text-[#8b1e15] transition-colors">
                  {section.title}
                </h3>
                <p className="text-gray-600 text-sm">{section.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

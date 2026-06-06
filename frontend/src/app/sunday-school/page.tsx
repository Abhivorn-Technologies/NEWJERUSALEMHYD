import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface Activity {
  id: number;
  title: string;
  icon: string;
  link: string;
}

async function getData() {
  try {
    const activitiesRes = await fetch(`${BASE_URL}/activities/`, { cache: 'no-store' });
    const activities: Activity[] = activitiesRes.ok ? await activitiesRes.json() : [];
    return { activities };
  } catch { return { activities: [] }; }
}

export default async function SundaySchoolPage() {
  const { activities } = await getData();

  return (
    <div className="min-h-screen bg-[#e8f4f8] py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center mb-16 reveal">
          <h1 className="text-4xl font-extrabold text-[#1f4251] mb-4">Sunday School</h1>
          <div className="h-1 w-24 bg-[#8b1e15] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-700 font-medium max-w-2xl mx-auto">
            Resources, songs, and activities designed to nurture the faith of our children.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Sunday School Songs Card */}
          <Link href="/sunday-school/songs" className="group block reveal-scale">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col justify-between">
              <div>
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                  🎵
                </div>
                <h3 className="text-xl font-bold text-[#1f4251] mb-2 group-hover:text-[#8b1e15] transition-colors">
                  Sunday School Songs
                </h3>
                <p className="text-gray-600 text-sm">Sunday School songs in Telugu, English, and Hindi</p>
              </div>
            </div>
          </Link>

          {/* Stories from Bible Card */}
          <Link href="/stories" className="group block reveal-scale">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col justify-between">
              <div>
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                  📖
                </div>
                <h3 className="text-xl font-bold text-[#1f4251] mb-2 group-hover:text-[#8b1e15] transition-colors">
                  Stories from Bible
                </h3>
                <p className="text-gray-600 text-sm">Explore wonderful Old and New Testament stories</p>
              </div>
            </div>
          </Link>

          {/* Activities Cards */}
          {activities.map((act, idx) => {
            const delayClass = `reveal-delay-${((idx % 3) + 1) * 100}`;
            return (
              <Link key={act.id} href={act.link} className={`group block reveal-scale ${delayClass}`}>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                      {act.icon || '🎨'}
                    </div>
                    <h3 className="text-xl font-bold text-[#1f4251] mb-2 group-hover:text-[#8b1e15] transition-colors">
                      {act.title}
                    </h3>
                    <p className="text-gray-600 text-sm">Fun activity for children</p>
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

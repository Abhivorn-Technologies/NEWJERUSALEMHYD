import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface Activity {
  id: number;
  title: string;
  icon: string;
  link: string;
}

async function getActivities(): Promise<Activity[]> {
  try {
    const res = await fetch(`${BASE_URL}/activities/`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <div className="min-h-screen bg-[#e8f4f8] py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center mb-16 reveal">
          <Link href="/sunday-school" className="text-sm text-[#8b1e15] font-semibold hover:underline mb-4 inline-block">
            &larr; Back to Sunday School
          </Link>
          <h1 className="text-4xl font-extrabold text-[#1f4251] mb-4">Activities</h1>
          <div className="h-1 w-24 bg-[#8b1e15] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-700 font-medium max-w-2xl mx-auto">
            Fun and engaging activities for children to learn about the Bible.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {activities.map((activity, idx) => {
            const delayClass = `reveal-delay-${((idx % 2) + 1) * 100}`;
            return (
              <Link key={activity.id} href={activity.link} className={`group block reveal-scale ${delayClass}`}>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center transition-all hover:shadow-lg hover:-translate-y-2">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                    {activity.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[#1f4251] group-hover:text-[#8b1e15] transition-colors">
                    {activity.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

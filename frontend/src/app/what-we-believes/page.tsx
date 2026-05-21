const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface Belief {
  id: number;
  icon: string;
  title: string;
  content: string;
}

async function getBeliefs(): Promise<Belief[]> {
  try {
    const res = await fetch(`${BASE_URL}/beliefs/`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function WhatWeBelievesPage() {
  const beliefs = await getBeliefs();

  return (
    <div className="min-h-screen bg-[#e8f4f8] py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#1f4251] mb-4">What We Believe</h1>
          <div className="h-1 w-24 bg-[#8b1e15] mx-auto rounded-full"></div>
        </div>

        {beliefs.map(belief => (
          <div key={belief.id} className="bg-[#f4f2ef] p-10 rounded-2xl shadow-sm border-l-4 border-[#8b1e15]">
            <h2 className="text-2xl font-bold text-[#1f4251] mb-4 flex items-center gap-3">
              <span>{belief.icon}</span> {belief.title}
            </h2>
            <p className="text-gray-800 leading-relaxed font-medium">{belief.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

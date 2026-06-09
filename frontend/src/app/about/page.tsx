import React from 'react';
import ScrollToHash from '@/components/ScrollToHash';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface Belief {
  id: number;
  icon: string;
  title: string;
  content: string;
}

async function getAboutPage() {
  try {
    const res = await fetch(`${BASE_URL}/pages/about/`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function getBeliefs(): Promise<Belief[]> {
  try {
    const res = await fetch(`${BASE_URL}/beliefs/`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function AboutPage() {
  const [page, beliefs] = await Promise.all([getAboutPage(), getBeliefs()]);

  return (
    <div className="min-h-screen bg-[#e8f4f8] py-16 px-6" style={{ fontFamily: 'var(--font-poppins)' }}>
      <ScrollToHash />
      <div className="max-w-6xl mx-auto space-y-12">
        <div id="mission-vision">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-[#1f4251] mb-4">About Us</h1>
            <div className="h-1.5 w-16 bg-[#AB2423] mx-auto rounded-full"></div>
          </div>
          <div
            className="about-content grid grid-cols-1 md:grid-cols-2 gap-8 [&_p]:text-justify [&_div]:text-justify text-justify"
            dangerouslySetInnerHTML={{ __html: page?.content ?? '' }}
          />
        </div>

        {/* What We Believe Section */}
        {beliefs.length > 0 && (
          <div id="what-we-believe" className="scroll-mt-24 pt-12 border-t border-gray-300/40">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-[#1f4251] mb-4">What We Believe</h2>
              <div className="h-1.5 w-16 bg-[#AB2423] mx-auto rounded-full"></div>
            </div>
            <div className="space-y-6 max-w-4xl mx-auto">
              {beliefs.map(belief => (
                <div 
                  key={belief.id} 
                  className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-200/80 border-l-4 border-l-[#AB2423] transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:scale-[1.01] hover:border-[#AB2423]/30"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-[#1f4251] mb-3 flex items-center gap-3">
                    <span className="text-2xl md:text-3xl">{belief.icon}</span> {belief.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-medium text-sm md:text-base text-justify">
                    {belief.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

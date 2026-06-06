import React from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function getAboutPage() {
  try {
    const res = await fetch(`${BASE_URL}/pages/about/`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function AboutPage() {
  const page = await getAboutPage();

  return (
    <div className="min-h-screen bg-[#e8f4f8] py-16 px-6" style={{ fontFamily: 'var(--font-poppins)' }}>
      <div className="max-w-6xl mx-auto space-y-12">
        <div id="mission-vision">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-[#1f4251] mb-4">About Us</h1>
            <div className="h-1.5 w-16 bg-[#AB2423] mx-auto rounded-full"></div>
          </div>
          <div
            className="about-content grid grid-cols-1 md:grid-cols-2 gap-8"
            dangerouslySetInnerHTML={{ __html: page?.content ?? '' }}
          />
        </div>
      </div>
    </div>
  );
}

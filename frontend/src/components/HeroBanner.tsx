'use client';
import { useEffect, useState } from 'react';

interface HeroItem {
  id: number;
  icon: string;
  text: string;
  order: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function HeroBanner() {
  const [heroItems, setHeroItems] = useState<HeroItem[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/hero-items/`)
      .then(r => r.json())
      .then(setHeroItems)
      .catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#A4DCE0] to-[#7ACED4]">
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none" style={{ height: '420px' }}>
        <svg
          className="relative"
          style={{ width: 'calc(180% + 1.3px)', height: '420px', left: '50%', transform: 'translateX(-50%)' }}
          viewBox="0 0 1000 420"
          preserveAspectRatio="none"
          fill="#ffffff"
        >
          <path d="M0,0 C200,200 500,50 1000,200 L1000,0 L0,0 Z" opacity="0.15" />
          <path d="M0,50 C300,250 600,0 1000,150 L1000,0 L0,0 Z" opacity="0.1" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center min-h-[70vh] py-16 md:py-0">
          {/* Left Column */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start relative mb-8 md:mb-0">
            <div className="relative">
              <img src="/wp-content/uploads/2026/03/text-image.png" alt="New Jerusalem Ministries" className="w-3/4 md:w-[65%] mx-auto md:ml-[72px] object-contain" />
              <img src="/wp-content/uploads/2026/03/book-image.png" alt="Book" className="w-1/2 md:w-[55%] object-contain hidden md:block" style={{ margin: '-74px 0 0 -67px' }} />
              <img src="/wp-content/uploads/2026/03/boat.png" alt="Boat" className="w-1/3 md:w-[40%] object-contain mt-4 ml-auto" />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-end gap-8">
            <div className="w-full max-w-md space-y-3" style={{ fontFamily: 'var(--font-suranna)', fontSize: '24px' }}>
              {heroItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-lg px-5 py-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[#173C4E]">{item.text}</span>
                </div>
              ))}
            </div>
            <img src="/wp-content/uploads/2026/03/fish.png" alt="Fish" className="w-32 md:w-40 object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}

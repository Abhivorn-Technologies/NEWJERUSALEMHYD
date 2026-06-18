"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StoriesTabs() {
  const pathname = usePathname();
  const tabs = [
    { path: '/stories/old-testament', label: 'Old Testament' },
    { path: '/stories/new-testament', label: 'New Testament' },
    { path: '/stories/topical', label: 'Topical' },
    { path: '/stories/biographical', label: 'Biographical' },
    { path: '/stories/pre-school', label: 'Pre School' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-1.5 items-end mb-8 mt-2 sticky top-4 z-10 border-b border-gray-200 pb-4">
      {tabs.map(tab => {
        const isActive = pathname === tab.path;
        return (
          <Link
            key={tab.path}
            href={tab.path}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm border ${
              isActive 
                ? 'bg-[#FF99BE] text-white border-transparent' 
                : 'bg-[#FFF0F3] text-[#A04A65] border-[#FFC2D9] hover:bg-[#FFE0E9]'
            }`}
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

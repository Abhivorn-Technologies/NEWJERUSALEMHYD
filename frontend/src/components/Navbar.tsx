'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NavChild {
  id: number;
  label: string;
  url: string;
}

interface NavItem {
  id: number;
  label: string;
  url: string;
  children: NavChild[];
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function Navbar() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/nav-menu/`)
      .then(r => r.json())
      .then(setNavItems)
      .catch(() => {});
  }, []);

  return (
    <nav className="bg-[#173C4E] text-white shadow-lg sticky top-0 z-50" style={{ fontFamily: 'var(--font-poppins)' }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        <Link href="/" className="flex items-center py-2">
          <img
            src="/wp-content/2025/11/CL-Circle-logo-12-e1775125631656.png"
            alt="New Jerusalem Ministries Logo"
            className="h-14 w-auto object-contain"
          />
        </Link>
        <div className="hidden md:flex gap-1">
          {navItems.map(item => (
            item.children.length > 0 ? (
              <div key={item.id} className="relative group cursor-pointer">
                <Link href={item.url} className="px-4 py-6 text-sm font-[400] hover:text-gray-300 transition-colors flex items-center gap-1">
                  {item.label}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute hidden group-hover:block bg-[#173C4E] text-white py-1 shadow-lg min-w-[220px] border-t border-gray-500/30">
                  {item.children.map((child, idx) => (
                    <Link
                      key={child.id}
                      href={child.url}
                      className={`block px-6 py-3 text-sm font-[400] hover:bg-[#1f5268] transition-colors ${idx > 0 ? 'border-t border-gray-500/30' : ''}`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={item.id} href={item.url} className="px-4 py-6 text-sm font-[400] hover:text-gray-300 transition-colors">
                {item.label}
              </Link>
            )
          ))}
        </div>
      </div>
    </nav>
  );
}

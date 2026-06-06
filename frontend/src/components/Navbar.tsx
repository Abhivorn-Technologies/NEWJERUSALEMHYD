'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

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
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    fetch(`${BASE_URL}/nav-menu/`)
      .then(r => r.json())
      .then(setNavItems)
      .catch(() => {});
  }, []);

  return (
    <nav className="bg-[#F9F9F9] text-gray-800 shadow-sm border-b border-gray-200/50 sticky top-0 z-50" style={{ fontFamily: 'var(--font-poppins)' }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        <Link href="/" className="flex items-center py-2">
          <img
            src="/images/main_logo.png"
            alt="New Jerusalem Ministries Logo"
            className="h-14 w-auto object-contain"
          />
        </Link>
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-[#173C4E] hover:text-[#AB2423] focus:outline-none"
          aria-expanded={isOpen}
          id="mobile-menu-button"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <div className="hidden md:flex gap-1">
          {navItems.map(item => {
            const isActive = pathname === item.url || (item.url === '/' && pathname === '/');
            const linkColorClass = isActive ? 'text-[#AB2423] font-semibold' : 'text-[#173C4E] hover:text-[#AB2423]';
            
            return item.children.length > 0 ? (
              <div key={item.id} className="relative group cursor-pointer">
                <div className={`px-4 py-6 text-sm font-[500] transition-colors flex items-center gap-1 ${linkColorClass}`}>
                  {item.label}
                  <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="absolute hidden group-hover:block bg-white text-gray-800 py-1 shadow-lg min-w-[220px] border border-gray-200/80 rounded-b-lg">
                  {item.children.map((child, idx) => {
                    const isChildActive = pathname === child.url;
                    return (
                      <Link
                        key={child.id}
                        href={child.url}
                        className={`block px-6 py-3 text-sm font-[400] transition-colors ${
                          isChildActive ? 'text-[#AB2423] bg-gray-50' : 'text-gray-700 hover:bg-gray-50 hover:text-[#AB2423]'
                        } ${idx > 0 ? 'border-t border-gray-100' : ''}`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Link 
                key={item.id} 
                href={item.url} 
                className={`px-4 py-6 text-sm font-[500] transition-colors ${linkColorClass}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden fixed top-[72px] inset-x-0 bottom-0 h-[calc(100vh-72px)] bg-[#F9F9F9] z-40 overflow-y-auto px-6 py-6 space-y-3 pb-16">
          {navItems.map(item => {
            const isActive = pathname === item.url || (item.url === '/' && pathname === '/');
            const linkColorClass = isActive ? 'text-[#AB2423] font-semibold' : 'text-[#173C4E] hover:text-[#AB2423]';
            
            return (
              <div key={item.id} className="py-1">
                {item.children.length > 0 ? (
                  <div className="space-y-1">
                    <div className={`px-3 py-2 text-sm font-[500] flex items-center justify-between ${linkColorClass}`}>
                      {item.label}
                    </div>
                    <div className="pl-4 border-l border-gray-200 space-y-1">
                      {item.children.map(child => {
                        const isChildActive = pathname === child.url;
                        return (
                          <Link
                            key={child.id}
                            href={child.url}
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-2 text-xs font-[400] transition-colors rounded ${
                              isChildActive ? 'text-[#AB2423] bg-gray-50' : 'text-gray-700 hover:bg-gray-50 hover:text-[#AB2423]'
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <Link 
                    href={item.url} 
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 text-sm font-[500] transition-colors rounded ${linkColorClass}`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}

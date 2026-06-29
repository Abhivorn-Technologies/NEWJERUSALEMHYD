'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading dashboard...</div>}>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </Suspense>
  );
}

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAuth, setIsAuth] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Songs', 'Bible Resources', 'Bible Stories & Activities']);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/');
    } else {
      setIsAuth(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/');
  };

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]
    );
  };

  const getFullUrl = () => {
    const qs = searchParams.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };
  const currentUrl = getFullUrl();

  if (!isAuth) {
    return null; // or a loading spinner
  }

  const navStructure = [
    { href: '/dashboard', label: 'Dashboard' },
    {
      label: 'Songs',
      children: [
        { href: '/dashboard/songs', label: 'All Songs' },
        { href: '/dashboard/songs/categories', label: 'Categories' },
      ]
    },
    {
      label: 'Bible Resources',
      children: [
        { href: '/dashboard/content?section=Infographics', label: 'Infographics' },
        { href: '/dashboard/content?section=Maps', label: 'Maps' },
        { href: '/dashboard/content?section=Resource Stories', label: 'Resource Stories' },
        { href: '/dashboard/content?section=Downloads', label: 'Downloads' },
        { href: '/dashboard/content?section=Genealogies', label: 'Genealogies' },
      ]
    },
    { href: '/dashboard/content?section=Missionary Stories', label: 'Missionary Stories' },
    {
      label: 'Bible Stories & Activities',
      children: [
        { href: '/dashboard/content?section=Old Testament', label: 'Old Testament' },
        { href: '/dashboard/content?section=New Testament', label: 'New Testament' },
        { href: '/dashboard/content?section=Topical', label: 'Topical' },
        { href: '/dashboard/content?section=Biographical', label: 'Biographical' },
        { href: '/dashboard/content?section=Pre School', label: 'Pre School' },
        { href: '/dashboard/content?section=Coloring', label: 'Coloring' },
        { href: '/dashboard/content?section=Puzzles', label: 'Puzzles' },
        { href: '/dashboard/content?section=Quizzes', label: 'Quizzes' },
      ]
    },
    { href: '/dashboard/pages', label: 'Page Content' },
    { href: '/dashboard/magazines', label: 'Digital Magazines' },
    { href: '/dashboard/prayer-requests', label: 'Prayer Requests' },
    { href: '/dashboard/magazine-subscriptions', label: 'Magazine Subscriptions' },
    { href: '/dashboard/contact', label: 'Contact Inbox' },
    { href: '/dashboard/reviews', label: 'Reviews' },
    { href: '/dashboard/settings', label: 'Site Settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] text-white flex flex-col overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-400">NJM Admin</h2>
        </div>
        <nav className="flex-1 px-4 space-y-1 pb-4">
          {navStructure.map((item, idx) => {
            if (item.children) {
              const isExpanded = expandedMenus.includes(item.label);
              return (
                <div key={idx} className="mb-1">
                  <button 
                    onClick={() => toggleMenu(item.label)}
                    className="w-full text-left px-4 py-2 rounded-lg transition hover:bg-gray-800 flex justify-between items-center font-medium"
                  >
                    {item.label}
                    <span className="text-xs">{isExpanded ? '▼' : '▶'}</span>
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-2">
                      {item.children.map(child => {
                        const isActive = currentUrl.replace(/\+/g, '%20') === child.href.replace(/ /g, '%20');
                        return (
                          <Link 
                            key={child.href} 
                            href={child.href} 
                            className={`block px-4 py-1.5 rounded-lg transition text-sm ${
                              isActive ? 'bg-blue-600 text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = currentUrl.replace(/\+/g, '%20') === item.href?.replace(/ /g, '%20');
            return (
              <Link 
                key={idx} 
                href={item.href!} 
                className={`block px-4 py-2 rounded-lg transition font-medium ${
                  isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link href="/" target="_blank" className="block text-center w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-sm font-medium">
            View Site
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between z-10">
          <h1 className="text-xl font-semibold text-gray-800">
            {navStructure.flatMap(n => n.children || n).find(l => currentUrl.replace(/\+/g, '%20') === l.href?.replace(/ /g, '%20'))?.label || 'Admin Panel'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Welcome, Admin</span>
          </div>
        </header>
        <div className="p-8 overflow-y-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}

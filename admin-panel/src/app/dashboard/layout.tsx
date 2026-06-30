'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { 
  LayoutDashboard, Music, BookOpen, Globe, Layers, 
  FileText, BookType, MessageSquare, Mail, Star, Settings,
  ChevronDown, ChevronRight
} from 'lucide-react';

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
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/');
    } else {
      setIsAuth(true);
    }
  }, [router]);

  useEffect(() => {
    // Automatically expand the menu that matches the current pathname
    if (pathname.includes('/dashboard/songs')) {
      setExpandedMenus(prev => prev.includes('Songs') ? prev : [...prev, 'Songs']);
    } else if (pathname.includes('/dashboard/resources')) {
      setExpandedMenus(prev => prev.includes('Bible Resources') ? prev : [...prev, 'Bible Resources']);
    } else if (pathname.includes('/dashboard/content')) {
      setExpandedMenus(prev => prev.includes('Bible Stories & Activities') ? prev : [...prev, 'Bible Stories & Activities']);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/');
  };

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) ? [] : [label]
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
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      label: 'Songs',
      href: '/dashboard/songs',
      icon: Music,
      children: [
        { href: '/dashboard/songs', label: 'All Songs' },
        { href: '/dashboard/songs/add', label: 'Add Song' },
        { href: '/dashboard/songs/categories', label: 'Categories' },
      ]
    },
    {
      label: 'Bible Resources',
      href: '/dashboard/resources',
      icon: BookOpen,
      children: [
        { href: '/dashboard/resources', label: 'All Resources' },
        { href: '/dashboard/resources?category=Bible Infographics', label: 'Infographics' },
        { href: '/dashboard/resources?category=Bible Maps', label: 'Maps' },
        { href: '/dashboard/resources?category=Bible Downloads', label: 'Downloads' },
        { href: '/dashboard/resources?category=Bible Genealogies', label: 'Genealogies' },
      ]
    },
    { href: '/dashboard/missionary-stories', label: 'Missionary Stories', icon: Globe },
    {
      label: 'Bible Stories & Activities',
      href: '/dashboard/content',
      icon: Layers,
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
    { href: '/dashboard/pages', label: 'Page Content', icon: FileText },
    { href: '/dashboard/magazines', label: 'Digital Magazines', icon: BookType },
    { href: '/dashboard/prayer-requests', label: 'Prayer Requests', icon: MessageSquare },
    { href: '/dashboard/magazine-subscriptions', label: 'Magazine Subscriptions', icon: Mail },
    { href: '/dashboard/contact', label: 'Contact Inbox', icon: Mail },
    {
      label: 'Site Configuration',
      href: '/dashboard/settings',
      icon: Settings,
      children: [
        { href: '/dashboard/nav-menu', label: 'Navigation Menu' },
        { href: '/dashboard/hero-items', label: 'Hero Banner' },
        { href: '/dashboard/beliefs', label: 'What We Believe' },
        { href: '/dashboard/settings', label: 'Site Settings' },
      ]
    },
  ];

  return (
    <div className="flex h-screen bg-[#f1f4f6]">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#FADADD] text-[#4D1C2C] flex flex-col overflow-y-auto">
        <div className="p-6 flex flex-col">
          <div className="bg-white rounded-[20px] p-2 mb-4 shadow-sm inline-flex items-center justify-center relative w-full h-[70px]">
             <Image src="/images/logo.png" alt="Logo" fill className="object-contain p-2" />
          </div>
          <h2 className="text-[#D04A73] text-xs font-black tracking-widest uppercase">Site Admin</h2>
        </div>
        
        <nav className="flex-1 space-y-1 pb-4 scrollbar-thin scrollbar-thumb-black/10">
          {navStructure.map((item, idx) => {
            const Icon = item.icon;
            
            if (item.children) {
              const isExpanded = expandedMenus.includes(item.label);
              return (
                <div key={idx} className="mb-1">
                  <button 
                    onClick={() => {
                      if (item.href) router.push(item.href);
                      toggleMenu(item.label);
                    }}
                    className="w-full text-left px-6 py-3 transition hover:bg-white/40 flex justify-between items-center font-medium border-l-[3px] border-transparent hover:text-[#D04A73]"
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon size={20} className="opacity-90" />}
                      <span className="text-[15px] font-semibold">{item.label}</span>
                    </div>
                    {isExpanded ? <ChevronDown size={18} className="opacity-70" /> : <ChevronRight size={18} className="opacity-70" />}
                  </button>
                  {isExpanded && (
                    <div className="bg-black/5 py-2">
                      {item.children.map(child => {
                        const isActive = currentUrl.replace(/\+/g, '%20') === child.href.replace(/ /g, '%20');
                        return (
                          <Link 
                            key={child.href} 
                            href={child.href} 
                            className={`block px-6 py-2 pl-14 transition text-sm ${
                              isActive ? 'text-[#D04A73] font-bold' : 'text-[#4D1C2C]/80 hover:text-[#D04A73] hover:bg-white/40'
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
                className={`flex items-center gap-3 px-6 py-3 transition font-medium border-l-[3px] ${
                  isActive ? 'bg-white/60 text-[#D04A73] border-[#D04A73]' : 'border-transparent hover:bg-white/40 text-[#4D1C2C]/90 hover:text-[#D04A73] hover:border-transparent'
                }`}
              >
                {Icon && <Icon size={20} className={isActive ? 'opacity-100' : 'opacity-80'} />}
                <span className="text-[15px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-black/5 space-y-2 pb-6">
          <Link href="/" target="_blank" className="block text-center w-full px-4 py-2 bg-white/50 hover:bg-white/80 rounded-lg transition text-sm font-semibold text-[#4D1C2C]">
            View Site
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition text-sm font-semibold text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-6 md:p-10 mx-auto w-full max-w-7xl">
          <div className="flex-1">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

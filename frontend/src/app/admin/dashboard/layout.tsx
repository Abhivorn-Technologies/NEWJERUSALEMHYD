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
      router.push('/admin');
    } else {
      setIsAuth(true);
    }
  }, [router]);

  useEffect(() => {
    // Automatically expand the menu that matches the current pathname
    if (pathname.includes('/admin/dashboard/songs')) {
      setExpandedMenus(prev => prev.includes('Songs') ? prev : [...prev, 'Songs']);
    } else if (pathname.includes('/admin/dashboard/resources')) {
      setExpandedMenus(prev => prev.includes('Bible Resources') ? prev : [...prev, 'Bible Resources']);
    } else if (pathname.includes('/admin/dashboard/content')) {
      setExpandedMenus(prev => prev.includes('Bible Stories & Activities') ? prev : [...prev, 'Bible Stories & Activities']);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
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
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      label: 'Songs',
      href: '/admin/dashboard/songs',
      icon: Music,
      children: [
        { href: '/admin/dashboard/songs', label: 'All Songs' },
        { href: '/admin/dashboard/songs/add', label: 'Add Song' },
        { href: '/admin/dashboard/songs/categories', label: 'Categories' },
      ]
    },
    {
      label: 'Bible Resources',
      href: '/admin/dashboard/resources',
      icon: BookOpen,
      children: [
        { href: '/admin/dashboard/bible-resource-cards', label: 'Resource Cards' },
        { href: '/admin/dashboard/resources', label: 'All Resources' },
        { href: '/admin/dashboard/resources?category=bible-infographics', label: 'Infographics' },
        { href: '/admin/dashboard/resources?category=bible-maps', label: 'Maps' },
        { href: '/admin/dashboard/resources?category=bible-downloads', label: 'Downloads' },
        { href: '/admin/dashboard/resources?category=bible-genealogies', label: 'Genealogies' },
      ]
    },
    { href: '/admin/dashboard/missionary-stories', label: 'Missionary Stories', icon: Globe },
    {
      label: 'Bible Stories & Activities',
      href: '/admin/dashboard/content',
      icon: Layers,
      children: [
        { href: '/admin/dashboard/content?section=Old Testament', label: 'Old Testament' },
        { href: '/admin/dashboard/content?section=New Testament', label: 'New Testament' },
        { href: '/admin/dashboard/content?section=Topical', label: 'Topical' },
        { href: '/admin/dashboard/content?section=Biographical', label: 'Biographical' },
        { href: '/admin/dashboard/content?section=Pre School', label: 'Pre School' },
        { href: '/admin/dashboard/content?section=Coloring', label: 'Coloring' },
        { href: '/admin/dashboard/content?section=Puzzles', label: 'Puzzles' },
        { href: '/admin/dashboard/content?section=Quizzes', label: 'Quizzes' },
      ]
    },
    { href: '/admin/dashboard/magazines', label: 'Digital Magazines', icon: BookType },
    { href: '/admin/dashboard/prayer-requests', label: 'Prayer Requests', icon: MessageSquare },
    { href: '/admin/dashboard/magazine-subscriptions', label: 'Magazine Subscriptions', icon: Mail },
    {
      label: 'Site Configuration',
      href: '/admin/dashboard/settings',
      icon: Settings,
      children: [
        { href: '/admin/dashboard/settings', label: 'Site Settings' },
        { href: '/admin/dashboard/change-password', label: 'Change Password' },
      ]
    },
  ];

  return (
    <div className="flex h-screen bg-[#f1f4f6]">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#FADADD] text-[#4D1C2C] flex flex-col overflow-y-auto">
        <div className="w-full h-24 relative mt-4 mb-2 shrink-0">
          <Image src="/images/navbar_logo.png" alt="Logo" fill className="object-contain" />
        </div>
        
        <div className="px-6 flex flex-col">
          <div className="border-b border-gray-100/50 mb-4"></div>
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
                    className="w-full text-left px-6 py-3 transition hover:bg-white/40 flex justify-between items-center border-l-[3px] border-transparent hover:text-[#D04A73]"
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon size={20} className="opacity-90" />}
                      <span className="text-[15px]">{item.label}</span>
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
                              isActive ? 'text-[#D04A73] ' : 'text-[#4D1C2C]/80 hover:text-[#D04A73] hover:bg-white/40'
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
                className={`flex items-center gap-3 px-6 py-3 transition  border-l-[3px] ${
                  isActive ? 'bg-white/60 text-[#D04A73] border-[#D04A73]' : 'border-transparent hover:bg-white/40 text-[#4D1C2C]/90 hover:text-[#D04A73] hover:border-transparent'
                }`}
              >
                {Icon && <Icon size={20} className={isActive ? 'opacity-100' : 'opacity-80'} />}
                <span className="text-[15px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-black/5 space-y-2 pb-6">
          <Link href="/" target="_blank" className="block text-center w-full px-4 py-2 bg-white/50 hover:bg-white/80 rounded-lg transition text-sm text-[#4D1C2C]">
            View Site
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition text-sm text-white"
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
